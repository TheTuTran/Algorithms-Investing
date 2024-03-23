import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algorithms in Investing",
  description: "Visual display of simple investing algorithms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {/* Message for small to medium screens, hidden on larger screens */}
          <div className="block lg:hidden p-4 text-center m-4">
            For desktop use only. This site is optimized for larger screens.
          </div>

          {/* Main content, hidden on small and medium screens */}
          <div className="hidden lg:block">
            <PageLayout>{children}</PageLayout>
          </div>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
