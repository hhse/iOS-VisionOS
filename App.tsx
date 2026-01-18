
import React, { useState } from 'react';
import { generateUIComponent } from './services/geminiService';
import { AppState, CodeLanguage } from './types';
import { PreviewCard } from './components/PreviewCard';
import { CodePanel } from './components/CodePanel';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    prompt: '',
    isGenerating: false,
    currentStyle: null,
    error: null,
    activeLanguage: 'html'
  });

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!state.prompt.trim() || state.isGenerating) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const style = await generateUIComponent(state.prompt);
      setState(prev => ({ 
        ...prev, 
        currentStyle: style, 
        isGenerating: false 
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || '渲染引擎管线合成错误' 
      }));
    }
  };

  const handleQuickPrompt = (text: string) => {
    setState(prev => ({ ...prev, prompt: text }));
  };

  const templates = [
    "Apple Intelligence 呼吸感霓虹边框",
    "iOS 18 控制中心模块化拟态开关",
    "灵动岛 (Dynamic Island) 物理回弹药丸",
    "VisionOS 沉浸式毛玻璃浮窗",
    "Action Button 磁力感反馈徽章",
    "锁屏景深感 (Depth) 时间卡片"
  ];

  return (
    <div className="w-full flex flex-col p-4 md:p-8 lg:p-10 gap-8 max-w-[1600px] mx-auto min-h-screen">
      {/* 头部 */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-2xl shadow-purple-500/20 flex items-center justify-center border border-white/10">
                 <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white leading-none">霓光流动<span className="text-purple-500 italic">.</span>AI</h1>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mt-1">iOS/VisionOS 智能组件合成引擎</p>
              </div>
           </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <span className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Gemini 3 Pro 深度介入
          </span>
          <span className="w-px h-3 bg-white/10"></span>
          <span>Apple HIG 设计规范已同步</span>
        </div>
      </header>

      {/* 主界面 */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 左侧栏：输入与控制 */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">技术视觉规格</label>
            <form onSubmit={handleGenerate} className="relative">
              <textarea
                value={state.prompt}
                onChange={(e) => setState(p => ({ ...p, prompt: e.target.value }))}
                placeholder="例如：一个模仿 iOS 18 灵动岛风格的静音开关，带有高频触觉感应动画..."
                className="w-full min-h-[180px] p-6 rounded-[2rem] glass bg-white/[0.01] border-white/5 text-white placeholder-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all resize-none text-sm"
              />
              <button 
                type="submit"
                disabled={state.isGenerating || !state.prompt.trim()}
                className="absolute bottom-5 right-5 h-12 px-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white disabled:opacity-20 transition-all shadow-2xl active:scale-90"
              >
                {state.isGenerating ? '正在渲染...' : '生成组件'}
              </button>
            </form>
            
            {state.error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-medium flex items-center gap-3">
                {state.error}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20 mb-5 px-1">iOS 实验室模板</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleQuickPrompt(preset)}
                  className="px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left text-[11px] font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">{preset}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                </button>
              ))}
            </div>
          </section>

          <div className="glass p-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/10">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-300 mb-2">底层渲染管线</h4>
            <p className="text-[11px] text-white/30 leading-relaxed font-medium">
              引擎采用 Apple 渲染管线仿真技术。自动处理子像素渲染与 Alpha 合成。
            </p>
          </div>
        </div>

        {/* 右侧栏：预览与代码 - 关键改进：限制溢出 */}
        <div className="lg:col-span-8 flex flex-col xl:flex-row gap-8 min-h-[600px] xl:h-[600px]">
          <div className="flex-1 min-h-[500px] h-full overflow-hidden flex flex-col">
            <PreviewCard 
              style={state.currentStyle} 
              loading={state.isGenerating} 
              activeLanguage={state.activeLanguage}
            />
          </div>
          <div className="flex-1 min-h-[500px] h-full overflow-hidden flex flex-col">
            <CodePanel 
              style={state.currentStyle} 
              activeLanguage={state.activeLanguage} 
              onLanguageChange={(lang) => setState(s => ({...s, activeLanguage: lang}))} 
            />
          </div>
        </div>

      </main>

      <footer className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 pb-12">
        <p className="text-[9px] text-white/10 uppercase font-black tracking-[0.5em]">
          为下一代 iOS/VisionOS 应用而生 &bull; Vercel 极速部署
        </p>
      </footer>
    </div>
  );
};

export default App;
