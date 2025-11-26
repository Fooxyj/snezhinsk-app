
import { GoogleGenAI } from "@google/genai";

// Используем безопасную проверку или заглушку, чтобы не ломать приложение, если ключа нет
// В браузере process.env вызовет ошибку, поэтому здесь мы либо хардкодим (для тестов), либо оставляем пустым.
const apiKey = ''; // Сюда можно вставить ключ для локальных тестов, но для деплоя лучше через Vercel Env

let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("Ошибка инициализации Gemini:", e);
  }
}

export const generateAdDescription = async (title: string, category: string, keywords: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return "Автоматическое описание недоступно (нет ключа API).";
  }

  try {
    const prompt = `Напиши короткое, привлекательное объявление (максимум 40 слов) для продажи или аренды в городе Снежинск. 
    Заголовок: ${title}. 
    Категория: ${category}. 
    Ключевые особенности: ${keywords}.
    Стиль: Газетное объявление, вежливое, но продающее.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Не удалось сгенерировать описание.";
  }
};
