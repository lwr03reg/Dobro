import React from 'react';
import { MarketingKit } from '../types';

interface MarketingKitDisplayProps {
  marketingKit: MarketingKit | null;
}

export const MarketingKitDisplay: React.FC<MarketingKitDisplayProps> = ({ marketingKit }) => {
  if (!marketingKit) {
    return (
      <div className="text-gray-500 text-center py-8">
        Маркетинговый кит ещё не создан
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Social Posts */}
      {marketingKit.socialPosts && marketingKit.socialPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Посты для соцсетей</h3>
          <div className="space-y-3">
            {marketingKit.socialPosts.map((post, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  {post.platform}
                </div>
                <p className="whitespace-pre-wrap">{post.content}</p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="mt-2 text-blue-600">
                    {post.hashtags.join(' ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email */}
      {marketingKit.email && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Email рассылка</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-semibold mb-2">{marketingKit.email.subject}</div>
            <div className="whitespace-pre-wrap">{marketingKit.email.body}</div>
          </div>
        </div>
      )}

      {/* Ozon Description */}
      {marketingKit.ozonDescription && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Описание для Ozon</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {marketingKit.ozonDescription}
          </div>
        </div>
      )}
    </div>
  );
};
