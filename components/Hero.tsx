import React from 'react';
import { ArrowRight, Leaf, Building2, TrendingUp } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-slate-900 text-white overflow-hidden pt-32 pb-32">
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brown-500 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-green-600 rounded-full blur-3xl mix-blend-multiply opacity-60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-medium tracking-wide text-green-100">嗡動全場團隊 2025 年度鉅獻</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
              Brown-to-Green <br />
              <span className="gradient-text">Asset Transformer</span>
            </h1>
            
            <h2 className="text-2xl font-medium text-slate-300 mb-6">
              高碳排資產轉型潛力估值與交易平台
            </h2>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              全台首創結合 <span className="text-white font-bold">Geo-AI</span>、<span className="text-white font-bold">FinAI</span> 與 <span className="text-white font-bold">ESG Impact</span> 的自動化平台。
              協助銀行與企業將手中的閒置棕色資產，轉化為具備高投資價值的綠色金融商品。
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transform hover:-translate-y-1">
                立即試算轉型潛力
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#marketplace" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                瀏覽交易市場
              </a>
            </div>
          </div>

          {/* Dynamic Dashboard Visualization */}
          <div className="relative hidden lg:block">
             <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-xl opacity-20"></div>
             <div className="relative bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">B2G_SYSTEM_V1.0.2</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-xl">
                    <div className="p-3 bg-brown-900/80 rounded-lg">
                      <Building2 className="w-6 h-6 text-brown-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Input Asset</div>
                      <div className="font-bold text-white">桃園觀音閒置廠房</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 ml-auto" />
                  </div>

                  <div className="flex justify-center py-2">
                    <div className="animate-pulse text-green-500 text-xs tracking-widest">AI PROCESSING...</div>
                  </div>

                  <div className="flex items-center gap-4 bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                    <div className="p-3 bg-green-900/80 rounded-lg">
                      <Leaf className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-green-300">Transformation Strategy</div>
                      <div className="font-bold text-white">智慧倉儲 + 屋頂光電</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xs text-green-300">IRR</div>
                      <div className="font-bold text-green-400 text-xl">8.2%</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};