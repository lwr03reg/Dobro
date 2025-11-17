import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/payments/create-checkout
 * Create payment checkout session
 */
const checkoutSchema = z.object({
  tier: z.enum(['PRO', 'BUSINESS']),
  provider: z.enum(['stripe', 'yukassa']).default('yukassa'),
});

router.post('/create-checkout', async (req: AuthRequest, res, next) => {
  try {
    const { tier, provider } = checkoutSchema.parse(req.body);

    // Get pricing
    const prices = {
      PRO: 990,
      BUSINESS: 2990,
    };

    const amount = prices[tier];

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: req.userId!,
        amount,
        currency: 'RUB',
        status: 'PENDING',
        provider,
        description: `Подписка ${tier}`,
        metadata: { tier },
      },
    });

    // In production, integrate with Stripe/ЮKassa here
    // For now, return mock checkout URL
    const checkoutUrl = `https://payment.dobro.app/checkout/${payment.id}`;

    res.json({
      checkoutUrl,
      paymentId: payment.id,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/payments/webhook
 * Handle payment webhooks
 */
router.post('/webhook', async (req, res, next) => {
  try {
    // In production, verify webhook signature
    const { paymentId, status } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }

    if (status === 'succeeded') {
      // Update payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      // Update subscription
      const tier = payment.metadata as any;
      const limits = {
        PRO: 50,
        BUSINESS: 999999,
      };

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await prisma.subscription.update({
        where: { userId: payment.userId },
        data: {
          tier: tier.tier,
          status: 'ACTIVE',
          guidesLimit: limits[tier.tier as keyof typeof limits],
          guidesUsed: 0,
          currentPeriodStart: new Date(),
          currentPeriodEnd: endDate,
        },
      });
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/payments/history
 * Get payment history
 */
router.get('/history', async (req: AuthRequest, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (error) {
    next(error);
  }
});

export default router;
