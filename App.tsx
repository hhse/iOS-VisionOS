
import React, { useState, useRef } from 'react';
import { generateUIComponent } from './services/geminiService';
import { AppState, CodeLanguage } from './types';
import { PreviewCard } from './components/PreviewCard';
import { CodePanel } from './components/CodePanel';

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { 
    imagePayload?: { mimeType: string, data: string, preview: string },
    lastGenerationWasVision?: boolean,
    isDeepMode: boolean // 新增：深度模式开关
  }>({
    prompt: '',
    isGenerating: false,
    currentStyle: null,
    error: null,
    activeLanguage: 'html',
    isDeepMode: false
  });

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

  const templates = [
    "Apple Music 播放器控制面板",
    "iOS 18 灵动岛通知模块",
    "VisionOS 空间悬浮导航栏",
    "拟态有机传感器 (Haptic Feedback)",
    "多层级视差弥散渐变背景",
    "锁屏 Depth Effect 时间卡片"
  ];

  const handleQuickPrompt = (text: string) => {
    setState(prev => ({ ...prev, prompt: text }));
  };

  return (
    <div className="w-full flex flex-col p-4 md:p-8 lg:p-10 gap-8 max-w-[1600px] mx-auto min-h-screen">
      {/* 头部 */}
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
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mt-1">V3.4 • Omni-Power Engine</p>
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

      {/* 主界面 */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 左侧栏 */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Prompt Engine / Sensor</label>
                
                <div className="flex items-center gap-4">
                  {/* 图片上传按钮 - 找回来了！ */}
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
                        className={`p-2 rounded-lg border transition-all ${state.imagePayload ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                        title="上传图片进行逆向工程"
                      >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                      </button>
                  </div>

                  <div className="w-px h-3 bg-white/10"></div>

                  {/* 深度模式切换器 */}
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setState(s => ({...s, isDeepMode: !s.isDeepMode}))}>
                    <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${state.isDeepMode ? 'text-purple-400' : 'text-white/20'}`}>Deep Mode</span>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 ${state.isDeepMode ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/10'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-all duration-300 ${state.isDeepMode ? 'translate-x-4 shadow-sm' : 'translate-x-0 opacity-40'}`} />
                    </div>
                  </div>
                </div>
            </div>

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
              className={`relative group transition-all duration-500 ${isDragging ? 'scale-[1.01]' : ''}`}
            >
              <div className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 bg-white/[0.01] backdrop-blur-3xl ${state.isDeepMode ? 'border-purple-500/30' : (isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-white/5')}`}>
                {state.imagePayload && (
                  <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-4 animate-in slide-in-from-top-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 group/img shadow-2xl">
                        <img src={state.imagePayload.preview} className="w-full h-full object-cover" alt="Upload" />
                        <button 
                          onClick={(e) => { e.preventDefault(); clearImage(); }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${state.isDeepMode ? 'text-purple-400' : 'text-blue-400'}`}>Image Matrix Loaded</span>
                        <span className="text-[9px] text-white/20 font-mono tracking-tighter">
                          {state.isDeepMode ? 'PIPELINE: DEEP_REVERSE_4000' : 'PIPELINE: STANDARD_REVERSE'}
                        </span>
                    </div>
                  </div>
                )}

                <textarea
                  value={state.prompt}
                  onChange={(e) => setState(p => ({ ...p, prompt: e.target.value }))}
                  placeholder={state.isDeepMode ? "深度引擎已就绪：输入指令进行 4000 级分析..." : "输入需求，或开启“深度解构”获得最高品质..."}
                  className="w-full min-h-[160px] p-8 bg-transparent text-white placeholder-white/5 focus:outline-none transition-all resize-none text-sm font-medium"
                />
              </div>

              <button 
                type="submit"
                disabled={state.isGenerating || (!state.prompt.trim() && !state.imagePayload)}
                className={`absolute bottom-6 right-6 h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 z-10 ${state.isDeepMode ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/30' : (state.imagePayload ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-green-600 text-white hover:bg-green-500 shadow-green-500/20')}`}
              >
                {state.isGenerating ? (
                  <span className="flex items-center gap-3">
                    <div className="w-3 h-3 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                    {state.isDeepMode ? 'DEEP THINKING...' : (state.imagePayload ? 'DECODING...' : 'FLASH SYNC...')}
                  </span>
                ) : (state.isDeepMode ? 'DEEP DE-COMPILE' : (state.imagePayload ? 'DE-COMPILE' : 'TURBO GENERATE'))}
              </button>
            </form>
          </section>

          {/* 灵感模板模块 */}
          <section>
            <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/10 mb-5 px-1">Engine Paradigms / 灵感实验室</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleQuickPrompt(preset)}
                  className={`px-4 py-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 text-left text-[11px] font-bold text-white/30 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all group relative overflow-hidden active:scale-95 ${state.isDeepMode ? 'hover:border-purple-500/40' : 'hover:border-green-500/40'}`}
                >
                  <span className="relative z-10">{preset}</span>
                  <div className={`absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${state.isDeepMode ? 'from-purple-500/10' : 'from-green-500/10'}`} />
                </button>
              ))}
            </div>
          </section>

          <div className={`glass p-8 rounded-[2.5rem] border transition-all duration-500 ${state.isDeepMode ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20' : 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-white/5'}`}>
            <h4 className={`text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${state.isDeepMode ? 'text-purple-400' : 'text-indigo-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${state.isDeepMode ? 'bg-purple-500 animate-pulse' : (state.imagePayload ? 'bg-blue-500' : 'bg-green-500')}`}></div>
                Latency Matrix
            </h4>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                    <span>Engine Type</span>
                    <span className={state.isDeepMode ? "text-purple-400" : (state.imagePayload ? "text-blue-500" : "text-green-500")}>
                        {state.isDeepMode ? "Pro Deep (Max)" : (state.imagePayload ? "Pro (Balanced)" : "Flash (Turbo)")}
                    </span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${state.isDeepMode ? 'bg-purple-500 w-full animate-pulse' : (state.imagePayload ? 'bg-blue-500 w-full' : 'bg-green-500 w-full')}`}></div>
                </div>
                <p className="text-[8px] text-white/20 uppercase tracking-widest leading-relaxed font-mono">
                   {state.isDeepMode ? "Thinking budget: 4000. Full architectural de-compilation engaged." : (state.imagePayload ? "Thinking budget: 2048. Pixel analysis pipeline active." : "Bypassing chain for near-instant synthesis.")}
                </p>
            </div>
          </div>
        </div>

        {/* 右侧栏 */}
        <div className="lg:col-span-8 flex flex-col xl:flex-row gap-8 min-h-[600px] xl:h-[700px]">
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

      <footer className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between pb-12">
        <p className="text-[9px] text-white/10 uppercase font-black tracking-[0.5em]">
           GlowFlow Engine V3.4 &bull; Multi-Pipe Architecture &bull; 4000 Budget Capable
        </p>
      </footer>
    </div>
  );
};

export default App;
