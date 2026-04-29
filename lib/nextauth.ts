import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

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

          if (profile) {
            token.uid = profile.id as string;
            token.plan = (profile.plan as string) ?? "starter";
          } else {
            const id = crypto.randomUUID();
            await supabase.from("profiles").insert({
              id,
              email,
              plan: "starter",
              screens_used_this_month: 0,
            });
            token.uid = id;
            token.plan = "starter";
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
