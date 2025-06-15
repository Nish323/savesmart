"use client";

import { useEffect } from "react";
import { useAuth } from "@/utils/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { usePathname, useRouter } from "next/navigation";
import { Footer } from "@/components/guest/Footer";
import { Navbar } from "@/components/protected/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, setShowAuthDialog, setAuthDialogView } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated and not loading, show login dialog
    if (!isAuthenticated && !isLoading) {
      setAuthDialogView("login");
      setShowAuthDialog(true);
    }
  }, [isAuthenticated, isLoading, pathname, setShowAuthDialog, setAuthDialogView]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
        <AuthDialog />
      </>
    );
  }

}
