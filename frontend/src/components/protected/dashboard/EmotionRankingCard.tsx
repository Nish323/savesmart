import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmotionRankingProps {
	emotionRankingData: {
		name: string;
		category: string;
		date: string;
		amount: number;
	}[];
}

export const EmotionRankingCard = (
	{ emotionRankingData }: EmotionRankingProps
) => {
	return (
		<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay: 0.2 }}
	>
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AlertTriangle className="h-5 w-5 text-red-500" />
					今月の衝動買い＆後悔＆不満ランキング
				</CardTitle>
				<CardDescription>
					衝動買い・後悔・不満と判断された支出のトップ5
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{emotionRankingData.map((item, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
						>
							<div className="flex items-center gap-4">
								<span className="text-lg font-bold text-gray-500">
									#{index + 1}
								</span>
								<div>
									<p className="font-medium">{item.name}</p>
									<div className="flex items-center gap-2 text-sm text-gray-500">
										<span>{item.category}</span>
										<span>•</span>
										<span>{item.date}</span>
									</div>
								</div>
							</div>
							<span className="font-bold text-red-500">
								¥{item.amount.toLocaleString()}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	</motion.div>		
	);
}