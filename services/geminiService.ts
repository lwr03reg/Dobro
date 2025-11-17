// Frontend Gemini Service - заглушка
// Реальная логика в backend/src/services/openai.service.ts

export async function getTrendingTopics() {
  throw new Error('Use backend API: /api/ai/trending-topics');
}

export async function generateGuideDraft(topic: string) {
  throw new Error('Use backend API: /api/ai/generate-draft');
}

export async function validateGuide(guide: any) {
  throw new Error('Use backend API: /api/ai/validate-guide');
}

export async function generateInteractiveContent(guide: any, type: string) {
  throw new Error('Use backend API: /api/ai/generate-interactive');
}

export async function generateSocialPosts(guide: any) {
  throw new Error('Use backend API: /api/ai/generate-marketing');
}

export async function generateEmail(guide: any) {
  throw new Error('Use backend API: /api/ai/generate-marketing');
}

export async function generateOzonDescription(guide: any) {
  throw new Error('Use backend API: /api/ai/generate-marketing');
}

export async function generateOzonMetadata(guide: any, price: number) {
  throw new Error('Use backend API: /api/ai/generate-ozon-metadata');
}

export async function generateCoverImage(guide: any) {
  throw new Error('Cover image generation not implemented');
}

export async function generatePublicationInfo(guide: any) {
  throw new Error('Use backend API');
}
