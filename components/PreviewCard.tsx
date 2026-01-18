
import React, { useId, useState, useEffect } from 'react';
import { GeneratedStyle, CodeLanguage } from '../types';

interface PreviewCardProps {
  style: GeneratedStyle | null;
  loading: boolean;
  activeLanguage: CodeLanguage;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ style, loading, activeLanguage }) => {
  const containerId = useId().replace(/:/g, '');
  const [zoom, setZoom] = useState(1);

  // 注册安全补丁
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

  return (
    <div className="relative flex flex-col h-full w-full min-h-[500px] overflow-hidden rounded-3xl bg-[#08080a] border border-white/5 shadow-2xl">
      {/* 顶部控制面板 */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-5 pointer-events-none">
        <div className="pointer-events-auto">
          {activeLanguage === 'swiftui' || activeLanguage === 'objc' ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Native Core</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Interactive</span>
            </div>
          )}
        </div>
        
        {style && !loading && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl pointer-events-auto shadow-2xl">
            <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <span className="text-[10px] font-mono font-bold text-white/80 min-w-[3rem] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <button onClick={() => setZoom(1)} className="text-[9px] font-black uppercase tracking-tighter text-white/30 hover:text-white ml-1">Reset</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 z-10">
          <div className="w-16 h-16 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">Computing Rendering Topology...</p>
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
                background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
                background-size: 24px 24px;
                overflow: hidden;
            }
            #canvas-${containerId} {
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform: scale(${zoom});
                transform-origin: center center;
                display: flex;
                align-items: center;
                justify-content: center;
                /* 强制注入约束：防止组件撑开物理宽度 */
                max-width: none !important;
                max-height: none !important;
                flex-shrink: 0;
            }
            /* 注入代码时，确保它不会破坏舞台的 Flex 布局 */
            #canvas-${containerId} > * {
                flex-shrink: 0;
            }
            ${style.css}
          `}} />

          {/* 渲染舞台 - 使用绝对定位确保不撑开父级 */}
          <div className="w-full flex-1 relative min-h-[400px]">
             <div id={`stage-${containerId}`}>
                <div id={`canvas-${containerId}`} dangerouslySetInnerHTML={{ __html: style.html }} />
             </div>
          </div>
          
          {/* 技术解析面板 */}
          <div className="w-full px-6 pb-6 mt-auto pointer-events-none">
            <div className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-md pointer-events-auto">
              <div className="flex items-center gap-2 mb-2">
                 <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Geometry Engine Analysis</h4>
              </div>
              <div className="max-h-[60px] overflow-y-auto custom-scrollbar">
                <p className="text-white/50 text-[10px] leading-relaxed font-mono">
                  {style.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20">
          <p className="text-[9px] font-black uppercase tracking-[0.4em]">Engine Standby</p>
        </div>
      )}
    </div>
  );
};
