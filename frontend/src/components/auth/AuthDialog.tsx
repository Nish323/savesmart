"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm"; 
import { useAuth } from "@/utils/contexts/AuthContext";

export function AuthDialog() {
  const { 
    showAuthDialog, 
    setShowAuthDialog, 
    authDialogView, 
    setAuthDialogView 
  } = useAuth();

  return (
    <Dialog open={showAuthDialog} onOpenChange={(open) => setShowAuthDialog(open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {authDialogView === "login" ? "SaveSmartにログイン" : "SaveSmartに新規登録"}
          </DialogTitle>
        </DialogHeader>
        {authDialogView === "login" ? (
          <LoginForm onSignUpClick={() => setAuthDialogView("signup")} />
        ) : (
          <SignUpForm onLoginClick={() => setAuthDialogView("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
