import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfits = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Project Star - School Management System",
    template: "%s - Project Star",
  },
  description:
    "Comprehensive school management system for administrators, teachers, students, and parents. Manage attendance, assessments, communication, and payments all in one place.",
  keywords: [
    "school management system",
    "education software",
    "student management",
    "teacher portal",
    "attendance tracking",
    "grade management",
    "school administration",
    "learning management",
    "education technology",
    "school portal",
  ],
  authors: [{ name: "Project Star" }],
  creator: "Project Star",
  publisher: "Project Star",
  applicationName: "Project Star",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://projectstar.edu"),
  openGraph: {
    title: "Project Star - School Management System",
    description:
      "Comprehensive school management system for administrators, teachers, students, and parents. Manage attendance, assessments, communication, and payments all in one place.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://projectstar.edu",
    siteName: "Project Star",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Star - School Management System",
    description:
      "Comprehensive school management system for administrators, teachers, students, and parents.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfits.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
