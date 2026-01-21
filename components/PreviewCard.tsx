
import React, { useId, useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (style && style.js && containerRef.current) {
      // 在渲染完成后稍作延迟，确保 DOM 已挂载
      const timer = setTimeout(() => {
        try {
          // 清除旧的 script（如果存在）
          const oldScript = document.getElementById(`script-${containerId}`);
          if (oldScript) oldScript.remove();

          // 创建新的脚本并执行
          const script = document.createElement('script');
          script.id = `script-${containerId}`;
          // 包装 JS 代码以确保它只作用于当前容器
          script.textContent = `
            (function() {
              const root = document.querySelector('#component-root-${containerId}');
              if (root) {
                ${style.js}
              }
            })();
          `;
          document.body.appendChild(script);
        } catch (e) {
          console.error("Script execution error:", e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [style, containerId]);

  // 处理 CSS 作用域
  const getScopedCss = (css: string) => {
    if (!css) return '';
    return css.replace(/#component-root/g, `#component-root-${containerId}`);
  };

  return (
    <div className="relative flex flex-col h-full w-full min-h-[500px] overflow-hidden rounded-3xl bg-[#08080a] border border-white/5 shadow-2xl transition-all duration-500">
      
      {loading && isVisionRequest && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="scanner-line" style={{ 
            position: 'absolute', width: '100%', height: '2px', 
            background: 'rgba(59, 130, 246, 0.5)', 
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)',
            animation: 'scan 2s linear infinite'
          }} />
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-5 pointer-events-none">
        <div className="pointer-events-auto">
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border backdrop-blur-md ${isVisionRequest ? 'bg-blue-500/10 border-blue-500/20' : 'bg-purple-500/10 border-purple-500/20'}`}>
            <span className={`text-[9px] font-black uppercase tracking-widest ${isVisionRequest ? 'text-blue-400' : 'text-purple-400'}`}>
                {isVisionRequest ? 'Interactive Optic Preview' : 'Kinetic Synthesis Preview'}
            </span>
          </div>
        </div>
        
        {style && !loading && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl pointer-events-auto shadow-2xl">
            <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="text-white/40 hover:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" strokeWidth={2} /></svg></button>
            <span className="text-[10px] font-mono font-bold text-white/80 min-w-[2.5rem] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="text-white/40 hover:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} /></svg></button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <div className={`w-12 h-12 border-2 rounded-full animate-spin ${isVisionRequest ? 'border-blue-500/20 border-t-blue-500' : 'border-purple-500/20 border-t-purple-500'}`} />
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black italic">Injecting Kinetic Logic...</p>
        </div>
      ) : style ? (
        <div className="flex-1 flex flex-col z-10 relative overflow-hidden" ref={containerRef}>
          <style dangerouslySetInnerHTML={{ __html: `
            #stage-${containerId} {
                position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
                background-image: radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px);
                background-size: 32px 32px; overflow: hidden;
            }
            #component-root-${containerId} {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                transform: scale(${zoom});
                display: flex; align-items: center; justify-content: center;
                background: transparent !important;
            }
            ${getScopedCss(style.css)}
          `}} />

          <div className="w-full flex-1 relative min-h-[400px]">
             <div id={`stage-${containerId}`}>
                <div id={`component-root-${containerId}`} dangerouslySetInnerHTML={{ __html: style.html }} />
             </div>
          </div>
          
          <div className="w-full px-6 pb-6 mt-auto">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
              <p className="text-white/50 text-[10px] leading-relaxed font-medium line-clamp-2 italic">
                {style.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-10">
           <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <p className="text-[9px] font-black uppercase tracking-[0.5em]">Kinetic Engine Standby</p>
        </div>
      )}
    </div>
  );
};
