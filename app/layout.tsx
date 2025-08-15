import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <AuthProvider>
        <body
          className={`${inter.className} bg-background text-foreground antialiased`}
        >
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
