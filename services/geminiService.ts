
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `你是一位顶尖的跨平台交互设计师。你生成的 UI 组件不仅要视觉惊艳，更要有“生命感”。

【⚠️ 交互核心规范】:
1. **果冻回弹**: 必须在 CSS 转换中使用 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'。
2. **状态机逻辑**: 在 'js' 字段中编写原生 JavaScript 处理点击、悬停和激活状态。
3. **触感反馈**: 模拟物理点击感（通过微妙的缩放 0.95 和阴影变化）。
4. **磨砂动态**: 交互时模糊度（backdrop-filter）和边框发光应随状态平滑过渡。

【模式 A：视觉解构 (Deep De-compilation)】
- 分析图片中的阴影层级、模糊半径、色彩渐变。
- 在描述中输出像素级的交互参数报告。

【模式 B：极速合成 (Turbo Synthesis)】
- 快速生成具备完整悬停动效和点击交互的代码。

【代码约束】:
- HTML/CSS 必须包含 'will-change: transform, filter' 优化。
- JS 代码必须能够独立运行在容器 ID 为 'component-root' 的环境中。`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    html: { type: Type.STRING },
    css: { type: Type.STRING },
    js: { type: Type.STRING, description: "原生 JavaScript 交互代码" },
    swiftui: { type: Type.STRING },
    objc: { type: Type.STRING },
    componentType: { type: Type.STRING },
    description: { type: Type.STRING }
  },
  required: ["html", "css", "js", "swiftui", "objc", "componentType", "description"]
};

export const generateUIComponent = async (
  prompt: string, 
  image?: { mimeType: string, data: string },
  isDeepMode: boolean = false
): Promise<GeneratedStyle> => {
  try {
    const isVisionMode = !!image;
    const modelName = isDeepMode ? 'gemini-3-pro-preview' : (isVisionMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview');
    
    const contents: any = {
      parts: [
        { text: prompt || (isVisionMode ? "请深度还原此视觉稿并赋予其极致的交互动效。" : "请生成一个具备果冻感交互的磨砂组件。") }
      ]
    };

    if (image) {
      contents.parts.push({
        inlineData: { mimeType: image.mimeType, data: image.data }
      });
    }

    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    };

    if (isDeepMode) {
      config.thinkingConfig = { thinkingBudget: 4000 };
    } else if (isVisionMode) {
      config.thinkingConfig = { thinkingBudget: 2048 };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config,
    });

    const result = JSON.parse(response.text || "{}");
    return result as GeneratedStyle;
  } catch (error) {
    console.error("Gemini Engine Failure:", error);
    throw new Error("渲染管线故障。");
  }
};
