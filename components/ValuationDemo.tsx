import React, { useState, useEffect } from 'react';
import { generateValuationReport } from '../services/geminiService';
import { AssetValuationRequest, TransformationReport, AnalysisStatus } from '../types';
import { 
  Loader2, Zap, Building2, Map, Scale, BarChart3, 
  ArrowRight, Trees, FileCheck, CheckCircle2, Sun, AlertCircle, MapPin 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { TaiwanHeatmap } from './TaiwanHeatmap';

export const ValuationDemo: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<TransformationReport | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'geo' | 'finance'>('overview');
  
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

  // Mock Geocoding Logic for demo experience
  useEffect(() => {
    const loc = formData.location;
    if (loc.includes('觀音')) setUserCoords({ lat: 25.045, lng: 121.140 }); // Taoyuan
    else if (loc.includes('彰化') || loc.includes('濱海')) setUserCoords({ lat: 24.110, lng: 120.430 }); // Changhua
    else if (loc.includes('大社') || loc.includes('高雄')) setUserCoords({ lat: 22.730, lng: 120.355 }); // Kaohsiung
    else if (loc.includes('五股') || loc.includes('新北')) setUserCoords({ lat: 25.070, lng: 121.455 }); // New Taipei
    else if (loc.includes('台中') || loc.includes('精密')) setUserCoords({ lat: 24.145, lng: 120.600 }); // Taichung
    // Don't reset to null automatically to allow manual map picking to persist
  }, [formData.location]);

  const handleMapSelect = (lat: number, lng: number, address: string) => {
    setUserCoords({ lat, lng });
    setFormData(prev => ({ ...prev, location: address }));
  };

  const handleAnalyze = async () => {
    // Reset state
    setReport(null);
    if (!formData.location) {
        alert("請輸入或在地圖上選擇資產位置");
        return;
    }
    
    try {
        // Step 1: Geo Scan
        setStatus(AnalysisStatus.SCANNING_GEO);
        const apiPromise = generateValuationReport(formData); // Start request in parallel
        await new Promise(resolve => setTimeout(resolve, 1500)); // Minimum visual delay

        // Step 2: Policy Check
        setStatus(AnalysisStatus.CHECKING_POLICY);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 3: Finance Calc
        setStatus(AnalysisStatus.CALCULATING_FINANCE);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Finalize
        const result = await apiPromise;
        setReport(result);
        setStatus(AnalysisStatus.COMPLETE);

    } catch (error) {
        console.error("Simulation sequence failed", error);
        setStatus(AnalysisStatus.ERROR);
    }
  };

  const getStatusMessage = () => {
    switch(status) {
      case AnalysisStatus.SCANNING_GEO: return "正在進行 Geo-AI 衛星圖資掃描...";
      case AnalysisStatus.CHECKING_POLICY: return "比對地籍資料與再生能源法規...";
      case AnalysisStatus.CALCULATING_FINANCE: return "執行蒙地卡羅財務模擬...";
      default: return "處理中...";
    }
  };

  const getProgress = () => {
    switch(status) {
      case AnalysisStatus.SCANNING_GEO: return 33;
      case AnalysisStatus.CHECKING_POLICY: return 66;
      case AnalysisStatus.CALCULATING_FINANCE: return 90;
      default: return 0;
    }
  };

  // Prepare chart data safely
  const chartData = report?.financialAnalysis.yearlyCashFlow.map((val, idx) => ({
    year: `Y${idx + 1}`,
    cashflow: val
  })) || [];

  return (
    <section id="demo" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-green-600 font-bold tracking-wider text-sm uppercase">AI Core Engine</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-4">B2G 轉型潛力估值引擎</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            輸入資產位置，即刻比對 <span className="font-bold text-slate-900">國家級工業區資料庫</span>，
            啟動 Geo-AI 空間分析與財務預測。
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-stretch min-h-[600px]">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col z-10 h-full">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-700">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">1. 資產參數設定</h3>
            </div>
            
            <div className="space-y-4 flex-1">
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
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">地理位置 (輸入或點擊地圖)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="請輸入地址或關鍵字 (如：觀音、大社)"
                    className="w-full p-3 pl-9 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <div className="mt-2 text-xs text-slate-400">
                    * 支援關鍵字定位：試試輸入 "觀音"、"大社" 或 "五股"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">土地坪數</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">屋齡</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      value={formData.buildingAge}
                      onChange={(e) => setFormData({...formData, buildingAge: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">現況用途 / 電費</label>
                <input 
                  type="text" 
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
                   (status === AnalysisStatus.IDLE || status === AnalysisStatus.COMPLETE ? '啟動 AI 估值模擬' : 'AI 分析運算中...')}
                </button>
            </div>
          </div>

          {/* Right: Visualization & Results */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
            
            {/* 1. Map View (Idle State) */}
            {status === AnalysisStatus.IDLE && (
                <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <Map className="w-4 h-4 text-green-600" />
                            工業區地理位置檢核
                        </h4>
                        <p className="text-xs text-slate-500">請在左側輸入位置或直接點擊地圖</p>
                    </div>
                    <TaiwanHeatmap 
                        userLocation={userCoords} 
                        onLocationSelect={handleMapSelect}
                        className="flex-1"
                    />
                </div>
            )}

            {/* 2. Loading State */}
            {status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && status !== AnalysisStatus.ERROR && (
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                <div className="relative z-10 w-full max-w-md text-center space-y-8">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 bg-slate-50 rounded-full flex items-center justify-center shadow-inner">
                      {status === AnalysisStatus.SCANNING_GEO && <Map className="w-10 h-10 text-green-600 animate-pulse" />}
                      {status === AnalysisStatus.CHECKING_POLICY && <Scale className="w-10 h-10 text-blue-600 animate-pulse" />}
                      {status === AnalysisStatus.CALCULATING_FINANCE && <BarChart3 className="w-10 h-10 text-purple-600 animate-pulse" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{getStatusMessage()}</h3>
                    <p className="text-slate-500">正在處理數據...</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-700 ease-out"
                      style={{ width: `${getProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 3. Error State */}
            {status === AnalysisStatus.ERROR && (
               <div className="flex-1 bg-red-50 rounded-2xl border border-red-200 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                     <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">分析發生錯誤</h3>
                  <p className="text-red-600">請檢查網路連線或稍後再試。</p>
               </div>
            )}

            {/* 4. Results */}
            {status === AnalysisStatus.COMPLETE && report && (
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full animate-fade-in-up">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">AI Recommendation</div>
                    <h2 className="text-2xl font-bold">{report.strategyName}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase">預估 IRR</div>
                        <div className="text-2xl font-bold text-green-400">{report.irr}</div>
                     </div>
                     <div className="w-px h-10 bg-slate-700"></div>
                     <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase">淨現值 NPV</div>
                        <div className="text-xl font-bold text-white">{report.financialAnalysis.npv}</div>
                     </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-green-500 text-green-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                  >
                    總覽報告
                  </button>
                  <button 
                    onClick={() => setActiveTab('geo')}
                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'geo' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                  >
                    Geo-AI 與地圖
                  </button>
                  <button 
                    onClick={() => setActiveTab('finance')}
                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'finance' ? 'border-purple-500 text-purple-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                  >
                    財務模型
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto max-h-[600px]">
                  
                  {activeTab === 'overview' && (
                    <div className="p-6 space-y-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-700 leading-relaxed">{report.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                            <div className="text-sm text-slate-500 mb-1">現有資產估值</div>
                            <div className="text-lg font-bold text-slate-700 line-through decoration-slate-400">{report.originalValue}</div>
                         </div>
                         <div className="p-4 rounded-xl border border-green-200 bg-green-50 shadow-sm">
                            <div className="text-sm text-green-700 mb-1 font-bold">轉型後估值</div>
                            <div className="text-2xl font-bold text-green-700">{report.projectedValue}</div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded text-blue-600"><Trees className="w-5 h-5"/></div>
                            <div>
                                <div className="text-xs text-slate-500">年減碳量</div>
                                <div className="font-bold text-slate-800">{report.carbonReduction}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                            <div className="p-2 bg-amber-100 rounded text-amber-600"><Zap className="w-5 h-5"/></div>
                            <div>
                                <div className="text-xs text-slate-500">回本期</div>
                                <div className="font-bold text-slate-800">{report.roiPeriod}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                            <div className="p-2 bg-purple-100 rounded text-purple-600"><Scale className="w-5 h-5"/></div>
                            <div>
                                <div className="text-xs text-slate-500">建設期</div>
                                <div className="font-bold text-slate-800">{report.constructionPeriod}</div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'geo' && (
                    <div className="flex flex-col h-full">
                        <div className="h-64 relative border-b border-slate-200">
                             <TaiwanHeatmap userLocation={userCoords} className="h-full" />
                             <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs rounded shadow text-slate-600 font-bold z-[1000]">
                                資產位置分析
                             </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
                                        <Sun className="w-5 h-5" /> 太陽能潛力
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{report.geoAnalysis.solarPotential}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                                        <Zap className="w-5 h-5 text-yellow-500" /> 電網饋線
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{report.geoAnalysis.gridDistance}</div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-4">場域細部評估</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-slate-500 mb-1">屋頂結構狀況</div>
                                        <div className="font-medium text-slate-800">{report.geoAnalysis.roofCondition}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500 mb-1">氣候風險評級</div>
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                            <span className="font-medium text-slate-800">{report.geoAnalysis.climateRisk}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  )}

                  {activeTab === 'finance' && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">預估 CAPEX</div>
                                <div className="text-xl font-bold text-slate-900">{report.financialAnalysis.capexEstimate}</div>
                             </div>
                             <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="text-xs text-green-800 mb-1">預估 NPV</div>
                                <div className="text-xl font-bold text-green-700">{report.financialAnalysis.npv}</div>
                             </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <h4 className="font-bold text-slate-800 mb-4 text-sm">未來 10 年累計現金流預測</h4>
                            <div className="h-[200px] w-full min-h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                                        <RechartsTooltip />
                                        <Bar dataKey="cashflow" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-2 text-sm">主要收入來源</h4>
                            <div className="flex flex-wrap gap-2">
                                {report.financialAnalysis.revenueStreams.map((stream, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                        {stream}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};