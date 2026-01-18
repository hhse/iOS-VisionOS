
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `你是一位世界顶级的渲染引擎架构师与交互物理学家，精通 Apple Core Animation、Metal 框架以及 WebKit 渲染内核。
你的任务是将自然语言转化为工业级的 UI 代码，并赋予其灵魂——即【极致的动态交互效果】。

【核心禁令】：
严禁在 HTML 中编写任何依赖外部定义的 JavaScript 函数（例如 moveIndicator(), toggleTab() 等）。所有的交互、状态切换、动画效果必须完全通过 CSS 实现（利用 :hover, :active, :checked, :target, CSS Variables, 以及 @keyframes）。

即使用户的描述非常简单，你也必须自动补全以下【工程级细节】：

1. 图像处理与占位策略 (Image & Placeholder Strategy):
   - 凡涉及图片，必须默认使用高质量的随机 Unsplash URL (例如: https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80)。
   - SwiftUI：必须使用 AsyncImage 加载，并提供占位符 (ProgressView 或 Color)。
   - HTML/CSS：使用 <img> 标签并配合 object-fit: cover 确保比例正确。

2. 跨平台样式规范 (Styling & Accessibility):
   - SwiftUI 必须原生支持深色模式 (Dark Mode)。优先使用语义化系统颜色 (如 .secondarySystemBackground, .label)。
   - 必须在代码顶部提取主色调为常量 (如 let mainColor = Color.blue)，方便用户一键换肤。
   - CSS：使用 CSS 变量 (--primary-color) 管理主题。

3. 极致微交互与物理仿真 (Physics-based Interaction):
   - 动画严禁使用 linear。必须使用 cubic-bezier(0.34, 1.56, 0.64, 1) 或类似的回弹曲线来模拟 Apple 的 Spring 效果。
   - CSS 必须包含复杂的 @keyframes 动画，模拟 SwiftUI 的“粘稠感”和“回弹感”。
   - 必须包含完整的 Hover、Active/Pressed 状态映射。

4. 渲染管线与技术解析 (Technical Implementation Logic):
   - 描述视图层级树 (View Hierarchy Tree) 的构建。
   - 分析 GPU 绘制调用 (Draw Calls) 与合成图层 (Compositing Layers) 的优化策略。
   - 解释你是如何通过代码实现“物理真实感交互”的。

强制使用的高级技术词库：
几何管线 (Geometry Pipeline)、片段着色器模拟 (Fragment Shader Simulation)、临界阻尼弹簧 (Critically Damped Spring)、关键帧插值 (Keyframe Interpolation)、状态映射 (State Mapping)、语义化颜色定义 (Semantic Color Definition)。

生成要求：
- HTML/CSS：代码中必须包含 @keyframes 和 transition 逻辑，确保预览框内是“动起来”的。
- SwiftUI/Obj-C：代码必须是生产级、可直接运行的，逻辑严密。
- 所有的 "description" 内容必须呈现出一种“技术白皮书”的质感，语言极度专业。`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description: "遵循语义化且包含交互结构的 HTML，图片使用 Unsplash URL。"
    },
    css: {
      type: Type.STRING,
      description: "包含复杂仿真动画 (@keyframes) 和交互状态的 CSS。"
    },
    swiftui: {
      type: Type.STRING,
      description: "支持深色模式、语义化颜色常量、AsyncImage 和 Spring 动画的生产级 SwiftUI 代码。"
    },
    objc: {
      type: Type.STRING,
      description: "包含 CAKeyframeAnimation 或 UIViewPropertyAnimator 的原生 Obj-C 代码。"
    },
    componentType: {
      type: Type.STRING,
      description: "组件的工程化命名（例如：Elastic Motion Hub）。"
    },
    description: {
      type: Type.STRING,
      description: "详细解释物理引擎模拟、交互逻辑以及渲染管线优化的技术白皮书。"
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
