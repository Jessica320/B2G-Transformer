import React from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ValuationDemo } from './components/ValuationDemo';
import { MarketAnalysis } from './components/MarketAnalysis';
import { Team } from './components/Team';
import { Marketplace } from './components/Marketplace';
import { ESGDashboard } from './components/ESGDashboard';
import { Layers } from 'lucide-react';

const Navbar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Layers className="w-8 h-8 text-green-500 group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-bold text-white tracking-tight">B2G <span className="text-green-500">Transformer</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('solution')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none">解決方案</button>
          <button onClick={() => scrollToSection('demo')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none">AI 估值引擎</button>
          <button onClick={() => scrollToSection('marketplace')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none">交易市場</button>
          <button onClick={() => scrollToSection('esg-data')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none">ESG 數據</button>
          <button onClick={() => scrollToSection('team')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-bold transition-colors shadow-lg shadow-green-900/20 cursor-pointer border-none">
            聯絡團隊
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-green-500" />
            <span className="text-lg font-bold text-white">B2G Asset Transformer</span>
          </div>
          <p className="max-w-sm mb-4 leading-relaxed">
            高碳排資產轉型潛力估值與交易平台。<br/>
            連結棕色資產與綠色資本，打造亞洲轉型金融技術標準。
          </p>
          <p className="text-sm text-slate-500">
            © 2025 嗡動全場團隊. 國立臺北科技大學.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">平台功能</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => scrollToSection('demo')} className="hover:text-green-500 transition-colors cursor-pointer text-left bg-transparent border-none p-0">AI 轉型潛力估值</button></li>
            <li><button onClick={() => scrollToSection('marketplace')} className="hover:text-green-500 transition-colors cursor-pointer text-left bg-transparent border-none p-0">智慧交易媒合</button></li>
            <li><button onClick={() => scrollToSection('esg-data')} className="hover:text-green-500 transition-colors cursor-pointer text-left bg-transparent border-none p-0">ESG 風險儀表板</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">聯絡資訊</h4>
          <ul className="space-y-2 text-sm">
            <li>t114ab8046@ntut.org.tw</li>
            <li>+886 975 115 913</li>
            <li>台北市大安區忠孝東路三段1號</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200 selection:text-green-900">
      <Navbar />
      <Hero />
      <Features />
      <ValuationDemo />
      <Marketplace />
      <ESGDashboard />
      <MarketAnalysis />
      <div id="team" className="scroll-mt-24">
        <Team />
      </div>
      <Footer />
    </div>
  );
};

export default App;