import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DietApp",
  description: "Diet management app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mytheme">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200`}
      >
        <AuthProvider>
          <header className="shadow mb-4">
            <div className="navbar bg-base-100">
              <div className="flex-1">
                <span className="text-xl font-bold">DietApp</span>
              </div>
            </div>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
