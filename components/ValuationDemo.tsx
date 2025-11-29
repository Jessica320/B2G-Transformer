
import React, { useState, useEffect } from 'react';
import { generateValuationReport } from '../services/geminiService';
import { AssetValuationRequest, TransformationReport, AnalysisStatus } from '../types';
import { 
  Loader2, Zap, Building2, Map, Scale, BarChart3, 
  MapPin, TrendingUp, Coins, Leaf, CheckCircle2, AlertTriangle, FileCheck, ScrollText
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TaiwanHeatmap } from './TaiwanHeatmap';

export const ValuationDemo: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<TransformationReport | null>(null);
  
  // User Location State for Map
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  
  const [formData, setFormData] = useState<AssetValuationRequest>({
    assetType: '老舊工業廠房',
    location: '',
    area: '1,200 坪',
    currentUsage: '傳統金屬加工廠',
    buildingAge: '25 年',
    avgPowerBill: '20 萬/月'
  });

  // Mock Geocoding Logic
  useEffect(() => {
    const loc = formData.location;
    if (loc.includes('觀音')) setUserCoords({ lat: 25.045, lng: 121.140 }); 
    else if (loc.includes('彰化') || loc.includes('濱海')) setUserCoords({ lat: 24.110, lng: 120.430 });
    else if (loc.includes('大社') || loc.includes('高雄')) setUserCoords({ lat: 22.730, lng: 120.355 }); 
    else if (loc.includes('五股') || loc.includes('新北')) setUserCoords({ lat: 25.070, lng: 121.455 }); 
    else if (loc.includes('台中') || loc.includes('精密')) setUserCoords({ lat: 24.145, lng: 120.600 });
  }, [formData.location]);

  const handleMapSelect = (lat: number, lng: number, address: string) => {
    setUserCoords({ lat, lng });
    setFormData(prev => ({ ...prev, location: address }));
  };

  const handleAnalyze = async () => {
    setReport(null);
    if (!formData.location) {
        alert("請輸入或在地圖上選擇資產位置");
        return;
    }
    
    try {
        // Step 1: Scanning (Faster animation)
        setStatus(AnalysisStatus.SCANNING_GEO);
        const apiPromise = generateValuationReport(formData);
        
        await new Promise(resolve => setTimeout(resolve, 600)); 
        
        // Step 2: Policy Check
        setStatus(AnalysisStatus.CHECKING_POLICY);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Step 3: Financial Sim
        setStatus(AnalysisStatus.CALCULATING_FINANCE);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const result = await apiPromise;
        setReport(result);
        setStatus(AnalysisStatus.COMPLETE);

    } catch (error) {
        console.error("Simulation sequence failed", error);
        setStatus(AnalysisStatus.ERROR);
    }
  };

  // Select the Best Scenario automatically
  const activeScenario = report?.scenarios.find(s => s.id === report.bestScenarioId) || report?.scenarios[0];

  // Prepare composed chart data: Cash Flow + Cumulative NPV
  const chartData = activeScenario?.financials.yearlyCashFlow.reduce((acc: any[], val, idx) => {
      const prevCumulative = idx > 0 ? acc[idx - 1].cumulative : 0;
      acc.push({
          year: idx === 0 ? '建置' : `Y${idx}`,
          cashflow: val,
          cumulative: prevCumulative + val
      });
      return acc;
  }, []) || [];

  // Determine gradient offset for green/red based on 0 value
  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.cumulative));
    const dataMin = Math.min(...chartData.map((i) => i.cumulative));
  
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
  
    return dataMax / (dataMax - dataMin);
  };
  
  const off = gradientOffset();

  return (
    <section id="demo" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-green-600 font-bold tracking-wider text-sm uppercase">AI Core Engine</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-4">B2G 轉型潛力估值引擎</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
             整合 <span className="font-bold text-slate-900">衛星影像 Geo-AI</span> 與 <span className="font-bold text-slate-900">多情境財務模擬</span>，
             為您的資產客製化最佳轉型路徑。
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 max-w-[1400px] mx-auto items-stretch min-h-[750px]">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col z-10">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-700">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">1. 資產參數設定</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">地理位置</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="輸入地址或點擊右側地圖..."
                    className="w-full p-3 pl-9 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['桃園觀音', '彰化濱海', '高雄大社', '新北五股', '台中精密'].map(loc => (
                        <button 
                            key={loc}
                            onClick={() => setFormData({...formData, location: loc})}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 rounded-full whitespace-nowrap transition-colors"
                        >
                            {loc}
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">土地坪數</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">屋齡</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      value={formData.buildingAge}
                      onChange={(e) => setFormData({...formData, buildingAge: e.target.value})}
                    />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">資產類型</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  value={formData.assetType}
                  onChange={(e) => setFormData({...formData, assetType: e.target.value})}
                >
                  <option>老舊工業廠房</option>
                  <option>閒置物流倉儲</option>
                  <option>商業辦公大樓</option>
                  <option>棕地 (Brownfield)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">目前用途 / 電費</label>
                <input 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  value={formData.currentUsage}
                  onChange={(e) => setFormData({...formData, currentUsage: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
                <button 
                  onClick={handleAnalyze}
                  disabled={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR}
                  className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
                    ${status === AnalysisStatus.ERROR 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xl active:scale-[0.98]'
                    }
                    disabled:opacity-80 disabled:cursor-not-allowed
                  `}
                >
                  {status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                     <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  )}
                  {status === AnalysisStatus.ERROR ? '分析失敗，請重試' : 
                   (status === AnalysisStatus.IDLE || status === AnalysisStatus.COMPLETE ? '啟動 Geo-AI 估值模擬' : 'AI 分析運算中...')}
                </button>
            </div>
          </div>

          {/* Right: Map & Results Area */}
          <div className="lg:col-span-8 flex flex-col h-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative">
            
            {/* 1. Map Layer - Fixed height when complete to avoid shrinking */}
            <div className={`relative w-full transition-all duration-700 ease-in-out z-0 shrink-0 ${status === AnalysisStatus.COMPLETE ? 'h-[300px] border-b border-slate-700' : 'flex-grow min-h-[500px]'}`}>
                 <TaiwanHeatmap 
                    userLocation={userCoords} 
                    onLocationSelect={handleMapSelect}
                    isScanning={status === AnalysisStatus.SCANNING_GEO}
                    className="h-full w-full"
                 />
            </div>

            {/* 2. Loading Overlay */}
            {status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-black/40 p-8 rounded-2xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)] text-center max-w-sm w-full mx-4 backdrop-blur-md">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 border-t-2 border-green-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-2 border-blue-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                {status === AnalysisStatus.SCANNING_GEO && <Map className="w-8 h-8 text-green-400" />}
                                {status === AnalysisStatus.CHECKING_POLICY && <Scale className="w-8 h-8 text-blue-400" />}
                                {status === AnalysisStatus.CALCULATING_FINANCE && <BarChart3 className="w-8 h-8 text-purple-400" />}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                             {status === AnalysisStatus.SCANNING_GEO && "衛星圖資掃描與建模..."}
                             {status === AnalysisStatus.CHECKING_POLICY && "土地法規與饋線檢核..."}
                             {status === AnalysisStatus.CALCULATING_FINANCE && "多重情境財務模擬..."}
                        </h3>
                    </div>
                </div>
            )}

            {/* 3. Results Panel */}
            {status === AnalysisStatus.COMPLETE && report && activeScenario && (
                <div className="flex-1 flex flex-col bg-slate-50 z-10 animate-fade-in-up shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                    
                    {/* Header: AI Recommendation */}
                    <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                         <div className="flex items-center gap-3">
                             <div className="p-1.5 bg-yellow-100 rounded-full">
                                <Zap className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-slate-900 text-lg leading-tight">🏆 AI 智能推薦最佳路徑</h4>
                                 <p className="text-xs text-slate-500 font-medium">{activeScenario.name}</p>
                             </div>
                         </div>
                         <div className="hidden sm:block text-right">
                             <div className="text-xs text-slate-500">預估增值</div>
                             <div className="text-green-600 font-bold">{report.projectedValue}</div>
                         </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* 1. Key Metrics Row - BIG DATA */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10">
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">內部報酬率 (IRR)</div>
                                <div className="text-3xl font-bold text-green-600">{activeScenario.irr}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10">
                                    <Coins className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">淨現值 (NPV)</div>
                                <div className="text-2xl font-bold text-slate-900">{activeScenario.financials.npv}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10">
                                    <Building2 className="w-8 h-8 text-amber-600" />
                                </div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">預估 CAPEX</div>
                                <div className="text-2xl font-bold text-slate-900">{activeScenario.capex}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10">
                                    <Leaf className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">投資回收期</div>
                                <div className="text-2xl font-bold text-slate-900">{activeScenario.roiPeriod}</div>
                            </div>
                        </div>

                        {/* 2. Chart & Details Split */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            
                            {/* Left: Compact Financial Chart */}
                            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                                <h4 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    20 年累計淨現值趨勢 (Cumulative NPV)
                                </h4>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset={off} stopColor="#22c55e" stopOpacity={0.8} />
                                                    <stop offset={off} stopColor="#ef4444" stopOpacity={0.8} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} interval={2} />
                                            <YAxis 
                                                fontSize={10} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                tickFormatter={(val) => {
                                                    if (val === 0) return '0';
                                                    if (Math.abs(val) >= 10000) return `${(val/10000).toFixed(1)}億`;
                                                    return `${val}萬`;
                                                }} 
                                                tick={{fill: '#94a3b8'}}
                                            />
                                            <RechartsTooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                                                    borderRadius: '8px', 
                                                    border: 'none', 
                                                    color: '#fff',
                                                    fontSize: '12px'
                                                }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(value: any) => {
                                                     if (Math.abs(value) >= 10000) return [`$${(value/10000).toFixed(2)} 億`, "累計損益"];
                                                     return [`$${value} 萬`, "累計損益"];
                                                }}
                                                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                            />
                                            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                                            <Area 
                                                type="monotone" 
                                                dataKey="cumulative" 
                                                stroke="#0f172a" 
                                                strokeWidth={2}
                                                fill="url(#splitColor)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">方案說明</h5>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {activeScenario.description}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Geo + Policy */}
                            <div className="flex flex-col gap-4">
                                
                                {/* Geo-AI Stats */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-1">
                                        <Map className="w-3 h-3" /> Geo-AI 現場數據
                                    </h5>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between border-b border-slate-200 pb-2">
                                            <span className="text-slate-500">年日照潛力</span>
                                            <span className="font-bold text-slate-800">{report.geoAnalysis.solarPotential}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-200 pb-2">
                                            <span className="text-slate-500">電網距離</span>
                                            <span className="font-bold text-slate-800">{report.geoAnalysis.gridDistance}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">饋線容量</span>
                                            <span className="font-bold text-slate-800">{report.geoAnalysis.gridCapacity}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PolicyAI Card (IMPROVED) */}
                                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-md flex-1 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    
                                    <h5 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 relative z-10">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
                                            <Scale className="w-5 h-5" />
                                        </div>
                                        PolicyAI 法規快篩
                                    </h5>
                                    
                                    {/* Verdict Block */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5 flex items-center justify-between relative z-10">
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">土地使用分區判定</div>
                                            <div className="text-xl font-bold text-blue-800">{report.policyAnalysis.zoningType.split(' ')[0]}</div>
                                        </div>
                                        <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                            <CheckCircle2 size={14} /> 合規
                                        </div>
                                    </div>

                                    {/* Regulations */}
                                    <div className="space-y-3 mb-5 relative z-10">
                                        {/* Restriction Warning */}
                                        <div className="flex items-start gap-3 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-100 leading-relaxed">
                                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                            {report.policyAnalysis.restrictions}
                                        </div>

                                        <div className="space-y-2">
                                            {report.policyAnalysis.regulations.map((reg, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                                    <ScrollText className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                                                    {reg}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subsidies */}
                                    <div className="pt-4 border-t border-slate-100 relative z-10">
                                        <h6 className="text-[10px] font-bold text-slate-400 uppercase mb-3">符合補助資格</h6>
                                        <div className="flex flex-wrap gap-2">
                                            {report.policyAnalysis.subsidyEligibility.map((sub, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-white text-slate-600 border border-slate-200 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm hover:border-green-300 hover:text-green-700 transition-colors cursor-default">
                                                    <FileCheck className="w-3 h-3 text-green-500" /> {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};
