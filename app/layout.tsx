import Navbar from "./components/navbar"; 
import "./globals.css";
import { PostHogProvider, PostHogPageView } from "@/components/PostHogProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title> GrantBridge</title>
        <meta name="get funding " content="Discover and applay for grants"/>
      </head>
      <body className="bg-white text-gray-900">
        <PostHogProvider>
          <PostHogPageView />
          <Navbar /> 
          <main>{children}</main>
        </PostHogProvider>
      </body>
    </html>
  );
}