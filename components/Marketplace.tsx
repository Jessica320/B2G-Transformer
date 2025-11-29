
import React, { useState } from 'react';
import { MarketplaceItem } from '../types';
import { Building2, MapPin, ArrowRight, Lock, Users, Filter, Search } from 'lucide-react';

const mockListings: MarketplaceItem[] = [
  {
    id: 'A001',
    type: '閒置紡織工廠',
    location: '彰化縣和美鎮',
    area: '1,200 坪',
    potentialIrr: '8.5%',
    tags: ['屋頂光電', '智慧倉儲'],
    status: 'matching',
    matchedInvestors: 3
  },
  {
    id: 'B024',
    type: '老舊化工廠房',
    location: '高雄市大社工業區',
    area: '3,500 坪',
    potentialIrr: '9.2%',
    tags: ['綠色製程改建', '土地活化'],
    status: 'matching',
    matchedInvestors: 5
  },
  {
    id: 'C103',
    type: '低效能商辦大樓',
    location: '新北市三重區',
    area: '500 坪',
    potentialIrr: '6.8%',
    tags: ['綠建築拉皮', '節能改善'],
    status: 'negotiating',
    matchedInvestors: 2
  }
];

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listings' | 'matched'>('listings');

  return (
    <section id="marketplace" className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-green-600 font-bold tracking-wider text-sm uppercase">B2G Marketplace</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">智慧交易媒合平台</h2>
            <p className="text-slate-600 mt-2 max-w-xl">
              匿名上架您的棕色資產，讓 AI 自動為您尋找最適合的綠能開發商與 ESG 投資人。
              保障隱私，精準媒合。
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2">
                <Filter className="w-4 h-4" /> 篩選條件
            </button>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> 上架新資產
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-brown-100 text-brown-800 text-xs font-bold rounded">
                        {item.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{item.id}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    <Lock className="w-3 h-3" /> 匿名上架
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {item.location}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 my-4 py-4 border-y border-slate-50">
                <div>
                    <div className="text-xs text-slate-500">土地面積</div>
                    <div className="font-semibold text-slate-700">{item.area}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500">預估綠色轉型 IRR</div>
                    <div className="font-bold text-green-600 text-lg">{item.potentialIrr}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md">
                        {tag}
                    </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px]">
                                👤
                            </div>
                        ))}
                    </div>
                    <span>{item.matchedInvestors} 位買家感興趣</span>
                </div>
                <button className="text-sm font-bold text-slate-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                    查看詳情 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add New Card Placeholder */}
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-slate-400 hover:border-green-300 hover:bg-green-50/30 transition-all cursor-pointer group h-full min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-green-500" />
            </div>
            <span className="font-medium">上架我的閒置資產</span>
            <span className="text-sm mt-1 text-slate-400">獲取免費 AI 估值報告</span>
          </div>
        </div>
      </div>
    </section>
  );
};
