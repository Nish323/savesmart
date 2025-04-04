"use client";

import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

export function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PiggyBank className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SaveSmart</span>
            </div>
            <p className="text-gray-600">
              スマートな貯金で、明るい未来を。
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">アプリについて</h3>
            <ul className="space-y-2 text-gray-600">
              <li>機能紹介</li>
              <li>使い方</li>
              <li>セキュリティ</li>
              <li>更新情報</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">法的情報</h3>
            <ul className="space-y-2 text-gray-600">
              <li>プライバシーポリシー</li>
              <li>利用規約</li>
              <li>特定商取引法に基づく表記</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-gray-600">
          <p>© 2024 SaveSmart. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}