import "./globals.css";
import { AuthProvider } from "@/utils/contexts/AuthContext";

export const metadata = {
  title: 'SaveSmart',
  description: 'Smart personal finance app',
  icons: {
    icon: '/favicon.svg?v=4',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
			<AuthProvider>
        {children}
			</AuthProvider>
      </body>
    </html>
  );
}
