import { ViewTransitions } from "next-view-transitions";
import { Inter } from "next/font/google";
import { Nav } from "@/components/ui/nav";
import { NoiseBackground } from "@/components/ui/NoiseBackground";
import { ProjectProvider } from "@/lib/project-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Jen Liu - Portfolio',
  description: 'Designs with logic and love',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en">
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" async></script>
        </head>
        <body className={inter.className}>
          <NoiseBackground />
          {children}
          <Nav />
        </body>
      </html>
    </ViewTransitions>
  );
}
