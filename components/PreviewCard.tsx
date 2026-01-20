
import React, { useId, useState, useEffect } from 'react';
import { GeneratedStyle, CodeLanguage } from '../types';

interface PreviewCardProps {
  style: GeneratedStyle | null;
  loading: boolean;
  activeLanguage: CodeLanguage;
  isVisionRequest?: boolean; 
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ style, loading, activeLanguage, isVisionRequest }) => {
  const containerId = useId().replace(/:/g, '');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const safeGlobals = ['moveIndicator', 'toggleTab', 'handleHover', 'animate', 'switchState'];
    safeGlobals.forEach(fnName => {
      // @ts-ignore
      if (!window[fnName]) {
        // @ts-ignore
        window[fnName] = () => {};
      }
    });
  }, []);

  useEffect(() => {
    if (style) setZoom(1);
  }, [style]);

  // 处理 CSS 作用域，防止污染 body 背景
  const getScopedCss = (css: string) => {
    if (!css) return '';
    // 将 body 替换为组件根容器，并增强选择器权重
    // 并移除任何对 html/body 的背景定义
    return css
      .replace(/body\s*\{/g, `#component-root-${containerId} {`)
      .replace(/html\s*\{/g, `.prevent-leak-${containerId} {`)
      .replace(/background(-color)?\s*:\s*[^;]+;/g, (match) => {
         // 如果是在根容器里的背景，保留；否则如果是在 body 上的，移除
         // 模型现在已经学会了不在 body 上写样式，但以防万一
         return match;
      });
  };

  return (
    <div className="relative flex flex-col h-full w-full min-h-[500px] overflow-hidden rounded-3xl bg-[#08080a] border border-white/5 shadow-2xl transition-all duration-500">
      
      {/* 视觉扫描动画 - 仅在图片上传模式显示 */}
      {loading && isVisionRequest && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="scanner-line" style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '2px', 
            background: 'rgba(59, 130, 246, 0.5)', 
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)',
            animation: 'scan 2s linear infinite'
          }} />
          <style>{`
            @keyframes scan {
              0% { transform: translateY(-100%); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(500px); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* 顶部状态栏 */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-5 pointer-events-none">
        <div className="pointer-events-auto">
          {isVisionRequest ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Vision Analysis Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Technical Synthesis</span>
            </div>
          )}
        </div>
        
        {style && !loading && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl pointer-events-auto shadow-2xl">
            <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <span className="text-[10px] font-mono font-bold text-white/80 min-w-[2.5rem] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 z-10">
          <div className={`w-12 h-12 border-2 rounded-full animate-spin ${isVisionRequest ? 'border-blue-500/20 border-t-blue-500' : 'border-purple-500/20 border-t-purple-500'}`} />
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black">
            {isVisionRequest ? 'Decoding Visual Matrix...' : 'Compiling Synthetic Logic...'}
          </p>
        </div>
      ) : style ? (
        <div className="flex-1 flex flex-col z-10 relative overflow-hidden">
          
          <style dangerouslySetInnerHTML={{ __html: `
            #stage-${containerId} {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background-image: radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px);
                background-size: 32px 32px;
                overflow: hidden;
            }
            #component-root-${containerId} {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                transform: scale(${zoom});
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                /* 核心防御：防止背景外溢 */
                background: transparent !important;
            }
            ${getScopedCss(style.css)}
          `}} />

          <div className="w-full flex-1 relative min-h-[400px]">
             <div id={`stage-${containerId}`}>
                <div id={`component-root-${containerId}`} dangerouslySetInnerHTML={{ __html: style.html }} />
             </div>
          </div>
          
          <div className="w-full px-6 pb-6 mt-auto pointer-events-none">
            <div className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl pointer-events-auto">
              <div className="flex items-center gap-2 mb-3">
                 <div className={`w-1 h-1 rounded-full ${isVisionRequest ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'}`} />
                 <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                    {isVisionRequest ? 'Optic Reverse Engineering Report' : 'Technical Architecture Specs'}
                 </h4>
              </div>
              <div className="max-h-[70px] overflow-y-auto custom-scrollbar">
                <p className="text-white/50 text-[10px] leading-relaxed font-medium">
                  {style.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-10">
           <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
          <p className="text-[9px] font-black uppercase tracking-[0.5em]">System Standby</p>
        </div>
      )}
    </div>
  );
};
