import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

const financialData = [
  { year: '第1年', revenue: 20, label: 'PoC & 顧問服務' },
  { year: '第2年', revenue: 80, label: 'SaaS 上線' },
  { year: '第3年', revenue: 250, label: '市場擴張' },
  { year: '第4年', revenue: 500, label: '進軍東南亞' },
  { year: '第5年', revenue: 1000, label: '完整生態系' },
];

export const MarketAnalysis: React.FC = () => {
  return (
    <section id="market" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Growth Potential</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">市場規模與財務預測</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
             鎖定台灣 <span className="font-bold text-slate-900">3 兆元</span> 工業不動產擔保品市場。
             預計於第二年達到損益平衡，第五年營收突破 <span className="font-bold text-slate-900">10 億元</span>。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Revenue Growth Chart */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-2 text-slate-800">5 年營收成長預測</h3>
            <p className="text-sm text-slate-500 mb-6">單位：百萬元 (NTD)</p>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#166534' }}
                    formatter={(value: number) => [`NT$ ${value} M`, '預估營收']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#16a34a" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Stats Cards */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="relative z-10">
                    <div className="text-slate-400 mb-2 font-medium">台灣工業不動產貸款總額</div>
                    <div className="text-5xl font-bold text-white mb-2">3.0 <span className="text-2xl font-normal text-slate-400">兆 TWD</span></div>
                    <div className="text-sm text-slate-400">可服務的潛在擔保品市場總量</div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 group-hover:scale-110 transition-transform">
                    <div className="w-48 h-48 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="bg-green-600 text-white p-8 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="relative z-10">
                    <div className="text-green-100 mb-2 font-medium">B2G 潛在估值服務市場</div>
                    <div className="text-5xl font-bold text-white mb-2">3,000 <span className="text-2xl font-normal text-green-200">億 TWD</span></div>
                    <div className="text-sm text-green-100">以 10% 具轉型潛力之資產計算</div>
                </div>
                 <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform">
                    <div className="w-48 h-48 bg-black rounded-full"></div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">115%</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">年均複合成長率 (CAGR)</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">第 2 年</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">預計損益兩平</div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};