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
}

export interface FinancialAnalysis {
  capexEstimate: string; // 預估建置成本
  npv: string; // 淨現值
  yearlyCashFlow: number[]; // 20年預測現金流 (用於繪圖)
  revenueStreams: string[]; // 收入來源
}

export interface TransformationReport {
  strategyName: string;
  description: string;
  originalValue: string;
  projectedValue: string;
  irr: string;
  carbonReduction: string;
  constructionPeriod: string;
  roiPeriod: string;
  policyIncentives: string[];
  
  // New detailed sections
  geoAnalysis: GeoAnalysis;
  financialAnalysis: FinancialAnalysis;
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