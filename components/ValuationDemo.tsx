
import React, { useState, useEffect } from 'react';
import { generateValuationReport } from '../services/geminiService';
import { AssetValuationRequest, TransformationReport, AnalysisStatus, Scenario } from '../types';
import { 
  Loader2, Zap, Building2, Map, Scale, BarChart3, 
  ArrowRight, Trees, AlertCircle, MapPin, Check, MousePointerClick, TrendingUp
} from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Area
} from 'recharts';
import { TaiwanHeatmap } from './TaiwanHeatmap';

export const ValuationDemo: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<TransformationReport | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  
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
        
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        // Step 2: Policy Check
        setStatus(AnalysisStatus.CHECKING_POLICY);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Step 3: Financial Sim
        setStatus(AnalysisStatus.CALCULATING_FINANCE);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const result = await apiPromise;
        setReport(result);
        setActiveScenarioId(result.bestScenarioId); // Default to best scenario
        setStatus(AnalysisStatus.COMPLETE);

    } catch (error) {
        console.error("Simulation sequence failed", error);
        setStatus(AnalysisStatus.ERROR);
    }
  };

  const activeScenario = report?.scenarios.find(s => s.id === activeScenarioId) || report?.scenarios[0];

  // Prepare composed chart data: Cash Flow + Cumulative NPV
  const chartData = activeScenario?.financials.yearlyCashFlow.reduce((acc: any[], val, idx) => {
      const prevCumulative = idx > 0 ? acc[idx - 1].cumulative : 0;
      acc.push({
          year: idx === 0 ? '建置期' : `Y${idx}`,
          cashflow: val,
          cumulative: prevCumulative + val
      });
      return acc;
  }, []) || [];

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
            
            {/* 1. Map Layer (Always Visible in BG) */}
            <div className={`absolute inset-0 z-0 transition-all duration-700 ${status === AnalysisStatus.COMPLETE ? 'h-[35%] border-b border-slate-700' : 'h-full'}`}>
                 <TaiwanHeatmap 
                    userLocation={userCoords} 
                    onLocationSelect={handleMapSelect}
                    isScanning={status === AnalysisStatus.SCANNING_GEO}
                    className="h-full"
                 />
                 
                 {/* Map Overlay Info has been removed as requested */}
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
                        <p className="text-slate-400 text-sm font-mono">{status === AnalysisStatus.SCANNING_GEO ? 'Analyzing roof structure...' : status === AnalysisStatus.CHECKING_POLICY ? 'Matching zoning laws...' : 'Simulating Cash Flow...'}</p>
                    </div>
                </div>
            )}

            {/* 3. Results Panel */}
            {status === AnalysisStatus.COMPLETE && report && activeScenario && (
                <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-slate-50 flex flex-col z-30 animate-fade-in-up shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                    
                    {/* Scenario Tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 pt-6 gap-3 pb-0 sticky top-0 z-10 scrollbar-hide">
                        {report.scenarios.map((scenario) => (
                            <button
                                key={scenario.id}
                                onClick={() => setActiveScenarioId(scenario.id)}
                                className={`flex-1 min-w-[180px] p-4 rounded-t-xl border-t border-x border-b-0 text-left transition-all relative group
                                    ${activeScenarioId === scenario.id 
                                        ? 'bg-slate-50 border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] translate-y-[1px]' 
                                        : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {activeScenarioId === scenario.id && <div className="absolute top-0 left-0 w-full h-1 bg-green-500 rounded-t-xl"></div>}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{scenario.id === report.bestScenarioId ? 'AI 推薦方案' : `方案 ${scenario.id}`}</div>
                                    {scenario.id === report.bestScenarioId && <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                </div>
                                <div className={`font-bold text-base line-clamp-1 ${activeScenarioId === scenario.id ? 'text-slate-900' : 'text-slate-500'}`}>{scenario.name}</div>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-sm font-bold text-green-600">IRR {scenario.irr}</span>
                                    <span className="text--[10px] text-slate-400 pb-0.5">NPV {scenario.financials.npv}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Dashboard Content */}
                    <div className="flex-1 overflow-y-auto p-6 grid lg:grid-cols-2 gap-8">
                        
                        {/* Financial Chart */}
                        <div className="flex flex-col min-h-[300px]">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                20 年財務模擬：現金流與回本點
                            </h4>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#15803d" stopOpacity={0.9}/>
                                            </linearGradient>
                                            <filter id="lineShadow" height="130%">
                                                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#d97706" floodOpacity="0.3" />
                                            </filter>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="year" fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                                        <YAxis 
                                            yAxisId="left" 
                                            fontSize={11} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(val) => `$${val}w`} 
                                            tick={{fill: '#15803d'}}
                                        />
                                        <YAxis 
                                            yAxisId="right" 
                                            orientation="right" 
                                            fontSize={11} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(val) => `$${val}w`}
                                            tick={{fill: '#d97706'}}
                                        />
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                                                borderRadius: '8px', 
                                                border: 'none', 
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#fff', fontSize: '13px', padding: '2px 0' }}
                                            formatter={(value: any, name: any) => [`$${value} 萬`, name]}
                                            labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}
                                        />
                                        <Legend 
                                            wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} 
                                            iconType="circle"
                                        />
                                        <Bar 
                                            yAxisId="left" 
                                            dataKey="cashflow" 
                                            name="年度現金流" 
                                            fill="url(#barGradient)" 
                                            radius={[4, 4, 0, 0]} 
                                            maxBarSize={40} 
                                        />
                                        <Line 
                                            yAxisId="right" 
                                            type="monotone" 
                                            dataKey="cumulative" 
                                            name="累計損益" 
                                            stroke="#d97706" 
                                            strokeWidth={3} 
                                            dot={{ r: 0 }} 
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                            style={{ filter: 'url(#lineShadow)' }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Details & Geo Stats */}
                        <div className="space-y-6">
                            
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-green-400 transition-colors">
                                    <div className="text-xs text-slate-500 mb-1">預估 CAPEX</div>
                                    <div className="text-xl font-bold text-slate-900 group-hover:text-green-700">{activeScenario.capex}</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-green-400 transition-colors">
                                    <div className="text-xs text-slate-500 mb-1">投資回收期</div>
                                    <div className="text-xl font-bold text-slate-900 group-hover:text-green-700">{activeScenario.roiPeriod}</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-green-400 transition-colors">
                                    <div className="text-xs text-slate-500 mb-1">年減碳量</div>
                                    <div className="text-xl font-bold text-green-600">{activeScenario.carbonReduction}</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-green-400 transition-colors">
                                    <div className="text-xs text-slate-500 mb-1">淨現值 (NPV)</div>
                                    <div className="text-xl font-bold text-green-600">{activeScenario.financials.npv}</div>
                                </div>
                            </div>

                            {/* Geo-AI Insights */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                                    <Map className="w-3 h-3" /> Geo-AI 現場分析數據
                                </h5>
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">年日照潛力</span>
                                        <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{report.geoAnalysis.solarPotential}</span>
                                    </div>
                                    <div className="flex justify-between items-center pl-2">
                                        <span className="text-slate-500">電網距離</span>
                                        <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{report.geoAnalysis.gridDistance}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">屋頂結構</span>
                                        <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{report.geoAnalysis.roofCondition}</span>
                                    </div>
                                    <div className="flex justify-between items-center pl-2">
                                        <span className="text-slate-500">風險係數</span>
                                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">{report.geoAnalysis.climateRisk}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                <span className="font-bold text-blue-800 block mb-1 flex items-center gap-1"><Check className="w-3 h-3"/> 方案說明：</span>
                                {activeScenario.description}
                            </p>
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
