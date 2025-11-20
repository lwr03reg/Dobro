import React, { useEffect, useState } from 'react';
import '../styles/miniapp.css';

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          start_param?: string;
        };
        sendData: (data: string) => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
      };
    };
  }
}

interface Guide {
  id: string;
  title: string;
  topic: string;
  status: string;
  createdAt: string;
}

export default function TelegramMiniApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'view'>('list');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('warm');

  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Apply Telegram theme
      if (tg.themeParams.bg_color) {
        document.body.style.backgroundColor = tg.themeParams.bg_color;
      }
      if (tg.themeParams.text_color) {
        document.body.style.color = tg.themeParams.text_color;
      }

      // Load guides
      loadGuides();
    }
  }, []);

  useEffect(() => {
    if (!tg) return;

    // Setup back button
    if (currentView !== 'list') {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        setCurrentView('list');
        setSelectedGuide(null);
      });
    } else {
      tg.BackButton.hide();
    }

    // Setup main button
    if (currentView === 'create' && topic) {
      tg.MainButton.setText('✨ Создать гайд');
      tg.MainButton.show();
      tg.MainButton.enable();
      tg.MainButton.onClick(handleCreateGuide);
    } else {
      tg.MainButton.hide();
    }

    return () => {
      if (tg.MainButton.onClick) {
        tg.MainButton.offClick(handleCreateGuide);
      }
    };
  }, [currentView, topic, audience, tone]);

  const loadGuides = async () => {
    setIsLoading(true);
    try {
      // In real app, fetch from API using Telegram user ID
      const mockGuides: Guide[] = [
        {
          id: '1',
          title: 'Помощь детским домам',
          topic: 'Благотворительность',
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
        },
      ];
      setGuides(mockGuides);
    } catch (error) {
      tg?.showAlert('Ошибка загрузки гайдов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGuide = async () => {
    if (!topic) {
      tg?.showAlert('Введите тему гайда');
      return;
    }

    setIsLoading(true);
    tg?.MainButton.showProgress(false);

    try {
      // In real app, call API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      tg?.showAlert('Гайд создан! ✅');
      setCurrentView('list');
      setTopic('');
      setAudience('');
      setTone('warm');
      loadGuides();
    } catch (error) {
      tg?.showAlert('Ошибка создания гайда');
    } finally {
      setIsLoading(false);
      tg?.MainButton.hideProgress();
    }
  };

  const renderList = () => (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">📚 Мои гайды</h1>
        <p className="text-gray-600">Создавай и управляй своими гайдами</p>
      </div>

      <button
        onClick={() => setCurrentView('create')}
        className="w-full bg-blue-500 text-white rounded-lg p-4 mb-4 font-semibold hover:bg-blue-600 transition"
      >
        ✨ Создать новый гайд
      </button>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 mb-4">У тебя пока нет гайдов</p>
          <p className="text-sm text-gray-500">Создай первый гайд прямо сейчас!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => {
                setSelectedGuide(guide);
                setCurrentView('view');
              }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="font-semibold mb-1">{guide.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{guide.topic}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {guide.status === 'COMPLETED' ? '✅' : '📝'} {guide.status}
                </span>
                <span>{new Date(guide.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreate = () => (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">✨ Новый гайд</h1>
        <p className="text-gray-600">Заполни информацию о гайде</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Тема гайда *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Например: Помощь детским домам"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Целевая аудитория</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Выбрать...</option>
            <option value="Семьи с детьми">👨‍👩‍👧‍👦 Семьи с детьми</option>
            <option value="Предприниматели">👨‍💼 Предприниматели</option>
            <option value="Студенты">🎓 Студенты</option>
            <option value="Пенсионеры">👴 Пенсионеры</option>
            <option value="Широкая аудитория">🌍 Широкая аудитория</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Тон повествования</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'warm', label: '😊 Тёплый', emoji: '😊' },
              { value: 'professional', label: '💼 Деловой', emoji: '💼' },
              { value: 'inspiring', label: '🎉 Вдохновляющий', emoji: '🎉' },
              { value: 'educational', label: '📚 Образовательный', emoji: '📚' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTone(option.value)}
                className={`p-3 rounded-lg border-2 transition ${
                  tone === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className="text-sm font-medium">{option.label.replace(option.emoji + ' ', '')}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Совет:</strong> Чем конкретнее тема, тем лучше результат!
          </p>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    if (!selectedGuide) return null;

    return (
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{selectedGuide.title}</h1>
          <p className="text-gray-600">{selectedGuide.topic}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Статус</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {selectedGuide.status === 'COMPLETED' ? '✅ Готов' : '📝 Черновик'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Создан</span>
              <span className="text-sm text-gray-800">
                {new Date(selectedGuide.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>

          <button
            onClick={() => tg?.showAlert('Функция скачивания PDF скоро будет доступна!')}
            className="w-full bg-blue-500 text-white rounded-lg p-4 font-semibold hover:bg-blue-600 transition"
          >
            📄 Скачать PDF
          </button>

          <button
            onClick={() => tg?.showAlert('Функция редактирования скоро будет доступна!')}
            className="w-full bg-gray-100 text-gray-800 rounded-lg p-4 font-semibold hover:bg-gray-200 transition"
          >
            ✏️ Редактировать
          </button>

          <button
            onClick={() => {
              tg?.showConfirm('Удалить этот гайд?', (confirmed) => {
                if (confirmed) {
                  tg?.showAlert('Гайд удалён');
                  setCurrentView('list');
                  setSelectedGuide(null);
                  loadGuides();
                }
              });
            }}
            className="w-full bg-red-50 text-red-600 rounded-lg p-4 font-semibold hover:bg-red-100 transition"
          >
            🗑️ Удалить
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' && renderList()}
      {currentView === 'create' && renderCreate()}
      {currentView === 'view' && renderView()}
    </div>
  );
}
