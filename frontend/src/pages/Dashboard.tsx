import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Дашборд</h1>
              <p className="text-gray-400 mt-1">Добро пожаловать в DOBRO SYSTEM ☘</p>
            </div>
            <Link
              to="/guides/new"
              className="inline-flex items-center px-4 py-2 bg-brand-green hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-brand-green transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
        <span className="text-gray-500 text-sm ml-2">vs прошлый месяц</span>
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
      className="flex items-start p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700 hover:border-brand-green"
    >
      <div className="text-2xl mr-3">{icon}</div>
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
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
      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700 hover:border-brand-green"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium">{guide.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              guide.status === 'published'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}
          >
            {guide.status === 'published' ? 'Опубликован' : 'Черновик'}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <span>👁️ {guide.views}</span>
          <span>🛒 {guide.sales}</span>
          <span>💰 ₽{guide.revenue.toLocaleString()}</span>
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
