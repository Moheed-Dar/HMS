import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Hospital Management System | HMS Dashboard",
  description:
    "A smart and secure Hospital Management System for doctors, patients, and administrators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
