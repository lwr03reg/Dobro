import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { openaiService } from '../services/openai.service';
import { z } from 'zod';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

/**
 * GET /api/ai/trending-topics
 * Get trending topics for guide creation
 */
router.get('/trending-topics', async (_req: AuthRequest, res, next) => {
  try {
    const result = await openaiService.getTrendingTopics();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/generate-draft
 * Generate guide draft from topic
 */
const generateDraftSchema = z.object({
  topic: z.string().min(5).max(200),
});

router.post('/generate-draft', async (req: AuthRequest, res, next) => {
  try {
    const { topic } = generateDraftSchema.parse(req.body);
    const guide = await openaiService.generateGuideDraft(topic);
    res.json(guide);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/validate-guide
 * Validate and improve guide
 */
router.post('/validate-guide', async (req: AuthRequest, res, next) => {
  try {
    const guide = req.body;
    const validatedGuide = await openaiService.validateGuide(guide);
    res.json(validatedGuide);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/generate-interactive
 * Generate checklist or quiz
 */
const interactiveSchema = z.object({
  guide: z.object({
    topic: z.string(),
    title: z.string(),
    steps: z.array(z.any()),
  }),
  type: z.enum(['checklist', 'quiz']),
});

router.post('/generate-interactive', async (req: AuthRequest, res, next) => {
  try {
    const { guide, type } = interactiveSchema.parse(req.body);
    const content = await openaiService.generateInteractiveContent(guide as any, type);
    res.json(content);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/generate-marketing
 * Generate marketing materials
 */
router.post('/generate-marketing', async (req: AuthRequest, res, next) => {
  try {
    const guide = req.body;
    const marketing = await openaiService.generateMarketingKit(guide);
    res.json(marketing);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/generate-ozon-metadata
 * Generate Ozon marketplace metadata
 */
const ozonMetadataSchema = z.object({
  guide: z.object({
    topic: z.string(),
    title: z.string(),
  }),
  price: z.number().min(0),
});

router.post('/generate-ozon-metadata', async (req: AuthRequest, res, next) => {
  try {
    const { guide, price } = ozonMetadataSchema.parse(req.body);
    const metadata = await openaiService.generateOzonMetadata(guide as any, price);
    res.json(metadata);
  } catch (error) {
    next(error);
  }
});

export default router;
