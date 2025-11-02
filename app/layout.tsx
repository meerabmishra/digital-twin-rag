import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Twin RAG System",
  description: "AI-powered professional digital twin with RAG capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
