"use client";

import { ReactNode } from "react";

export type GuideItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export const GuideItem = ({ icon, title, description }: GuideItemProps) => (
  <div className="flex items-start space-x-4">
    {icon}
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);
