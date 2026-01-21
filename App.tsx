
import React, { useState, useRef, useEffect } from 'react';
import { generateUIComponent } from './services/geminiService';
import { AppState, CodeLanguage } from './types';
import { PreviewCard } from './components/PreviewCard';
import { CodePanel } from './components/CodePanel';

const TEMPLATE_POOL = [
  "Apple Music 播放器控制面板",
  "iOS 18 灵动岛通知模块",
  "VisionOS 空间悬浮导航栏",
  "拟态有机传感器 (Haptic Feedback)",
  "多层级视差弥散渐变背景",
  "锁屏 Depth Effect 时间卡片",
  "Cyberpunk 2077 HUD 元素",
  "Spotify 动态色彩卡片",
  "macOS Sequoia 窗口控制条",
  "Google Material You 按钮组",
  "Figma 风格属性面板",
  "Airbnb 房源搜索栏",
  "Tesla 车机控制中心",
  "Adobe Creative Cloud 侧边栏",
  "Arc Browser 侧边导航",
  "Nike Run Club 跑步统计图表"
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { 
    imagePayload?: { mimeType: string, data: string, preview: string },
    lastGenerationWasVision?: boolean,
    isDeepMode: boolean 
  }>({
    prompt: '',
    isGenerating: false,
    currentStyle: null,
    error: null,
    activeLanguage: 'html',
    isDeepMode: false
  });

  const [displayTemplates, setDisplayTemplates] = useState<string[]>(TEMPLATE_POOL.slice(0, 6));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setState(prev => ({
          ...prev,
          imagePayload: {
            mimeType: file.type,
            data: base64Data,
            preview: reader.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setState(prev => {
        const newState = { ...prev };
        delete newState.imagePayload;
        return newState;
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!state.prompt.trim() && !state.imagePayload) return;

    const isVision = !!state.imagePayload;
    setState(prev => ({ ...prev, isGenerating: true, error: null, lastGenerationWasVision: isVision }));

    try {
      const style = await generateUIComponent(
        state.prompt, 
        state.imagePayload ? { mimeType: state.imagePayload.mimeType, data: state.imagePayload.data } : undefined,
        state.isDeepMode
      );
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

  const refreshTemplates = () => {
    setIsRefreshing(true);
    // 随机洗牌并选取前6个
    const shuffled = [...TEMPLATE_POOL].sort(() => 0.5 - Math.random());
    setDisplayTemplates(shuffled.slice(0, 6));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleQuickPrompt = (text: string) => {
    setState(prev => ({ ...prev, prompt: text }));
  };

  return (
    <div className="w-full flex flex-col p-4 md:p-8 lg:p-10 gap-8 max-w-[1600px] mx-auto min-h-screen">
      {/* 顶部品牌区 */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 shadow-2xl shadow-blue-500/20 flex items-center justify-center border border-white/10 group transition-all duration-700 hover:rotate-12">
                 <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                 </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white leading-none uppercase">GlowFlow<span className="text-blue-500 italic">.</span>Vision</h1>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mt-1">V3.5 • Pro Pipeline Architecture</p>
              </div>
           </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <span className="flex items-center gap-2">
             <span className={`w-1.5 h-1.5 rounded-full ${state.isDeepMode ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]' : (state.imagePayload ? 'bg-blue-500' : 'bg-green-500')}`}></span> 
             {state.isDeepMode ? 'DEEP ANALYSIS ACTIVE' : (state.imagePayload ? 'PRECISION ENGINE' : 'FLASH SYNTHESIS READY')}
          </span>
          <span className="w-px h-3 bg-white/10"></span>
          <span>Apple HIG 2025 Standard</span>
        </div>
      </header>

      {/* 主界面网格 */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 左侧控制区 */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 传感器控制控制台 (Sensor Console) */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded-xl backdrop-blur-3xl shadow-inner">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Sensors</span>
                  
                  {/* 图片传感器按钮 */}
                  <div className="flex items-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase tracking-tight ${state.imagePayload ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
                      >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                          {state.imagePayload ? 'Optical Active' : 'Optical In'}
                      </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-px h-3 bg-white/10"></div>
                  
                  {/* 深度模式开关 */}
                  <div 
                    className="flex items-center gap-2 cursor-pointer select-none group" 
                    onClick={() => setState(s => ({...s, isDeepMode: !s.isDeepMode}))}
                  >
                    <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${state.isDeepMode ? 'text-purple-400' : 'text-white/20'}`}>
                      {state.isDeepMode ? 'Deep Mode (4K)' : 'Deep Mode'}
                    </span>
                    <div className={`w-8 h-4.5 rounded-full p-0.5 transition-all duration-500 ease-out ${state.isDeepMode ? 'bg-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'bg-white/10'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all duration-500 ease-out ${state.isDeepMode ? 'translate-x-3.5 shadow-sm' : 'translate-x-0 opacity-40'}`} />
                    </div>
                  </div>
                </div>
            </div>

            {/* 输入终端 (Input Terminal) */}
            <form 
              onSubmit={handleGenerate} 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className={`relative transition-all duration-700 ${isDragging ? 'scale-[1.01]' : ''}`}
            >
              <div className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 bg-black/40 backdrop-blur-3xl shadow-2xl ${state.isDeepMode ? 'border-purple-500/40' : (isDragging ? 'border-blue-500' : 'border-white/[0.07]')}`}>
                {/* 负载显示 (Payload Display) */}
                {state.imagePayload && (
                  <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group/img">
                          <img src={state.imagePayload.preview} className="w-full h-full object-cover" alt="Upload" />
                          <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay animate-pulse"></div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${state.isDeepMode ? 'text-purple-400' : 'text-blue-400'}`}>Optical Matrix Loaded</span>
                          <span className="text-[9px] text-white/20 font-mono tracking-tighter">
                            PATH: {state.isDeepMode ? 'REVERSE_DEEP_4K' : 'REVERSE_STANDARD_2K'}
                          </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); clearImage(); }}
                      className="p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-red-400 transition-all active:scale-90"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}

                <textarea
                  value={state.prompt}
                  onChange={(e) => setState(p => ({ ...p, prompt: e.target.value }))}
                  placeholder={state.isDeepMode ? "深度引擎已就绪：输入指令进行 4000 级分析..." : "输入需求，或上传视觉稿进行解构..."}
                  className="w-full min-h-[200px] p-8 bg-transparent text-white placeholder-white/10 focus:outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                />
              </div>

              {/* 生成动作按钮 */}
              <button 
                type="submit"
                disabled={state.isGenerating || (!state.prompt.trim() && !state.imagePayload)}
                className={`absolute bottom-6 right-6 h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl active:scale-95 z-10 ${state.isDeepMode ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/30' : (state.imagePayload ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-green-600 text-white hover:bg-green-500 shadow-green-500/20')}`}
              >
                {state.isGenerating ? (
                  <span className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                    {state.isDeepMode ? 'Deep Thinking...' : 'Processing...'}
                  </span>
                ) : (state.isDeepMode ? 'Launch Deep De-compile' : (state.imagePayload ? 'Reverse Engineering' : 'Flash Generate'))}
              </button>
            </form>
          </section>

          {/* 范式库 (Paradigm Lab) */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/10">Engine Paradigms</h3>
              <button 
                onClick={refreshTemplates}
                disabled={isRefreshing}
                className={`p-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-white/20 hover:text-white hover:bg-white/5 transition-all active:scale-90 ${isRefreshing ? 'opacity-50' : ''}`}
                title="刷新模板"
              >
                <svg className={`w-3 h-3 transition-transform duration-500 ${isRefreshing ? 'rotate-[360deg]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {displayTemplates.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleQuickPrompt(preset)}
                  className={`px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-left text-[11px] font-bold text-white/30 hover:text-white hover:bg-white/[0.04] transition-all group relative overflow-hidden active:scale-95 ${state.isDeepMode ? 'hover:border-purple-500/30' : 'hover:border-green-500/30'}`}
                >
                  <span className="relative z-10">{preset}</span>
                  <div className={`absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${state.isDeepMode ? 'from-purple-500/5' : 'from-green-500/5'}`} />
                </button>
              ))}
            </div>
          </section>

          {/* 实时状态指示器 (Latency Matrix) */}
          <div className={`glass p-6 rounded-[2rem] border transition-all duration-1000 ${state.isDeepMode ? 'bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/5 border-purple-500/20' : 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-white/[0.05]'}`}>
            <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${state.isDeepMode ? 'text-purple-400' : 'text-white/40'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${state.isDeepMode ? 'bg-purple-400 animate-pulse' : (state.imagePayload ? 'bg-blue-400' : 'bg-green-400')}`}></div>
                Performance Matrix
            </h4>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-tighter">
                    <span>Active Route</span>
                    <span className={state.isDeepMode ? "text-purple-400" : (state.imagePayload ? "text-blue-500" : "text-green-500")}>
                        {state.isDeepMode ? "Pro Deep (4000T)" : (state.imagePayload ? "Pro Vision (2048T)" : "Flash Turbo (Direct)")}
                    </span>
                </div>
                <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${state.isDeepMode ? 'bg-purple-500 w-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]' : (state.imagePayload ? 'bg-blue-500 w-full' : 'bg-green-500 w-full')}`}></div>
                </div>
                <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed font-medium">
                   {state.isDeepMode ? "Allocated 4,000 thinking tokens for structural de-compilation." : (state.imagePayload ? "Allocated 2,048 thinking tokens for pixel-matrix analysis." : "Executing direct synthesis without thinking overhead.")}
                </p>
            </div>
          </div>
        </div>

        {/* 右侧展示区 */}
        <div className="lg:col-span-8 flex flex-col xl:flex-row gap-8 min-h-[600px] xl:h-[750px]">
          <div className="flex-1 min-h-[500px] h-full overflow-hidden flex flex-col">
            <PreviewCard 
              style={state.currentStyle} 
              loading={state.isGenerating} 
              activeLanguage={state.activeLanguage}
              isVisionRequest={state.lastGenerationWasVision || state.isDeepMode}
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

      {/* 页脚 */}
      <footer className="mt-8 pt-8 border-t border-white/[0.05] flex items-center justify-between pb-12">
        <p className="text-[9px] text-white/10 uppercase font-black tracking-[0.5em]">
           Engine Build 2025.02.01 &bull; Stable Pipeline &bull; Pro Specs
        </p>
      </footer>
    </div>
  );
};

export default App;
