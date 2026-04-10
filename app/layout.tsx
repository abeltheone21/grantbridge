import Navbar from "./components/navbar"; 
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title> GrantBridge</title>
        <meta name="description" content="Discover and applay for grants"/>
      </head>
      <body className="bg-white text-gray-900">
        
        <Navbar /> 

        <main>{children}</main>
      </body>
    </html>
  );
}