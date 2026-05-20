import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GitCode — Collaborate, Build, Ship",
  description:
    "The best platform for teams to collaborate on coding projects. Join classrooms, build with your team, and ship real projects together.",
  keywords: ["coding", "collaboration", "education", "teams", "git", "projects"],
  openGraph: {
    title: "GitCode — Collaborate, Build, Ship",
    description:
      "The best platform for teams to collaborate on coding projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#FFFFFF",
              color: "#1A1A2E",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              padding: "12px 16px",
              fontSize: "14px",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)",
            },
            success: {
              iconTheme: {
                primary: "#00BFA6",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#E63946",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
