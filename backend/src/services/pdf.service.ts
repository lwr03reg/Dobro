import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Guide } from './openai.service';
import { logger } from '../utils/logger';

class PDFService {
  private readonly outputDir = path.join(process.cwd(), 'outputs', 'pdfs');
  private readonly brandGreen = '#22c55e';
  private readonly brandDark = '#111827';
  private readonly brandGray = '#6b7280';

  constructor() {
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate professional PDF from guide
   */
  async generatePDF(guide: any, userId: string): Promise<string> {
    const startTime = Date.now();
    const filename = `guide_${userId}_${Date.now()}.pdf`;
    const filepath = path.join(this.outputDir, filename);

    return new Promise((resolve, reject) => {
      try {
        // Normalize guide data (handle both snake_case and camelCase)
        const normalizedGuide = {
          ...guide,
          quick_action: guide.quick_action || guide.quickAction,
          steps: guide.steps || [],
          mistakes: guide.mistakes || [],
          checklist: guide.checklist || [],
          quiz: guide.quiz || [],
        };

        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
          info: {
            Title: normalizedGuide.title,
            Author: 'DOBRO SYSTEM',
            Subject: normalizedGuide.topic,
            Keywords: normalizedGuide.topic,
          },
        });

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Cover Page
        this.addCoverPage(doc, normalizedGuide);
        doc.addPage();

        // Table of Contents
        this.addTableOfContents(doc, normalizedGuide);
        doc.addPage();

        // Quote
        if (normalizedGuide.quote) {
          this.addQuote(doc, normalizedGuide.quote);
        }

        // Steps
        if (normalizedGuide.steps && normalizedGuide.steps.length > 0) {
          this.addSteps(doc, normalizedGuide.steps);
        }

        // Quick Action
        if (normalizedGuide.quick_action) {
          this.addSection(doc, '🚀 Первый шаг к результату', normalizedGuide.quick_action);
        }

        // Mistakes
        if (normalizedGuide.mistakes && normalizedGuide.mistakes.length > 0) {
          this.addListSection(doc, '🚫 Частые ошибки', normalizedGuide.mistakes);
        }

        // Bonus
        if (normalizedGuide.bonus) {
          this.addSection(doc, '🎁 Секретный бонус DOBRO', normalizedGuide.bonus);
        }

        // Checklist
        if (normalizedGuide.checklist && normalizedGuide.checklist.length > 0) {
          this.addChecklistSection(doc, normalizedGuide.checklist);
        }

        // Quiz
        if (normalizedGuide.quiz && normalizedGuide.quiz.length > 0) {
          this.addQuizSection(doc, normalizedGuide.quiz);
        }

        // Footer on all pages
        this.addFooters(doc);

        doc.end();

        stream.on('finish', () => {
          const duration = Date.now() - startTime;
          logger.info('PDF generated successfully', {
            filename,
            duration,
            topic: normalizedGuide.topic,
          });
          resolve(filepath);
        });

        stream.on('error', (error) => {
          logger.error('PDF generation failed', { error, topic: normalizedGuide.topic });
          reject(error);
        });
      } catch (error) {
        logger.error('PDF generation error', { error, topic: guide?.topic || 'unknown' });
        reject(error);
      }
    });
  }

  private addCoverPage(doc: PDFKit.PDFDocument, guide: Guide) {
    // Brand logo/icon
    doc
      .fontSize(60)
      .fillColor(this.brandGreen)
      .text('☘', { align: 'center' });

    doc.moveDown(2);

    // Title
    doc
      .fontSize(28)
      .fillColor(this.brandDark)
      .text(guide.title, { align: 'center', width: 500 });

    doc.moveDown(1);

    // Topic
    doc
      .fontSize(16)
      .fillColor(this.brandGray)
      .text(guide.topic, { align: 'center' });

    doc.moveDown(4);

    // Branding
    doc
      .fontSize(12)
      .fillColor(this.brandGray)
      .text('DOBRO SYSTEM', { align: 'center' });

    doc
      .fontSize(10)
      .text('Если помогло — поделись, так добро растёт', { align: 'center' });
  }

  private addTableOfContents(doc: PDFKit.PDFDocument, guide: Guide) {
    doc
      .fontSize(20)
      .fillColor(this.brandGreen)
      .text('Содержание', { underline: true });

    doc.moveDown(1);

    const contents = [
      'Мотивирующая цитата',
      'Пошаговое руководство',
      'Первый шаг к результату',
      'Частые ошибки',
      'Секретный бонус',
    ];

    if (guide.checklist) contents.push('Чек-лист');
    if (guide.quiz) contents.push('Тест для самопроверки');

    doc.fontSize(12).fillColor(this.brandDark);

    contents.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`);
      doc.moveDown(0.5);
    });
  }

  private addQuote(doc: PDFKit.PDFDocument, quote: string) {
    doc
      .fontSize(14)
      .fillColor(this.brandGray)
      .text(`"${quote}"`, { align: 'center' });

    doc.moveDown(2);
    this.addDivider(doc);
  }

  private addSteps(doc: PDFKit.PDFDocument, steps: any[]) {
    doc
      .fontSize(18)
      .fillColor(this.brandGreen)
      .text('Пошаговое руководство');

    doc.moveDown(1);

    steps.forEach((step, index) => {
      // Check if we need a new page
      if (doc.y > 650) {
        doc.addPage();
      }

      // Step number and title
      doc
        .fontSize(14)
        .fillColor(this.brandDark)
        .text(`Шаг ${index + 1}: ${step.what}`);

      doc.moveDown(0.5);

      // Details
      doc.fontSize(11).fillColor(this.brandGray);

      doc.text(`Как: ${step.how}`);
      doc.moveDown(0.3);

      doc.text(`Инструмент: ${step.tool}`);
      doc.moveDown(0.3);

      doc.text(`Пример: ${step.example}`);
      doc.moveDown(1.5);
    });

    this.addDivider(doc);
  }

  private addSection(doc: PDFKit.PDFDocument, title: string, content: string) {
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.fontSize(16).fillColor(this.brandGreen).text(title);

    doc.moveDown(0.5);

    doc.fontSize(11).fillColor(this.brandDark).text(content);

    doc.moveDown(1.5);
    this.addDivider(doc);
  }

  private addListSection(doc: PDFKit.PDFDocument, title: string, items: string[]) {
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.fontSize(16).fillColor(this.brandGreen).text(title);

    doc.moveDown(0.5);

    doc.fontSize(11).fillColor(this.brandDark);

    items.forEach((item) => {
      doc.text(`• ${item}`);
      doc.moveDown(0.3);
    });

    doc.moveDown(1);
    this.addDivider(doc);
  }

  private addChecklistSection(doc: PDFKit.PDFDocument, checklist: string[]) {
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.fontSize(16).fillColor(this.brandGreen).text('✅ Чек-лист');

    doc.moveDown(0.5);

    doc.fontSize(11).fillColor(this.brandDark);

    checklist.forEach((item) => {
      doc.text(`☐ ${item}`);
      doc.moveDown(0.3);
    });

    doc.moveDown(1);
    this.addDivider(doc);
  }

  private addQuizSection(doc: PDFKit.PDFDocument, quiz: any[]) {
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.fontSize(16).fillColor(this.brandGreen).text('❓ Тест для самопроверки');

    doc.moveDown(0.5);

    doc.fontSize(11).fillColor(this.brandDark);

    quiz.forEach((q, index) => {
      doc.text(`${index + 1}. ${q.question}`);
      doc.moveDown(0.3);

      q.options.forEach((option: string) => {
        doc.text(`   • ${option}`);
      });

      doc.moveDown(0.3);
      doc.fillColor(this.brandGreen).text(`   Ответ: ${q.answer}`);
      doc.fillColor(this.brandDark);
      doc.moveDown(0.8);
    });

    doc.moveDown(1);
    this.addDivider(doc);
  }

  private addDivider(doc: PDFKit.PDFDocument) {
    const y = doc.y;
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(545, y)
      .stroke();

    doc.moveDown(1);
  }

  private addFooters(doc: PDFKit.PDFDocument) {
    const pages = doc.bufferedPageRange();

    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(pages.start + i);

      // Page number
      doc
        .fontSize(9)
        .fillColor(this.brandGray)
        .text(
          `Страница ${i + 1} из ${pages.count}`,
          50,
          doc.page.height - 30,
          { align: 'right' }
        );

      // Branding
      doc.text('DOBRO SYSTEM ☘ | Если помогло — поделись, так добро растёт', 50, doc.page.height - 30, {
        align: 'left',
      });
    }
  }

  /**
   * Delete PDF file
   */
  async deletePDF(filepath: string): Promise<void> {
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        logger.info('PDF deleted', { filepath });
      }
    } catch (error) {
      logger.error('Failed to delete PDF', { filepath, error });
    }
  }
}

export const pdfService = new PDFService();
