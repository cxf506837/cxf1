import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI OrderOps Workbench",
  description: "Sanitized AI order processing portfolio demo"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

