"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50 pt-32 pb-24 overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 h-full w-full",
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        )}
        squares={[
          [2, 2],
          [3, 3],
          [4, 4],
          [5, 5],
          [6, 6],
          [7, 7],
          [8, 8],
          [9, 9],
          [10, 10],
          [11, 11],
          [12, 12],
          [13, 13],
          [14, 14],
          [15, 15],
        ]}
      />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              賢く管理して
              <span className="text-primary relative">
                明るい未来へ
                <motion.div
                  className="absolute -inset-2 bg-primary/10 rounded-lg -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl relative"
          >
            SaveSmartで、あなたの資産形成を始めましょう。目標を設定し、進捗を追跡して、
            スマートな資産管理で着実に未来を築いていきましょう。
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="relative overflow-hidden group">
                <span className="relative z-10">
                  今すぐ始める
                  <ArrowRight className="ml-2 h-4 w-4 inline-block transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </Button>
            </Link>
            <Link href="/guide">
              <Button size="lg" variant="outline" className="relative overflow-hidden group">
                <span className="relative z-10">詳しく見る</span>
                <motion.div
                  className="absolute inset-0 bg-gray-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}