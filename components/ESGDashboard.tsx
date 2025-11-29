
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ShieldAlert, Activity, FileText } from 'lucide-react';

const riskData = [
  { month: '1月', brown: 80, green: 20 },
  { month: '2月', brown: 75, green: 25 },
  { month: '3月', brown: 70, green: 30 },
  { month: '4月', brown: 60, green: 40 },
  { month: '5月', brown: 55, green: 45 },
  { month: '6月', brown: 45, green: 55 },
];

export const ESGDashboard: React.FC = () => {
  return (
    <section id="esg-data" className="py-24 bg-slate-900 text-white scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
                <span className="text-green-400 font-bold tracking-wider text-sm uppercase">Data Intelligence</span>
                <h2 className="text-3xl font-bold mt-2 mb-6">ESG 風險監控儀表板</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    您的資產組合正面臨轉型風險嗎？
                    B2G 平台提供即時的「氣候風險監測」與「資產碳排分析」。
                    協助金融機構與投資人掌握投資組合的綠化進程，符合金管會永續金融評鑑要求。
                </p>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 border border-slate-700">
                        <div className="p-2 bg-red-900/30 rounded-lg text-red-400">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">高碳曝險資產</div>
                            <div className="text-xl font-bold text-white">12 筆 <span className="text-xs font-normal text-red-400 ml-2">需立即關注</span></div>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 border border-slate-700">
                        <div className="p-2 bg-green-900/30 rounded-lg text-green-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">轉型中專案 (Transitioning)</div>
                            <div className="text-xl font-bold text-white">8 筆 <span className="text-xs font-normal text-green-400 ml-2">進度正常</span></div>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 border border-slate-700">
                        <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">已生成 ESG 報告</div>
                            <div className="text-xl font-bold text-white">156 份</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">資產組合轉型趨勢 (Brown to Green)</h3>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span> 綠色資產
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-brown-500"></span> 棕色資產
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={riskData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorBrown" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8d6e63" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8d6e63" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="brown" stackId="1" stroke="#8d6e63" fill="url(#colorBrown)" name="棕色資產佔比" />
                            <Area type="monotone" dataKey="green" stackId="1" stroke="#22c55e" fill="url(#colorGreen)" name="綠色資產佔比" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center text-sm text-slate-500">
                    * 數據模擬：導入 B2G 平台後 6 個月內之資產組合優化情形
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
