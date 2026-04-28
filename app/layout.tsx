import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evermade",
  description: "Evermade builds apps that make money.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
