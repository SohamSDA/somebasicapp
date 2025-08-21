import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "next-themes";
import { GlobalHeader } from "@/components/global-header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body
          className={`${inter.className} bg-background text-foreground antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalHeader />
            {children}
            <Toaster
              richColors
              position="top-center"
              toastOptions={{
                duration: 4000,
              }}
            />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
