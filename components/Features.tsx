
import React from 'react';
import { Globe2, Scale, LineChart, ShieldCheck, Zap, Network } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Globe2 className="w-6 h-6 text-blue-500" />,
      title: "Geo-AI 空間智能分析",
      desc: "結合衛星影像、氣象資料與能源網路，自動評估案場是否具備太陽能、風能或儲能的技術可行性。"
    },
    {
      icon: <Scale className="w-6 h-6 text-purple-500" />,
      title: "PolicyAI 法規快篩",
      desc: "自動比對土地分區使用管制與再生能源法規，快速判斷開發限制與潛在違規風險。"
    },
    {
      icon: <LineChart className="w-6 h-6 text-green-500" />,
      title: "財務情境模擬 (Financial Sim)",
      desc: "透過蒙地卡羅模擬多種轉型方案的 IRR、淨現值 (NPV) 與投資回收期，輔助最佳決策。"
    },
    {
      icon: <Network className="w-6 h-6 text-amber-500" />,
      title: "B2G 智慧交易媒合",
      desc: "獨家演算法媒合銀行「待轉型資產」與綠能開發商，解決資訊不對稱，加速資產活化。"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      title: "ESG 合規量化指標",
      desc: "產出符合 TCFD/ISSB 標準的碳減排報告，將環境效益轉化為可量化的金融數據。"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "動態風險監控儀表板",
      desc: "即時追蹤資產轉型進度與政策變動，為金融機構提供前瞻性的氣候風險管理工具。"
    }
  ];

  return (
    <section id="solution" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Our Solution</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">打造完整的 ESG 金融基礎設施</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            B2G 不僅是一個估值工具，更是一個生態系。整合 <span className="font-semibold text-slate-900">銀行、開發商、投資人與政府</span>，
            打通高碳資產通往綠色資本的最後一哩路。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-slate-100">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
