
import { GoogleGenAI, Type } from "@google/genai";
import { AssetValuationRequest, TransformationReport, Scenario } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateValuationReport = async (request: AssetValuationRequest): Promise<TransformationReport> => {
  const modelId = "gemini-2.5-flash";

  // Mock Scenarios with Realistic Cash Flows (Initial negative Capex, then positive returns)
  const mockScenarios: Scenario[] = [
    {
      id: "A",
      name: "方案 A：純屋頂光電 (Solar)",
      description: "利用閒置屋頂鋪設高效能單晶矽模組，成本門檻最低，風險低，適合穩健型轉型。",
      irr: "8.5%",
      roiPeriod: "6.2 年",
      capex: "1,200 萬",
      carbonReduction: "450 tCO2e/年",
      financials: {
        capexEstimate: "1,200 萬",
        npv: "1,800 萬",
        // Y0 is investment (negative), Y1-Y20 are returns
        yearlyCashFlow: [-1200, 250, 250, 250, 250, 250, 245, 245, 240, 240, 235, 235, 230, 230, 225, 225, 220, 220, 215, 215],
        revenueStreams: ["售電收入 (躉購费率)", "屋頂租金收益"]
      }
    },
    {
      id: "B",
      name: "方案 B：光充儲整合 (AI 推薦)",
      description: "結合光電與 500kW 儲能系統，參與台電電力輔助服務 (AFC)，獲利來源多元化，投報率最高。",
      irr: "11.2%",
      roiPeriod: "5.5 年",
      capex: "2,800 萬",
      carbonReduction: "680 tCO2e/年",
      financials: {
        capexEstimate: "2,800 萬",
        npv: "4,500 萬",
        yearlyCashFlow: [-2800, 650, 680, 720, 750, 780, 800, 820, 850, 880, 900, 920, 950, 980, 1000, 1020, 1050, 1080, 1100, 1120],
        revenueStreams: ["售電收入", "儲能輔助服務 (AFC)", "需量反應回饋"]
      }
    },
    {
      id: "C",
      name: "方案 C：綠建築全面改建",
      description: "進行建築外殼節能改善與智慧能源管理系統 (BEMS) 導入，大幅提升資產估值與租金溢價。",
      irr: "7.8%",
      roiPeriod: "8.5 年",
      capex: "5,500 萬",
      carbonReduction: "920 tCO2e/年",
      financials: {
        capexEstimate: "5,500 萬",
        npv: "6,200 萬",
        yearlyCashFlow: [-5500, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300],
        revenueStreams: ["綠色租金溢價", "節省電費", "碳權交易", "容積獎勵"]
      }
    }
  ];

  // Mock Data Definition (Fallback)
  const mockReport: TransformationReport = {
    originalValue: "1.2 億 TWD",
    projectedValue: "1.65 億 TWD",
    bestScenarioId: "B",
    policyIncentives: ["經濟部能源署再生能源躉購機制", "中小企業綠色轉型補助計畫", "工業局低碳製程改善補助"],
    geoAnalysis: {
      solarPotential: "1,280 kWh/kWp (優良)",
      gridDistance: "約 350 公尺 (併網容易)",
      roofCondition: "RC 結構完整，適合乘載",
      climateRisk: "低淹水潛勢區",
      sunlightHours: "1,150 小時/年",
      gridCapacity: "饋線餘裕充足 (>5MW)"
    },
    scenarios: mockScenarios
  };

  if (!ai) {
    console.warn("No API Key found, using mock data.");
    // No artificial delay here, frontend handles animation timing
    return mockReport;
  }

  const prompt = `
    你現在是「B2G Asset Transformer」平台的 AI 核心引擎。
    請分析以下台灣資產，並生成 3 種不同的綠色轉型情境方案 (Scenarios)。
    
    資產參數：
    - 類型：${request.assetType}
    - 地點：${request.location}
    - 面積：${request.area}
    - 屋齡：${request.buildingAge}
    - 目前用途：${request.currentUsage}

    請生成 JSON 格式回應，包含以下三個方案的詳細財務預測：
    1. 純屋頂光電 (Solar Only)
    2. 光充儲整合 (Solar + Storage) - 推薦方案
    3. 綠建築/智慧工廠改建 (Green Building/Smart Factory)

    JSON 欄位要求：
    - yearlyCashFlow: 請提供包含「初始投資(負值)」與後續19年收益的數字陣列 (共20個數字，單位：萬台幣)。
    - geoAnalysis: 請模擬生成具體的數據，如 "1,250 kWh/kWp"。
  `;

  try {
    const response = await ai!.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalValue: { type: Type.STRING },
            projectedValue: { type: Type.STRING },
            bestScenarioId: { type: Type.STRING },
            policyIncentives: { type: Type.ARRAY, items: { type: Type.STRING } },
            geoAnalysis: {
              type: Type.OBJECT,
              properties: {
                solarPotential: { type: Type.STRING },
                gridDistance: { type: Type.STRING },
                roofCondition: { type: Type.STRING },
                climateRisk: { type: Type.STRING },
                sunlightHours: { type: Type.STRING },
                gridCapacity: { type: Type.STRING }
              }
            },
            scenarios: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  irr: { type: Type.STRING },
                  roiPeriod: { type: Type.STRING },
                  capex: { type: Type.STRING },
                  carbonReduction: { type: Type.STRING },
                  financials: {
                    type: Type.OBJECT,
                    properties: {
                      capexEstimate: { type: Type.STRING },
                      npv: { type: Type.STRING },
                      yearlyCashFlow: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                      revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TransformationReport;

  } catch (error) {
    console.error("Gemini Analysis Failed, falling back to mock data:", error);
    return mockReport;
  }
};
