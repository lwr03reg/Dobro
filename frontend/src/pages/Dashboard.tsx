import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

interface Stats {
  totalGuides: number;
  published: number;
  drafts: number;
  revenue: number;
  views: number;
  sales: number;
}

interface Guide {
  id: string;
  title: string;
  status: 'draft' | 'published';
  views: number;
  sales: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  type: 'created' | 'published' | 'sold' | 'viewed';
  message: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalGuides: 0,
    published: 0,
    drafts: 0,
    revenue: 0,
    views: 0,
    sales: 0,
  });

  const [recentGuides, setRecentGuides] = useState<Guide[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    // TODO: Fetch data from API
    // Временные данные для демонстрации
    setStats({
      totalGuides: 42,
      published: 35,
      drafts: 7,
      revenue: 152400,
      views: 12340,
      sales: 456,
    });

    setRecentGuides([
      {
        id: '1',
        title: 'Продвижение Telegram-канала в 2024',
        status: 'published',
        views: 1234,
        sales: 89,
        revenue: 31061,
        createdAt: '2024-11-15',
        updatedAt: '2024-11-19',
      },
      {
        id: '2',
        title: 'SMM для малого бизнеса',
        status: 'published',
        views: 987,
        sales: 67,
        revenue: 23383,
        createdAt: '2024-11-10',
        updatedAt: '2024-11-18',
      },
      {
        id: '3',
        title: 'Контент-маркетинг с нуля',
        status: 'draft',
        views: 0,
        sales: 0,
        revenue: 0,
        createdAt: '2024-11-19',
        updatedAt: '2024-11-19',
      },
    ]);

    setActivities([
      {
        id: '1',
        type: 'sold',
        message: 'Продан гайд "Продвижение Telegram-канала"',
        timestamp: '5 минут назад',
      },
      {
        id: '2',
        type: 'viewed',
        message: '15 новых просмотров за последний час',
        timestamp: '1 час назад',
      },
      {
        id: '3',
        type: 'published',
        message: 'Опубликован гайд "SMM для малого бизнеса"',
        timestamp: '2 часа назад',
      },
    ]);

    setLoading(false);
    setTimeout(() => setAnimateStats(true), 100);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl animate-bounce-slow">☘</span>
                Дашборд
              </h1>
              <p className="text-gray-400 mt-2 text-lg">Добро пожаловать в DOBRO SYSTEM</p>
            </div>
            <Link
              to="/guides/new"
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-green to-green-600 hover:from-green-600 hover:to-brand-green text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать гайд
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Всего гайдов"
            value={stats.totalGuides}
            subtitle={`${stats.published} опубликовано`}
            icon="📚"
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            title="Доход"
            value={`₽${stats.revenue.toLocaleString()}`}
            subtitle="За всё время"
            icon="💰"
            trend="+8%"
            trendUp={true}
          />
          <StatCard
            title="Просмотры"
            value={stats.views.toLocaleString()}
            subtitle="За последний месяц"
            icon="👁️"
            trend="+23%"
            trendUp={true}
          />
          <StatCard
            title="Продажи"
            value={stats.sales}
            subtitle="Всего продаж"
            icon="🛒"
            trend="+15%"
            trendUp={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton
              icon="✨"
              title="Анализ трендов"
              description="Найти популярные темы"
              to="/trends"
            />
            <QuickActionButton
              icon="📝"
              title="Создать гайд"
              description="Новый гайд с AI"
              to="/guides/new"
            />
            <QuickActionButton
              icon="📊"
              title="Аналитика"
              description="Статистика и отчёты"
              to="/analytics"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Guides */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Последние гайды</h2>
                <Link to="/guides" className="text-brand-green hover:text-green-400 text-sm font-medium">
                  Смотреть все →
                </Link>
              </div>
              <div className="space-y-4">
                {recentGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-6">Последняя активность</h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, trendUp }) => {
  return (
    <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 hover:border-brand-green transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-brand-green/20 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-white mt-3 group-hover:text-brand-green transition-colors duration-300">{value}</p>
          <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
        </div>
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>
      <div className="mt-4 flex items-center pt-4 border-t border-gray-800">
        <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${trendUp ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
        <span className="text-gray-500 text-xs ml-2">vs прошлый месяц</span>
      </div>
    </div>
  );
};

interface QuickActionButtonProps {
  icon: string;
  title: string;
  description: string;
  to: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, title, description, to }) => {
  return (
    <Link
      to={to}
      className="group flex items-start p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl hover:from-gray-750 hover:to-gray-800 transition-all duration-300 border border-gray-700 hover:border-brand-green transform hover:scale-105 hover:shadow-xl hover:shadow-brand-green/10"
    >
      <div className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg group-hover:text-brand-green transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
      <svg className="w-5 h-5 text-gray-600 group-hover:text-brand-green group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
};

interface GuideCardProps {
  guide: Guide;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-800 to-gray-850 rounded-xl hover:from-gray-750 hover:to-gray-800 transition-all duration-300 border border-gray-700 hover:border-brand-green transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-white font-semibold text-lg group-hover:text-brand-green transition-colors">{guide.title}</h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              guide.status === 'published'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}
          >
            {guide.status === 'published' ? '✓ Опубликован' : '⏳ Черновик'}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-1 text-gray-400 group-hover:text-gray-300">
            <span className="text-lg">👁️</span>
            <span className="font-medium">{guide.views.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1 text-gray-400 group-hover:text-gray-300">
            <span className="text-lg">🛒</span>
            <span className="font-medium">{guide.sales}</span>
          </span>
          <span className="flex items-center gap-1 text-brand-green font-semibold">
            <span className="text-lg">💰</span>
            <span>₽{guide.revenue.toLocaleString()}</span>
          </span>
        </div>
      </div>
      <svg className="w-6 h-6 text-gray-500 group-hover:text-brand-green group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
};

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'sold':
        return '🛒';
      case 'viewed':
        return '👁️';
      case 'published':
        return '✅';
      case 'created':
        return '✨';
      default:
        return '📝';
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="text-xl">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-white text-sm">{activity.message}</p>
        <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
};

export default Dashboard;
