
export interface AssetValuationRequest {
  assetType: string;
  location: string;
  area: string; // 坪數
  currentUsage: string;
  buildingAge: string; // 屋齡
  avgPowerBill: string; // 平均電費
}

export interface GeoAnalysis {
  solarPotential: string; // e.g. "1,350 kWh/m²/年"
  gridDistance: string; // e.g. "< 500m"
  roofCondition: string; // e.g. "平頂水泥，結構良好"
  climateRisk: string; // e.g. "低淹水風險"
  sunlightHours: string; // 日照時數
  gridCapacity: string; // 饋線容量餘裕
}

export interface PolicyAnalysis {
  zoningType: string; // e.g. "乙種工業區"
  complianceStatus: 'compliant' | 'warning' | 'non-compliant'; // 合規狀態
  regulations: string[]; // e.g. ["建蔽率 70%", "容積率 210%"]
  restrictions: string; // e.g. "需申請雜項執照"
  subsidyEligibility: string[]; // e.g. ["工廠綠能化補助", "躉購費率加成"]
}

export interface FinancialAnalysis {
  capexEstimate: string; // 預估建置成本
  npv: string; // 淨現值
  yearlyCashFlow: number[]; // 20年預測現金流 (用於繪圖)
  revenueStreams: string[]; // 收入來源
}

export interface Scenario {
  id: string;
  name: string; // e.g. "方案 A: 屋頂光電"
  description: string;
  irr: string;
  roiPeriod: string;
  capex: string;
  carbonReduction: string;
  financials: FinancialAnalysis;
}

export interface TransformationReport {
  originalValue: string;
  projectedValue: string; // 最佳方案的估值
  bestScenarioId: string;
  policyIncentives: string[];
  geoAnalysis: GeoAnalysis;
  policyAnalysis: PolicyAnalysis; // 新增法規分析模組
  scenarios: Scenario[]; // 多個方案供比較
}

export interface MarketplaceItem {
  id: string;
  type: string;
  location: string;
  area: string;
  potentialIrr: string;
  tags: string[];
  status: 'matching' | 'negotiating' | 'closed';
  matchedInvestors: number;
}

export interface IndustrialPark {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
  description: string;
}

export enum AnalysisStatus {
  IDLE = 'idle',
  SCANNING_GEO = 'scanning_geo',
  CHECKING_POLICY = 'checking_policy',
  CALCULATING_FINANCE = 'calculating_finance',
  COMPLETE = 'complete',
  ERROR = 'error'
}
