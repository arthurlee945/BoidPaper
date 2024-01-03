import { type ReactNode } from "react";
import { type Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next Boilerplate",
  description: "arthurlee945's boilerplate",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
