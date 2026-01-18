
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `你是一位世界顶级的渲染引擎架构师。你的任务是将描述转化为精美的代码。

【重要：预览适配原则】：
生成的组件必须是“容器友好”的。严禁在 HTML 根元素或主要的 CSS 中使用超过 1000px 的固定宽度/高度。
- 对于“弥散渐变”或“背景效果”，请将其应用于一个填充父容器 (width: 100%; height: 100%; min-height: 300px;) 的容器中，而不是创建一个超大的固定尺寸矩形。
- 确保所有绝对定位的装饰性元素（如光晕）使用百分比或相对单位，避免它们将预览窗口撑开到无法视知的程度。

【核心禁令】：
严禁依赖外部定义的 JavaScript 函数。所有的交互必须完全通过 CSS 实现（:hover, :active, @keyframes）。

【工程细节】：
1. 图像策略：使用 https://images.unsplash.com/photo-... 占位。
2. 跨平台：SwiftUI 必须支持深色模式。
3. 物理仿真：动画使用 cubic-bezier(0.34, 1.56, 0.64, 1) 模拟 Apple 回弹感。
4. 渲染分析：在 description 中以“技术白皮书”风格解释 GPU 合成图层、几何管线优化。

强制词库：几何管线、片段着色器模拟、临界阻尼弹簧、关键帧插值。

生成要求：
- HTML/CSS 必须是响应式的，能自动适配其父级预览框。
- 所有的 "description" 内容必须极度专业。`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description: "遵循语义化且包含交互结构的 HTML，必须是自适应容器。"
    },
    css: {
      type: Type.STRING,
      description: "包含复杂仿真动画 (@keyframes) 和交互状态的 CSS，严禁硬编码超大尺寸。"
    },
    swiftui: {
      type: Type.STRING,
      description: "支持深色模式、语义化颜色常量、AsyncImage 和 Spring 动画的生产级 SwiftUI 代码。"
    },
    objc: {
      type: Type.STRING,
      description: "原生 Obj-C 代码。"
    },
    componentType: {
      type: Type.STRING,
      description: "组件的工程化命名。"
    },
    description: {
      type: Type.STRING,
      description: "技术白皮书风格的详细解释。"
    }
  },
  required: ["html", "css", "swiftui", "objc", "componentType", "description"]
};

export const generateUIComponent = async (prompt: string): Promise<GeneratedStyle> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 2500 }
      },
    });

    const result = JSON.parse(response.text);
    return result as GeneratedStyle;
  } catch (error) {
    console.error("Gemini 渲染引擎错误:", error);
    throw new Error("渲染管线拓扑构建失败，请检查逻辑参数。");
  }
};
