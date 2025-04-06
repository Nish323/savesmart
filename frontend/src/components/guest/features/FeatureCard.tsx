"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
};

export const FeatureCard = ({ title, description, icon: Icon, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card className="h-full">
      <CardHeader>
        <Icon className="h-12 w-12 text-primary mb-4" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
);
