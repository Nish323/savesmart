"use client";

import { useAuth } from "@/utils/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Link as LinkIcon } from "lucide-react"; // ★ LinkIcon をインポート

export default function Dashboard() {
	const { user, logout, isLoading } = useAuth();

    // ユーザーIDをクエリパラメータとして追加
    // 環境変数を使用してバックエンドのURLを指定
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const zaimRedirectUrl = `${backendUrl}/zaim/redirect?user_id=${user?.id || ''}`;
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
                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4">外部サービス連携</h2>
                        
                        {user ? (
                            <div>
                                {user.is_zaim_linked ? (
                                    <div className="flex items-center gap-4">
                                        <p className="font-medium">Zaim:</p>
                                        <span className="text-green-600 font-semibold py-2 px-4 bg-green-100 rounded-md">
                                            連携済みです
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <p className="font-medium">Zaim:</p>
                                        <Button asChild>
                                            <a href={zaimRedirectUrl} className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4" />
                                                Zaimと連携する
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">連携状態を読み込み中...</p>
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
