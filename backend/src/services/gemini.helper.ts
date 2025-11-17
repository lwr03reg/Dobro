/**
 * Helper функция для вызова Gemini API
 * Упрощает работу с Gemini и обработку ответов
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

export async function callGemini(
  client: GoogleGenerativeAI,
  model: string,
  prompt: string,
  temperature: number = 0.7,
  maxTokens: number = 4096
): Promise<any> {
  try {
    const genModel = client.getGenerativeModel({
      model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const result = await genModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Пытаемся извлечь JSON из ответа
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Если JSON не найден, возвращаем текст как есть
    return { text };
  } catch (error) {
    logger.error('Gemini API call failed', { error, prompt: prompt.substring(0, 100) });
    throw error;
  }
}

/**
 * Извлекает JSON из текста Gemini ответа
 */
export function extractJSON(text: string): any {
  // Убираем markdown code blocks если есть
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Ищем JSON объект
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]);
}
