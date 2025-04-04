import "./globals.css";
import { AuthProvider } from "@/utils/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
      </head>
      <body>
			<AuthProvider>
        {children}
			</AuthProvider>
      </body>
    </html>
  );
}
