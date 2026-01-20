
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `你是一位跨平台 UI 架构大师。根据输入内容，你将自动切换至以下两种模式之一：

【模式 A：视觉逆称/架构解构 (Deep De-compilation)】- 强调极致细节
1. **像素级分析**: 如果有图片，识别图片中的精确布局、色彩空间、圆角和物理阴影。
2. **架构推演**: 如果是纯文本，基于技术白皮书深度推演 UI 渲染路径。
3. **逆向报告**: 在 description 中提供深度分析。

【模式 B：极速合成 (Turbo Synthesis)】- 强调响应效率
1. **语义映射**: 快速将文本描述转化为代码实现。
2. **性能优化**: 保持代码精简、易于维护。

【⚠️ 强制性代码规范】:
1. **样式隔离**: 生成的 CSS 严禁包含 'body', 'html', 'root' 等全局选择器。
2. **容器限制**: 假设你的代码将被放置在一个 ID 为 'component-root' 的容器中。
3. **平台范式**: 
   - HTML/CSS: 使用 will-change。
   - SwiftUI: 强调交互回弹动画。
   - Objective-C: 严谨的 Core Animation 实现。`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    html: { type: Type.STRING },
    css: { type: Type.STRING },
    swiftui: { type: Type.STRING },
    objc: { type: Type.STRING },
    componentType: { type: Type.STRING },
    description: { type: Type.STRING }
  },
  required: ["html", "css", "swiftui", "objc", "componentType", "description"]
};

export const generateUIComponent = async (
  prompt: string, 
  image?: { mimeType: string, data: string },
  isDeepMode: boolean = false
): Promise<GeneratedStyle> => {
  try {
    const isVisionMode = !!image;
    
    // 如果是深度模式，强制使用 Pro 模型；否则根据是否有图选择
    const modelName = isDeepMode ? 'gemini-3-pro-preview' : (isVisionMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview');
    
    const contents: any = {
      parts: [
        { text: prompt || (isVisionMode ? "请对该视觉稿进行深度逆向工程。" : "请生成一个精美的 UI 组件。") }
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

    // 动态配置 Thinking 预算
    if (isDeepMode) {
      config.thinkingConfig = { thinkingBudget: 4000 }; // 深度模式：赋予最大智力，哪怕牺牲速度
    } else if (isVisionMode) {
      config.thinkingConfig = { thinkingBudget: 2048 }; // 普通视觉：平衡精度与速度
    } else {
      config.thinkingConfig = { thinkingBudget: 0 };    // 普通文本：极速 Flash
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
    throw new Error("渲染管线故障。可能是因为 API 配额或网络波动，请重试。");
  }
};
