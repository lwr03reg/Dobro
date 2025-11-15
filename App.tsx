import React, { useState, useCallback, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { WorkflowStage, Guide, PublicationInfo, LogEntry, MarketingKit, TrendingTopic, ErrorLogEntry, OzonMetadata, GroundingSource } from './types';
import { getTrendingTopics, generateGuideDraft, validateGuide, generateInteractiveContent, generateSocialPosts, generateEmail, generateOzonDescription, generateOzonMetadata, generateCoverImage, generatePublicationInfo } from './services/geminiService';
import { dejavu_sans_normal } from './services/pdfFont';
import { StageCard } from './components/StageCard';
import GuideDisplay from './components/GuideDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ArrowRightIcon } from './components/icons/ArrowRightIcon';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { CodeBracketIcon } from './components/icons/CodeBracketIcon';
import { PhotoIcon } from './components/icons/PhotoIcon';
import { CodeBlock } from './components/CodeBlock';
import { ArrowPathIcon } from './components/icons/ArrowPathIcon';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { TrashIcon } from './components/icons/TrashIcon';
import { DocumentArrowDownIcon } from './components/icons/DocumentArrowDownIcon';
import { TimelineStepper } from './components/TimelineStepper';
import { PublicationLog } from './components/PublicationLog';
import { ErrorLog } from './components/ErrorLog';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { LightBulbIcon } from './components/icons/LightBulbIcon';
import { CpuChipIcon } from './components/icons/CpuChipIcon';
import { CurrencyRubleIcon } from './components/icons/CurrencyRubleIcon';
import { ImagePlaceholder } from './components/ImagePlaceholder';
import { ClipboardIcon } from './components/icons/ClipboardIcon';
import { ExclamationCircleIcon } from './components/icons/ExclamationCircleIcon';
import { WorkflowStepper } from './components/WorkflowStepper';
import { MarketingKitDisplay } from './components/MarketingKitDisplay';
import { CheckBadgeIcon } from './components/icons/CheckBadgeIcon';
import { ExternalLinkIcon } from './components/icons/ExternalLinkIcon';

const TEST_FROM_PACKAGE_STAGE = true;

const CLEAN_INITIAL_STATE = {
    currentStage: WorkflowStage.TRENDS,
    selectedTopic: null as TrendingTopic | null,
    guideDraft: null as Guide | null,
    validatedGuide: null as Guide | null,
    marketingKit: null as MarketingKit | null,
    guidePackage: null as { pdf: string; cover: string; } | null,
    publicationInfo: null as PublicationInfo | null,
    ozonMetadata: null as OzonMetadata | null,
    price: 349,
};

const DUMMY_TOPIC: TrendingTopic = {
  topic: 'Продвижение Telegram-канала в 2024 году',
  category: 'Бизнес',
  icon: '🚀',
  description: 'Как эффективно привлекать подписчиков и монетизировать свой канал.'
};

const DUMMY_GUIDE: Guide = {
  topic: 'Продвижение Telegram-канала в 2024 году',
  title: 'РЕШЕБНИК ДОБРА: Продвижение Telegram-канала',
  quote: 'Лучшее время, чтобы посадить дерево, было 20 лет назад. Следующее лучшее время — сегодня.',
  steps: [
    { what: 'Определение ниши и целевой аудитории', how: 'Четко определите, для кого ваш канал и какие проблемы он решает.', tool: 'Анализ аудитории, опросы', example: 'Канал для начинающих SMM-специалистов, фокус на практических советах.' },
    { what: 'Создание контент-плана', how: 'Разработайте рубрики и темы на месяц вперед.', tool: 'Notion, Trello, Google Calendar', example: 'Понедельник - кейс, Среда - полезный инструмент, Пятница - ответы на вопросы.' },
    { what: 'Анализ конкурентов', how: "Определи 3-5 основных конкурентов. Изучи их предложения и цены. Выяви их сильные и слабые стороны. Используй инструменты для анализа трафика (например, SimilarWeb).", tool: 'TGStat, SimilarWeb', example: 'Анализ каналов-конкурентов по SMM, выявление незанятых подниш.' },
    { what: 'Платное продвижение', how: 'Используйте Telegram Ads и закупайте рекламу в релевантных каналах.', tool: 'Telegram Ads, биржи рекламы', example: 'Закупка рекламы в канале про маркетинг с похожей аудиторией.' },
    { what: 'Бесплатное продвижение', how: 'Используйте комментинг, взаимный пиар и гостевые посты.', tool: 'Тематические чаты, партнерские каналы', example: 'Оставлять экспертные комментарии в чатах по SMM.' }
  ],
  quick_action: 'Напишите и опубликуйте первый пост-знакомство в своем канале, рассказав о его цели.',
  mistakes: ['Отсутствие регулярности', 'Копирование чужого контента', 'Игнорирование аналитики'],
  bonus: 'Эксклюзивный чек-лист "50 идей для постов в Telegram-канале" и подборка ботов для автоматизации.',
  checklist: ['Определить ЦА', 'Составить контент-план на неделю', 'Найти 5 каналов для рекламы', 'Настроить приветственное сообщение', 'Проанализировать статистику первого поста'],
  quiz: [
    { question: 'Какой инструмент лучше всего подходит для анализа конкурентов в Telegram?', options: ['Google Analytics', 'TGStat', 'Яндекс.Метрика'], answer: 'TGStat' },
    { question: 'Что является ключевым фактором успеха при платном продвижении?', options: ['Большой бюджет', 'Правильный выбор каналов для рекламы', 'Красивые картинки'], answer: 'Правильный выбор каналов для рекламы' }
  ]
};

const TEST_STATE = {
    ...CLEAN_INITIAL_STATE,
    currentStage: WorkflowStage.PACKAGE,
    selectedTopic: DUMMY_TOPIC,
    guideDraft: DUMMY_GUIDE,
    validatedGuide: DUMMY_GUIDE,
    price: 499,
};

const LOCAL_STORAGE_KEY = 'dobroSystemState';

const LoadingSpinner = ({ text }: { text: string }) => (
  <div className="flex flex-col justify-center items-center p-8 text-center min-h-[300px]">
    <SpinnerIcon className="h-8 w-8 text-brand-green" />
    <p className="text-brand-light-gray mt-4">{text}</p>
  </div>
);

const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: (() => void) | null }) => {
  const isQuotaError = /quota|RESOURCE_EXHAUSTED/i.test(message);

  if (isQuotaError) {
    return (
      <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 px-4 py-4 rounded-lg" role="alert" aria-live="assertive">
        <div className="flex items-start">
          <ExclamationCircleIcon className="w-6 h-6 mr-3 flex-shrink-0 text-yellow-400" />
          <div>
            <strong className="font-bold">Превышена квота API</strong>
            <p className="mt-2 text-sm">
              Похоже, вы исчерпали свой лимит запросов к Gemini API. Это может произойти при интенсивном использовании бесплатного тарифа.
            </p>
            <p className="mt-3 font-semibold text-sm">Что делать:</p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
              <li>Подождите некоторое время, пока квота не восстановится.</li>
              <li>
                Проверьте использование и биллинг в <a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100 font-medium">документации по лимитам</a>.
              </li>
              <li>
                Отследите текущее использование на странице <a href="https://ai.dev/usage?tab=rate-limit" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100 font-medium">вашей квоты</a>.
              </li>
            </ul>
            {onRetry && (
              <div className="mt-4">
                 <button 
                    onClick={onRetry} 
                    className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-white font-bold py-1 px-3 rounded-lg text-sm"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Я проверил(а), попробовать снова
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-4" role="alert" aria-live="assertive">
        <div className="flex justify-between items-center">
            <div>
                <strong className="font-bold">Ошибка! </strong>
                <span className="block sm:inline">{message}</span>
            </div>
            {onRetry && (
                <button 
                    onClick={onRetry} 
                    className="flex items-center gap-2 bg-red-500/50 hover:bg-red-500/80 text-white font-bold py-1 px-3 rounded-lg text-sm"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Повторить
                </button>
            )}
        </div>
    </div>
  );
};

const generatePdf = (guide: Guide): string => {
    const doc = new jsPDF({ putOnlyUsedFonts: true });

    // Register the font with Cyrillic support for the 'normal' style.
    doc.addFileToVFS("DejaVuSans.ttf", dejavu_sans_normal);
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");

    // Set this font as the default for the entire document.
    // We will only use the 'normal' style to avoid errors, as bold/italic font files are not provided.
    doc.setFont("DejaVuSans", "normal");

    const brandGreen = '#22c55e';
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = margin;

    const checkPageBreak = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(brandGreen);
    const titleLines = doc.splitTextToSize(guide.title, pageWidth - margin * 2);
    checkPageBreak(titleLines.length * 10);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 10 + 5;

    // Quote
    doc.setFontSize(12);
    doc.setTextColor(108, 117, 125);
    const quoteLines = doc.splitTextToSize(`"${guide.quote}"`, pageWidth - margin * 2);
    checkPageBreak(quoteLines.length * 6);
    doc.text(quoteLines, margin, y);
    y += quoteLines.length * 6 + 10;
    
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    // Steps
    doc.setFontSize(16);
    doc.setTextColor(brandGreen);
    checkPageBreak(10);
    doc.text('Пошаговое руководство', margin, y);
    y += 10;

    guide.steps.forEach((step, index) => {
        checkPageBreak(40); // Estimate for a step
        doc.setFontSize(12);
        doc.setTextColor(33, 37, 41);
        const stepTitleLines = doc.splitTextToSize(`Шаг ${index + 1}: ${step.what}`, pageWidth - margin * 2);
        doc.text(stepTitleLines, margin, y);
        y += stepTitleLines.length * 6 + 2;

        doc.setFontSize(10);
        doc.setTextColor(108, 117, 125); // Use gray for details
        
        const wrapText = (label: string, text: string) => {
            const fullText = `${label}: ${text.replace(/\n/g, ' ')}`;
            const lines = doc.splitTextToSize(fullText, pageWidth - (margin * 2) - 5);
            checkPageBreak(lines.length * 5 + 2);
            doc.text(lines, margin + 5, y);
            y += lines.length * 5 + 2;
        };

        wrapText('Как', step.how);
        wrapText('Инструмент', step.tool);
        wrapText('Пример', step.example);
        y += 5;
    });
    
    const addSection = (title: string, content: string | string[], prefix = '• ') => {
        checkPageBreak(20);
        y += 5;
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        doc.setFontSize(14);
        doc.setTextColor(brandGreen);
        doc.text(title, margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setTextColor(33, 37, 41);

        if (Array.isArray(content)) {
            content.forEach(item => {
                const lines = doc.splitTextToSize(`${prefix}${item}`, pageWidth - margin * 2);
                checkPageBreak(lines.length * 5 + 2);
                doc.text(lines, margin, y, { maxWidth: pageWidth - margin * 2 });
                y += lines.length * 5 + 2;
            });
        } else {
            const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
            checkPageBreak(lines.length * 5);
            doc.text(lines, margin, y, { maxWidth: pageWidth - margin * 2 });
            y += lines.length * 5 + 2;
        }
    };
    
    addSection('🚀 Первый шаг к результату', guide.quick_action, '');
    addSection('🚫 Частые ошибки', guide.mistakes);
    addSection('🎁 Секретный бонус DOBRO', guide.bonus, '');

    if (guide.checklist && guide.checklist.length > 0) {
        addSection('✅ Чек-лист', guide.checklist, '□ ');
    }
    
    if (guide.quiz && guide.quiz.length > 0) {
        addSection('❓ Тест для самопроверки', guide.quiz.map((q, i) => `${i + 1}. ${q.question}\n   Ответ: ${q.answer}`), '');
    }

    const addFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Страница ${i} из ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
            doc.text('DOBRO SYSTEM ☘ | Если помогло — поделись, так добро растёт.', margin, pageHeight - 10);
        }
    };

    addFooter();

    return doc.output('datauristring');
};

// ... Rest of the App component ...
const App: React.FC = () => {
    const initialState = TEST_FROM_PACKAGE_STAGE ? TEST_STATE : CLEAN_INITIAL_STATE;

    const [currentStage, setCurrentStage] = useState<WorkflowStage>(initialState.currentStage);
    const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(initialState.selectedTopic);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
    const [guideDraft, setGuideDraft] = useState<Guide | null>(initialState.guideDraft);
    const [validatedGuide, setValidatedGuide] = useState<Guide | null>(initialState.validatedGuide);
    const [marketingKit, setMarketingKit] = useState<MarketingKit | null>(initialState.marketingKit);
    const [guidePackage, setGuidePackage] = useState<{ pdf: string; cover: string; } | null>(initialState.guidePackage);
    const [publicationInfo, setPublicationInfo] = useState<PublicationInfo | null>(initialState.publicationInfo);
    const [ozonMetadata, setOzonMetadata] = useState<OzonMetadata | null>(initialState.ozonMetadata);
    const [price, setPrice] = useState<number>(initialState.price);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [errorLog, setErrorLog] = useState<ErrorLogEntry[]>([]);
    const [publicationLog, setPublicationLog] = useState<LogEntry[]>([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    const retryFunctionRef = useRef<(() => void) | null>(null);

    const logError = useCallback((message: string, stage: WorkflowStage) => {
        console.error(`Error at stage ${stage}:`, message);
        setError(message);
        setErrorLog(prev => [...prev, { message, stage, timestamp: new Date().toISOString() }]);
        setIsLoading(false);
    }, []);

    const executeWithLoading = useCallback(async <T,>(
        action: () => Promise<T>,
        loadingMessage: string,
        stageForErrorLog: WorkflowStage,
        onSuccess: (result: T) => void
    ) => {
        setIsLoading(true);
        setLoadingText(loadingMessage);
        setError(null);
        retryFunctionRef.current = () => executeWithLoading(action, loadingMessage, stageForErrorLog, onSuccess);
        try {
            const result = await action();
            onSuccess(result);
        } catch (e: any) {
            logError(e.message || 'Произошла неизвестная ошибка', stageForErrorLog);
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    }, [logError]);

    const handleGetTrendingTopics = useCallback(() => {
        executeWithLoading(
            getTrendingTopics,
            'Анализирую тренды с помощью Google Search...',
            WorkflowStage.TRENDS,
            ({ topics, sources }) => {
                setTrendingTopics(topics);
                setGroundingSources(sources);
            }
        );
    }, [executeWithLoading]);

    useEffect(() => {
        if (currentStage === WorkflowStage.TRENDS && trendingTopics.length === 0) {
            handleGetTrendingTopics();
        }
    }, [currentStage, trendingTopics, handleGetTrendingTopics]);

    const handleSelectTopic = (topic: TrendingTopic) => {
        setSelectedTopic(topic);
        setCurrentStage(WorkflowStage.DRAFT);
        executeWithLoading(
            () => generateGuideDraft(topic.topic),
            `Генерирую черновик для "${topic.topic}"...`,
            WorkflowStage.DRAFT,
            (draft) => setGuideDraft(draft)
        );
    };

    const handleValidateGuide = useCallback(() => {
        if (!guideDraft) return;
        setCurrentStage(WorkflowStage.VALIDATE);
        executeWithLoading(
            () => validateGuide(guideDraft),
            'Проверяю и улучшаю черновик...',
            WorkflowStage.VALIDATE,
            (validated) => setValidatedGuide(validated)
        );
    }, [guideDraft, executeWithLoading]);
    
    const handleEnrichGuide = useCallback(async (type: 'quiz' | 'checklist') => {
        if (!validatedGuide) return;
        setCurrentStage(WorkflowStage.ENRICH);
        await executeWithLoading(
            () => generateInteractiveContent(validatedGuide, type),
            `Создаю ${type === 'quiz' ? 'тест' : 'чек-лист'}...`,
            WorkflowStage.ENRICH,
            (content) => {
                setValidatedGuide(prev => prev ? { ...prev, ...content } : null);
            }
        );
    }, [validatedGuide, executeWithLoading]);

    const handleCreatePackage = useCallback(() => {
        if (!validatedGuide) return;
        
        const generateAllAssets = async () => {
            try {
                // PDF and Cover in parallel
                setLoadingText('Создаю PDF и обложку...');
                const [pdf, cover] = await Promise.all([
                    Promise.resolve(generatePdf(validatedGuide)),
                    generateCoverImage(validatedGuide.topic, validatedGuide.title)
                ]);
                setGuidePackage({ pdf, cover });

                // Marketing kit in parallel
                setLoadingText('Готовлю маркетинговые материалы...');
                const [social, email, ozonDesc] = await Promise.all([
                    generateSocialPosts(validatedGuide),
                    generateEmail(validatedGuide),
                    generateOzonDescription(validatedGuide)
                ]);
                 setMarketingKit({
                    socialPosts: social.socialPosts,
                    email: email.email,
                    ozonDescription: ozonDesc.ozonDescription,
                });
                
                // Ozon Metadata
                setLoadingText('Формирую метаданные для Ozon...');
                const ozonMeta = await generateOzonMetadata(validatedGuide, price);
                setOzonMetadata(ozonMeta);
                
                setCurrentStage(WorkflowStage.REVIEW);

            } catch (e: any) {
                throw e; // re-throw to be caught by executeWithLoading
            }
        };

        executeWithLoading(
            generateAllAssets,
            'Начинаю упаковку проекта...',
            WorkflowStage.PACKAGE,
            () => {} // onSuccess is handled inside the action
        );
        setShowConfirmationModal(false);

    }, [validatedGuide, price, executeWithLoading]);

    const handleDeploy = useCallback(() => {
        if (!validatedGuide) return;
         setCurrentStage(WorkflowStage.DEPLOY);
         executeWithLoading(
            () => generatePublicationInfo(validatedGuide),
            'Генерирую финальные данные для публикации...',
            WorkflowStage.DEPLOY,
            (info) => {
                const newOzonId = `DOBRO-${Date.now().toString().slice(-6)}`;
                const finalInfo: PublicationInfo = {
                    ...info,
                    ozonId: newOzonId,
                    ozonMetadata: ozonMetadata!,
                    miniAppManifest: "{}", // Placeholder
                };
                setPublicationInfo(finalInfo);

                const newLogEntry: LogEntry = {
                    topic: validatedGuide.topic,
                    ozonId: newOzonId,
                    date: new Date().toLocaleDateString('ru-RU'),
                };
                setPublicationLog(prev => [newLogEntry, ...prev]);
            }
        );
    }, [validatedGuide, ozonMetadata, executeWithLoading]);

    const resetWorkflow = () => {
        setCurrentStage(CLEAN_INITIAL_STATE.currentStage);
        setSelectedTopic(CLEAN_INITIAL_STATE.selectedTopic);
        setGuideDraft(CLEAN_INITIAL_STATE.guideDraft);
        setValidatedGuide(CLEAN_INITIAL_STATE.validatedGuide);
        setMarketingKit(CLEAN_INITIAL_STATE.marketingKit);
        setGuidePackage(CLEAN_INITIAL_STATE.guidePackage);
        setPublicationInfo(CLEAN_INITIAL_STATE.publicationInfo);
        setOzonMetadata(CLEAN_INITIAL_STATE.ozonMetadata);
        setPrice(CLEAN_INITIAL_STATE.price);
        setError(null);
        handleGetTrendingTopics();
    };

    const renderCurrentStage = () => {
        if (isLoading) {
            return <LoadingSpinner text={loadingText} />;
        }

        switch (currentStage) {
            case WorkflowStage.TRENDS:
                return (
                    <div className="space-y-4">
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trendingTopics.map((topic) => (
                                <li key={topic.topic} className="bg-brand-gray/50 p-4 rounded-lg hover:bg-brand-gray transition-all border border-transparent hover:border-brand-green/50 cursor-pointer" onClick={() => handleSelectTopic(topic)}>
                                    <h3 className="font-bold text-white"><span className="mr-2">{topic.icon}</span>{topic.topic}</h3>
                                    <p className="text-sm text-brand-light-gray mt-1">{topic.description}</p>
                                    <span className="text-xs mt-2 inline-block bg-brand-dark px-2 py-1 rounded-full">{topic.category}</span>
                                </li>
                            ))}
                        </ul>
                         {groundingSources.length > 0 && (
                            <div className="pt-4 border-t border-brand-gray mt-4">
                                <h4 className="text-sm font-semibold text-brand-light-gray mb-2">Источники данных (Google Search):</h4>
                                <ul className="text-xs text-brand-light-gray/80 space-y-1">
                                    {groundingSources.map(source => (
                                        <li key={source.uri}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-brand-green hover:underline flex items-center gap-1">
                                                {source.title}
                                                <ExternalLinkIcon className="w-3 h-3" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );

            case WorkflowStage.DRAFT:
                if (!guideDraft) return <LoadingSpinner text="Загрузка черновика..." />;
                return <GuideDisplay guide={guideDraft} title="📝 Черновик руководства"/>;

            case WorkflowStage.VALIDATE:
                if (!validatedGuide) return <LoadingSpinner text="Загрузка улучшенной версии..." />;
                return <GuideDisplay guide={validatedGuide} title="✅ Улучшенная версия"/>;
            
            case WorkflowStage.ENRICH:
                if (!validatedGuide) return null;
                return <GuideDisplay guide={validatedGuide} title="✨ Обогащенное руководство"/>;

            case WorkflowStage.PACKAGE:
                 if (!validatedGuide) return null;
                 return <GuideDisplay guide={validatedGuide} title="📦 Готово к упаковке"/>;

            case WorkflowStage.REVIEW:
                if (!validatedGuide || !guidePackage || !marketingKit || !ozonMetadata) return <LoadingSpinner text="Собираем все материалы..." />;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-4">
                                {guidePackage.cover ? (
                                    <img src={`data:image/png;base64,${guidePackage.cover}`} alt="Обложка руководства" className="w-full rounded-lg shadow-lg"/>
                                ) : <ImagePlaceholder />}
                                 <div className="bg-brand-dark/30 p-4 rounded-lg border border-brand-gray/50">
                                     <h4 className="font-bold text-lg text-white mb-2">{ozonMetadata.name}</h4>
                                     <p className="text-2xl font-bold text-brand-green">{ozonMetadata.price} ₽</p>
                                     <a href={guidePackage.pdf} download={`${validatedGuide.topic}.pdf`} className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                        <DownloadIcon className="w-5 h-5" />
                                        Скачать PDF
                                    </a>
                                 </div>
                            </div>
                            <div className="lg:col-span-2">
                                 <MarketingKitDisplay kit={marketingKit} />
                            </div>
                        </div>
                    </div>
                );

            case WorkflowStage.DEPLOY:
                if (!publicationInfo) return <LoadingSpinner text="Публикация..." />;
                 return (
                    <div className="text-center p-8 bg-brand-gray/20 rounded-lg">
                        <CheckBadgeIcon className="w-16 h-16 text-brand-green mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Продукт успешно создан!</h3>
                        <p className="text-brand-light-gray mb-6">Ваше цифровое руководство готово к публикации на Ozon и в социальных сетях.</p>
                        <p className="text-sm text-brand-light-gray">ID товара на Ozon: <span className="font-mono bg-brand-dark/50 px-2 py-1 rounded">{publicationInfo.ozonId}</span></p>
                        
                        <div className="mt-8 text-left space-y-4 max-w-2xl mx-auto">
                           <MarketingKitDisplay kit={marketingKit!} telegramPost={publicationInfo.telegramMessage} />
                           <div>
                                <h4 className="text-md font-bold text-brand-green mb-2">📦 Метаданные для Ozon</h4>
                                <CodeBlock code={JSON.stringify(publicationInfo.ozonMetadata, null, 2)} />
                           </div>
                        </div>

                    </div>
                );

            default:
                return <div>Неизвестный этап</div>;
        }
    };

    const getStageConfig = () => {
        const stageInfo: { [key in WorkflowStage]?: { title: string, icon: React.ReactNode, cta: React.ReactNode, canGoBack: boolean } } = {
            [WorkflowStage.TRENDS]: {
                title: 'Анализ трендов',
                icon: <LightBulbIcon className="w-6 h-6 text-brand-green" />,
                cta: <button onClick={handleGetTrendingTopics} className="text-sm flex items-center gap-2 bg-brand-gray hover:bg-opacity-80 px-3 py-1.5 rounded-lg"><ArrowPathIcon className="w-4 h-4" />Обновить</button>,
                canGoBack: false
            },
            [WorkflowStage.DRAFT]: {
                title: 'Генерация черновика',
                icon: <CpuChipIcon className="w-6 h-6 text-white" />,
                cta: <button onClick={handleValidateGuide} disabled={!guideDraft} className="flex items-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"><SparklesIcon className="w-5 h-5"/>Улучшить черновик <ArrowRightIcon className="w-5 h-5" /></button>,
                canGoBack: true
            },
            [WorkflowStage.VALIDATE]: {
                title: 'Проверка и улучшение',
                icon: <CheckCircleIcon className="w-6 h-6 text-brand-green" />,
                cta: (
                    <div className="flex gap-2">
                        <button onClick={() => handleEnrichGuide('checklist')} disabled={!validatedGuide} className="flex items-center gap-2 bg-brand-green/80 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"><SparklesIcon className="w-5 h-5"/>+ Чек-лист</button>
                        <button onClick={() => handleEnrichGuide('quiz')} disabled={!validatedGuide} className="flex items-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"><SparklesIcon className="w-5 h-5"/>+ Тест <ArrowRightIcon className="w-5 h-5" /></button>
                    </div>
                ),
                canGoBack: true
            },
             [WorkflowStage.ENRICH]: {
                title: 'Обогащение контента',
                icon: <SparklesIcon className="w-6 h-6 text-yellow-400" />,
                cta: <button onClick={() => setShowConfirmationModal(true)} disabled={!validatedGuide} className="flex items-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"><BriefcaseIcon className="w-5 h-5"/>Упаковать <ArrowRightIcon className="w-5 h-5" /></button>,
                canGoBack: true
            },
            [WorkflowStage.PACKAGE]: {
                title: 'Упаковка материалов',
                icon: <BriefcaseIcon className="w-6 h-6 text-white" />,
                cta: <button onClick={() => setShowConfirmationModal(true)} disabled={!validatedGuide} className="flex items-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"><BriefcaseIcon className="w-5 h-5"/>Начать упаковку <ArrowRightIcon className="w-5 h-5" /></button>,
                canGoBack: true,
            },
             [WorkflowStage.REVIEW]: {
                title: 'Финальный обзор',
                icon: <CurrencyRubleIcon className="w-6 h-6 text-brand-green" />,
                cta: <button onClick={handleDeploy} className="flex items-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"><CheckCircleIcon className="w-5 h-5"/>Опубликовать <ArrowRightIcon className="w-5 h-5" /></button>,
                canGoBack: true,
            },
             [WorkflowStage.DEPLOY]: {
                title: 'Публикация',
                icon: <CheckBadgeIcon className="w-6 h-6 text-brand-green" />,
                cta: <button onClick={resetWorkflow} className="flex items-center gap-2 bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"><ArrowPathIcon className="w-5 h-5"/>Создать новый</button>,
                canGoBack: false
            }
        };
        return stageInfo[currentStage] || { title: 'DOBRO SYSTEM', icon: <SparklesIcon className="w-6 h-6" />, cta: null, canGoBack: false };
    };
    
    const { title, icon, cta } = getStageConfig();

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col items-center p-4 sm:p-8">
            <header className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold">DOBRO SYSTEM <span className="text-brand-green">☘</span></h1>
                    <p className="text-brand-light-gray">AI-автоматизация для создания цифровых руководств</p>
                </div>
                 <div className="mt-4 sm:mt-0">
                    <button onClick={resetWorkflow} title="Начать заново" className="p-2 rounded-full hover:bg-brand-gray transition-colors">
                        <TrashIcon className="w-5 h-5 text-brand-light-gray" />
                    </button>
                </div>
            </header>
            
            <div className="w-full max-w-5xl mx-auto mb-8 p-4 bg-brand-dark/50 rounded-lg shadow-inner">
                <WorkflowStepper currentStage={currentStage} onStageClick={(stage) => setCurrentStage(stage)} />
            </div>

            <main className="w-full max-w-7xl mx-auto">
                 <StageCard title={title} icon={icon} ctaButtons={cta}>
                    {error && <ErrorDisplay message={error} onRetry={retryFunctionRef.current} />}
                    {renderCurrentStage()}
                 </StageCard>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <PublicationLog logs={publicationLog} />
                    <ErrorLog logs={errorLog} />
                 </div>
            </main>
            
            <ConfirmationModal 
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={handleCreatePackage}
                title="Подтверждение и цена"
                price={price}
                onPriceChange={(p) => setPrice(p)}
            >
                <p>Мы готовы создать полный пакет материалов для вашего руководства. Пожалуйста, установите финальную цену для продажи на Ozon.</p>
            </ConfirmationModal>

            <footer className="text-center py-8 text-brand-light-gray text-sm mt-8">
                <p>DOBRO SYSTEM ☘ - Сделано с любовью и AI</p>
            </footer>
        </div>
    );
};

export default App;