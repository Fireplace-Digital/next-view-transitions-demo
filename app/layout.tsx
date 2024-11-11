import { ViewTransitions } from "next-view-transitions";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en">
        <head>
          {/* Add scripts in order */}
          <script src="/gsap/gsap.js" />
          <script src="/gsap/InertiaPlugin.js" />
          <script src="/gsap/Draggable.js" />
          <script src="/gsap/init-gsap.js" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ViewTransitions>
  );
}