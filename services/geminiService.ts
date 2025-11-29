
import { GoogleGenAI, Type } from "@google/genai";
import { AssetValuationRequest, TransformationReport, Scenario } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateValuationReport = async (request: AssetValuationRequest): Promise<TransformationReport> => {
  const modelId = "gemini-2.5-flash";

  // Mock Scenarios with Realistic Cash Flows
  // 數據修正：採用台灣市場真實行情 (光電投報率約 8-10%, 儲能約 10-12%)
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
        npv: "0.45 億", 
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
      capex: "1.5 億", 
      carbonReduction: "920 tCO2e/年",
      financials: {
        capexEstimate: "1.5 億",
        npv: "2.1 億",
        yearlyCashFlow: [-15000, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000],
        revenueStreams: ["綠色租金溢價", "節省電費", "碳權交易", "容積獎勵"]
      }
    }
  ];

  // Mock Data Definition (Fallback)
  // 法規修正：依據台灣常見乙種工業區標準 (建蔽率70%, 容積率210%)
  const mockReport: TransformationReport = {
    originalValue: "1.2 億",
    projectedValue: "1.65 億",
    bestScenarioId: "B",
    policyIncentives: ["經濟部能源署再生能源躉購機制", "中小企業綠色轉型補助計畫", "工業局低碳製程改善補助"],
    geoAnalysis: {
      solarPotential: "1,280 kWh/kWp (優良)",
      gridDistance: "約 350 公尺 (併網容易)",
      roofCondition: "RC 結構完整，可承重",
      climateRisk: "低淹水潛勢區 (NCDR圖資)",
      sunlightHours: "1,150 小時/年",
      gridCapacity: "饋線餘裕充足 (>5MW)"
    },
    policyAnalysis: {
      zoningType: "乙種工業區 (Industrial Zone Type B)",
      complianceStatus: "compliant",
      regulations: [
        "法定建蔽率 70%", 
        "法定容積率 210%", 
        "需符合《都市計畫法臺灣省施行細則》",
        "屋頂光電免計入建築高度"
      ],
      restrictions: "非都市計畫區內，需注意排水計畫審查",
      subsidyEligibility: ["經濟部太陽光電補助", "工業局低碳轉型專案貸款"]
    },
    scenarios: mockScenarios
  };

  if (!ai) {
    console.warn("No API Key found, using mock data.");
    return mockReport;
  }

  // Optimized Prompt with Expert Persona and Regulatory Rules
  const prompt = `
    請扮演「台灣專業建築師」與「土地開發代書」的角色，結合「B2G Asset Transformer」的 AI 運算能力。
    請分析以下台灣資產，並生成 3 種不同的綠色轉型情境方案 (Scenarios)。
    
    【輸入資產參數】
    - 類型：${request.assetType}
    - 地點：${request.location}
    - 面積：${request.area}
    - 屋齡：${request.buildingAge}
    - 目前用途：${request.currentUsage}

    【分析邏輯與法規限制 (Strict Compliance)】
    1. 土地分區判斷：
       - 若地點包含「工業區」、「加工出口區」，請預設為「乙種工業區」或「產業專用區」。
         -> 標準參數：建蔽率 70% / 容積率 210% (切勿填寫 300% 以上，除非是特殊商業區)。
       - 若地點為「科學園區」，依據該園區特別條例。
       - 若為「商辦」，容積率可設為 300%~560% (依路寬而定)。
    2. 財務估算：
       - 太陽能造價約 5-6 萬/kW。
       - 儲能造價約 2.5-3 萬/kWh。
       - 請產生合理的 CAPEX 與 IRR (通常在 6%~12% 之間)。
    3. 法規引用：
       - 請引用真實法規名稱，如《都市計畫法》、《再生能源發展條例》。

    【輸出格式要求 (JSON)】
    請生成 JSON 格式回應，包含 bestScenarioId (推薦方案ID)。
    
    - policyAnalysis: 必須包含真實的 zoningType, regulations (列出建蔽/容積率), restrictions。
    - scenarios: 包含 3 個方案 (A: Solar, B: Storage, C: Renovation)。
    - 金額單位：若金額超過 1 億，使用「億」；若小於 1 億，使用「萬」。
    - yearlyCashFlow: 提供 20 年現金流陣列 (數值)。
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
            policyAnalysis: {
              type: Type.OBJECT,
              properties: {
                zoningType: { type: Type.STRING },
                complianceStatus: { type: Type.STRING, enum: ["compliant", "warning", "non-compliant"] },
                regulations: { type: Type.ARRAY, items: { type: Type.STRING } },
                restrictions: { type: Type.STRING },
                subsidyEligibility: { type: Type.ARRAY, items: { type: Type.STRING } }
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
