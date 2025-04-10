"use client";

import { useAuth } from "@/utils/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">ダッシュボード</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={logout}
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
            {user ? (
              <div className="space-y-2">
                <p><span className="font-medium">名前:</span> {user.name}</p>
                <p><span className="font-medium">メールアドレス:</span> {user.email}</p>
              </div>
            ) : (
              <p className="text-gray-500">ユーザー情報を読み込み中...</p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">保護されたコンテンツ</h2>
            <p className="text-gray-700">
              このページは認証されたユーザーのみがアクセスできます。
              ログインしていないユーザーがこのページにアクセスしようとすると、
              自動的にログインダイアログが表示されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
