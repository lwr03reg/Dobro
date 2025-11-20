import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './frontend/src/components/layout/DashboardLayout';
import Dashboard from './frontend/src/pages/Dashboard';

// Placeholder components (будут созданы позже)
const GuidesPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-white">Мои гайды</h1>
    <p className="text-gray-400 mt-2">Здесь будет список всех ваших гайдов</p>
  </div>
);

const CreateGuidePage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-white">Создать гайд</h1>
    <p className="text-gray-400 mt-2">Здесь будет форма создания нового гайда</p>
  </div>
);

const TrendsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-white">Анализ трендов</h1>
    <p className="text-gray-400 mt-2">Здесь будет анализ популярных тем</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-white">Аналитика</h1>
    <p className="text-gray-400 mt-2">Здесь будет подробная статистика</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-white">Настройки</h1>
    <p className="text-gray-400 mt-2">Здесь будут настройки аккаунта</p>
  </div>
);

const LoginPage = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 w-full max-w-md">
      <div className="text-center mb-8">
        <span className="text-4xl">☘</span>
        <h1 className="text-2xl font-bold text-white mt-2">DOBRO SYSTEM</h1>
        <p className="text-gray-400 mt-1">Войдите в свой аккаунт</p>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-green"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-green"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-brand-green hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
        >
          Войти
        </button>
      </form>
      
      <p className="text-center text-gray-400 text-sm mt-4">
        Нет аккаунта?{' '}
        <a href="/register" className="text-brand-green hover:text-green-400">
          Зарегистрироваться
        </a>
      </p>
    </div>
  </div>
);

function App() {
  // TODO: Implement real authentication
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/new" element={<CreateGuidePage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
