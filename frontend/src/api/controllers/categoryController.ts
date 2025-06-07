'use client';
import client from '@/utils/axios/client';

// 通常カテゴリーを取得
export const getNormalCategories = async () => {
  try {
    const response = await client.get('/normal-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching normal categories:', error);
    // エラーが発生した場合はダミーデータを返す
    return [
      { id: 1, name: "食費", color: "#FF5252" },
      { id: 2, name: "交通費", color: "#448AFF" },
      { id: 3, name: "日用品", color: "#66BB6A" },
    ];
  }
};

// 特別カテゴリーを取得
export const getSpecialCategories = async () => {
  try {
    const response = await client.get('/special-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching special categories:', error);
    // エラーが発生した場合はダミーデータを返す
    return [
      { id: 1, name: "特別支出1", color: "#AB47BC" },
      { id: 2, name: "特別支出2", color: "#26A69A" },
    ];
  }
};

// 感情カテゴリーを取得
export const getEmotionCategories = async () => {
  try {
    const response = await client.get('/emotion-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching emotion categories:', error);
    // エラーが発生した場合はダミーデータを返す
    return [
      { id: 1, name: "感情支出1", color: "#EF5350" },
      { id: 2, name: "感情支出2", color: "#EC407A" },
    ];
  }
};
