"use client";

import { ReactNode } from "react";

export type CircularIconProps = {
  children: ReactNode;
};

export const CircularIcon = ({ children }: CircularIconProps) => (
  <div className="bg-primary/10 p-2 rounded-full">
    {children}
  </div>
);
