import "@/app/globals.css";

export const metadata = { title: "RBAC Demo" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
