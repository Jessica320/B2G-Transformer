import React from 'react';

export const Team: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 text-center">
        <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Our Team</span>
        <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-8">團隊介紹：嗡動全場</h2>
        <p className="max-w-3xl mx-auto text-slate-600 mb-12">
          來自國立臺北科技大學。團隊成員具備資訊管理與財金跨領域背景，
          曾參與多項資訊服務創新競賽與企業實習，致力於以科技創新解決現實金融問題。
        </p>
        
        <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center group">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform border-4 border-white shadow-lg">👩‍💼</div>
                <div className="font-bold text-lg text-slate-900">莊佩蓁</div>
            </div>
            <div className="text-center group">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform border-4 border-white shadow-lg">👩‍💻</div>
                <div className="font-bold text-lg text-slate-900">劉芷嬅</div>
            </div>
            <div className="text-center group">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform border-4 border-white shadow-lg">👨‍💻</div>
                <div className="font-bold text-lg text-slate-900">李宛樺</div>
            </div>
            <div className="text-center group">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform border-4 border-white shadow-lg">👩‍🔬</div>
                <div className="font-bold text-lg text-slate-900">陳宜君</div>
            </div>
        </div>
      </div>
    </section>
  );
};