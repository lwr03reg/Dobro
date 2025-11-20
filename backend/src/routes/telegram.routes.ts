import { Router } from 'express';
import { telegramService } from '../services/telegram.service';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/webhooks/telegram
 * Telegram webhook endpoint
 */
router.post('/telegram', async (req, res, next) => {
  try {
    const bot = telegramService.getBot();
    
    if (!bot) {
      return res.status(503).json({ error: 'Telegram bot not initialized' });
    }

    // Process update
    await bot.processUpdate(req.body);
    
    return res.sendStatus(200);
  } catch (error) {
    logger.error('Telegram webhook error', { error });
    return next(error);
  }
});

/**
 * GET /api/webhooks/telegram/status
 * Check webhook status
 */
router.get('/telegram/status', async (_req, res, next) => {
  try {
    const bot = telegramService.getBot();
    
    if (!bot) {
      return res.json({ 
        status: 'disabled',
        message: 'Telegram bot not configured'
      });
    }

    const webhookInfo = await bot.getWebHookInfo();
    
    return res.json({
      status: 'active',
      webhook: webhookInfo,
    });
  } catch (error) {
    logger.error('Error getting webhook status', { error });
    return next(error);
  }
});

/**
 * POST /api/webhooks/telegram/set
 * Set webhook URL
 */
router.post('/telegram/set', async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    await telegramService.setWebhook(url);
    
    return res.json({ 
      success: true,
      message: 'Webhook set successfully',
      url 
    });
  } catch (error) {
    logger.error('Error setting webhook', { error });
    return next(error);
  }
});

/**
 * POST /api/webhooks/telegram/delete
 * Delete webhook
 */
router.post('/telegram/delete', async (_req, res, next) => {
  try {
    await telegramService.deleteWebhook();
    
    return res.json({ 
      success: true,
      message: 'Webhook deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting webhook', { error });
    return next(error);
  }
});

export default router;
