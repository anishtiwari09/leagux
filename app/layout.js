import { Inter } from "next/font/google";
import "./globals.css";
import Main from "./utility/Main";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#ffffff"></meta>
      <link rel="manifest" href="/manifest.json"></link>
      <body className={inter.className}>
        {children}
        <Main />
      </body>
    </html>
  );
}
