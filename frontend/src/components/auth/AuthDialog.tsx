"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm"; 

type AuthDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "signup";
};

export function AuthDialog({ isOpen, onClose, defaultView = "login" }: AuthDialogProps) {
  const [view, setView] = useState<"login" | "signup">(defaultView);

  // Reset view state when defaultView prop changes
  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  // Reset view state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setView(defaultView);
    }
  }, [isOpen, defaultView]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {view === "login" ? "SaveSmartにログイン" : "SaveSmartに新規登録"}
          </DialogTitle>
        </DialogHeader>
        {view === "login" ? (
          <LoginForm onSignUpClick={() => setView("signup")} />
        ) : (
          <SignUpForm onLoginClick={() => setView("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
