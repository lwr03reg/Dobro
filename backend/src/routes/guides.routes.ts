import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { pdfService } from '../services/pdf.service';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/guides
 * Get user's guides
 */
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const guides = await prisma.guide.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    res.json(guides);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/guides/:id
 * Get specific guide
 */
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const guide = await prisma.guide.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!guide) {
      throw new AppError(404, 'Guide not found');
    }

    res.json(guide);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/guides
 * Create new guide
 */
const createGuideSchema = z.object({
  topic: z.string(),
  category: z.string().optional(),
  title: z.string().optional(),
  quote: z.string().optional(),
  steps: z.any().optional(),
  quickAction: z.string().optional(),
  mistakes: z.any().optional(),
  bonus: z.string().optional(),
  checklist: z.any().optional(),
  quiz: z.any().optional(),
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = createGuideSchema.parse(req.body);

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId! },
    });

    if (!subscription) {
      throw new AppError(403, 'No active subscription');
    }

    if (subscription.guidesUsed >= subscription.guidesLimit) {
      throw new AppError(403, 'Guide limit reached. Please upgrade your plan.');
    }

    // Create guide
    const guide = await prisma.guide.create({
      data: {
        userId: req.userId!,
        topic: data.topic,
        category: data.category,
        title: data.title,
        quote: data.quote,
        steps: data.steps,
        quickAction: data.quickAction,
        mistakes: data.mistakes,
        bonus: data.bonus,
        checklist: data.checklist,
        quiz: data.quiz,
        status: 'DRAFT',
      },
    });

    // Update subscription usage
    await prisma.subscription.update({
      where: { userId: req.userId! },
      data: { guidesUsed: { increment: 1 } },
    });

    res.status(201).json(guide);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/guides/:id
 * Update guide
 */
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const guide = await prisma.guide.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!guide) {
      throw new AppError(404, 'Guide not found');
    }

    const updated = await prisma.guide.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/guides/:id/generate-pdf
 * Generate PDF for guide
 */
router.post('/:id/generate-pdf', async (req: AuthRequest, res, next) => {
  try {
    const guide = await prisma.guide.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!guide) {
      throw new AppError(404, 'Guide not found');
    }

    // Generate PDF
    const pdfPath = await pdfService.generatePDF(guide as any, req.userId!);

    // Update guide with PDF URL (in production, upload to S3 and store URL)
    await prisma.guide.update({
      where: { id: req.params.id },
      data: {
        pdfUrl: pdfPath,
        status: 'COMPLETED',
      },
    });

    res.json({
      message: 'PDF generated successfully',
      pdfPath,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/guides/:id
 * Delete guide
 */
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const guide = await prisma.guide.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!guide) {
      throw new AppError(404, 'Guide not found');
    }

    // Delete PDF if exists
    if (guide.pdfUrl) {
      await pdfService.deletePDF(guide.pdfUrl);
    }

    await prisma.guide.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
