import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Weather Forecast App",
  description: "A beautiful weather forecast application showing 7-day forecasts for major cities around the world.",
  keywords: ["weather", "forecast", "cities", "temperature", "precipitation"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen bg-gradient-to-b from-sky-100 to-sky-200`}
      >
        {children}
      </body>
    </html>
  );
}
