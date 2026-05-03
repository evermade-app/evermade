import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { FOUNDER_EMAIL } from "@/lib/credits";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, account }) {
      // account is only present on a fresh OAuth sign-in
      if (account) {
        try {
          const supabase = createServiceSupabaseClient();
          const email = token.email!;

          const { data: profile } = await supabase
            .from("profiles")
            .select("id, plan")
            .eq("email", email)
            .maybeSingle();

          const isFounder = email.toLowerCase() === FOUNDER_EMAIL;
          if (profile) {
            token.uid = profile.id as string;
            // Founder always gets owner plan
            token.plan = isFounder ? "owner" : ((profile.plan as string) ?? "starter");
            // Persist owner plan to DB for founder
            if (isFounder && profile.plan !== "owner") {
              await supabase.from("profiles").update({ plan: "owner" }).eq("id", profile.id);
            }
          } else {
            const id = crypto.randomUUID();
            const plan = isFounder ? "owner" : "starter";
            await supabase.from("profiles").insert({
              id,
              email,
              plan,
              screens_used_this_month: 0,
            });
            token.uid = id;
            token.plan = plan;
          }
        } catch (err) {
          console.error("[nextauth] profile sync error:", err);
          token.uid = token.sub ?? crypto.randomUUID();
          token.plan = "starter";
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.uid = token.uid;
      session.user.plan = token.plan;
      return session;
    },
  },
};
