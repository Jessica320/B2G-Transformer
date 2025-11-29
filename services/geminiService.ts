import { GoogleGenAI, Type } from "@google/genai";
import { AssetValuationRequest, TransformationReport } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateValuationReport = async (request: AssetValuationRequest): Promise<TransformationReport> => {
  const modelId = "gemini-2.5-flash";

  // Mock Data Definition (Fallback)
  const mockReport: TransformationReport = {
    strategyName: "工廠綠色轉型：屋頂光電 + 智慧微電網",
    description: `針對位於${request.location}的${request.assetType}，建議採用高效能單晶矽模組鋪設於閒置屋頂，並建置 500kW 儲能系統以調節尖離峰用電。此方案可將閒置資產轉化為穩定現金流來源。`,
    originalValue: "1.2 億 TWD",
    projectedValue: "1.65 億 TWD",
    irr: "9.2%",
    carbonReduction: "850 tCO2e/年",
    constructionPeriod: "8 個月",
    roiPeriod: "6.5 年",
    policyIncentives: ["經濟部能源署再生能源躉購機制", "中小企業綠色轉型補助計畫", "工業局低碳製程改善補助"],
    geoAnalysis: {
      solarPotential: "1,280 kWh/kWp (優良)",
      gridDistance: "約 350 公尺 (併網容易)",
      roofCondition: "RC 結構完整，適合乘載",
      climateRisk: "低淹水潛勢區"
    },
    financialAnalysis: {
      capexEstimate: "2,500 萬 TWD",
      npv: "3,800 萬 TWD",
      yearlyCashFlow: [-25, -5, 8, 22, 38, 55, 72, 90, 110, 130], // Cumulative trends
      revenueStreams: ["售電收入 (躉購)", "儲能輔助服務 (AFC)", "綠電憑證 (T-REC)"]
    }
  };

  if (!ai) {
    console.warn("No API Key found, using mock data.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockReport;
  }

  const prompt = `
    你現在是「B2G Asset Transformer」平台的 AI 核心引擎。
    這是一個結合 Geo-AI (地理空間分析)、PolicyAI (法規分析) 與 Financial AI (財務模型) 的系統。
    請分析以下台灣資產，並生成一份極度詳盡的「綠色轉型可行性評估報告」。
    
    資產參數：
    - 類型：${request.assetType}
    - 地點：${request.location}
    - 面積：${request.area}
    - 屋齡：${request.buildingAge}
    - 目前用途/電費：${request.currentUsage}, 平均電費 ${request.avgPowerBill}

    分析邏輯：
    1. Geo-AI：模擬該地點的日照量 (參考台灣平均)、離台電饋線距離、屋頂狀況。
    2. Policy：根據台灣法規 (如再生能源發展條例)，判斷適用補助。
    3. Finance：估算 CAPEX (建置成本)，並模擬未來 10 年的累積現金流趨勢 (假設躉購或綠電自由交易)。
    
    請回傳 JSON 格式，數值需具備專業性。
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
            strategyName: { type: Type.STRING, description: "轉型策略名稱" },
            description: { type: Type.STRING, description: "策略詳細說明" },
            originalValue: { type: Type.STRING, description: "現況資產估值" },
            projectedValue: { type: Type.STRING, description: "轉型後預估資產價值" },
            irr: { type: Type.STRING, description: "內部報酬率 (IRR) %" },
            carbonReduction: { type: Type.STRING, description: "預估年減碳量" },
            constructionPeriod: { type: Type.STRING, description: "工程建設期" },
            roiPeriod: { type: Type.STRING, description: "預估回本期" },
            policyIncentives: { type: Type.ARRAY, items: { type: Type.STRING } },
            
            geoAnalysis: {
              type: Type.OBJECT,
              properties: {
                solarPotential: { type: Type.STRING },
                gridDistance: { type: Type.STRING },
                roofCondition: { type: Type.STRING },
                climateRisk: { type: Type.STRING }
              }
            },
            financialAnalysis: {
              type: Type.OBJECT,
              properties: {
                capexEstimate: { type: Type.STRING },
                npv: { type: Type.STRING },
                yearlyCashFlow: { 
                  type: Type.ARRAY, 
                  items: { type: Type.NUMBER },
                },
                revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING } }
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