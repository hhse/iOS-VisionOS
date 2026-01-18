
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

  // 注册安全补丁，防止 AI 生成的代码调用未定义的全局函数导致 Crash
  useEffect(() => {
    const safeGlobals = ['moveIndicator', 'toggleTab', 'handleHover', 'animate', 'switchState'];
    safeGlobals.forEach(fnName => {
      // @ts-ignore
      if (!window[fnName]) {
        // @ts-ignore
        window[fnName] = () => {
          console.warn(`GlowFlow AI Engine: Attempted to call unhandled global function "${fnName}". 
          Please use pure CSS for interactivity instead of inline JS scripts.`);
        };
      }
    });
  }, []);

  // 当新样式生成时，重置缩放倍率
  useEffect(() => {
    if (style) setZoom(1);
  }, [style]);

  return (
    <div className="relative flex flex-col h-full w-full min-h-[500px] overflow-hidden rounded-3xl bg-[#08080a] border border-white/5 shadow-2xl">
      {/* 顶部元数据与缩放控制 */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-5 pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {activeLanguage === 'swiftui' || activeLanguage === 'objc' ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Native Core Preview</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Interactive Runtime</span>
            </div>
          )}
        </div>
        
        {/* 缩放控制器 */}
        {style && !loading && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl pointer-events-auto shadow-2xl">
            <button 
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
              className="text-white/40 hover:text-white transition-colors"
              title="缩小"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <span className="text-[10px] font-mono font-bold text-white/80 min-w-[3rem] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              className="text-white/40 hover:text-white transition-colors"
              title="放大"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <button 
              onClick={() => setZoom(1)}
              className="text-[9px] font-black uppercase tracking-tighter text-white/30 hover:text-white"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 z-10">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-b-purple-500 rounded-full animate-[spin_1.5s_linear_infinite]" />
          </div>
          <div className="flex flex-col items-center gap-1">
             <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">Reconstructing Geometry...</p>
          </div>
        </div>
      ) : style ? (
        <div className="flex-1 flex flex-col z-10 relative">
          
          <style dangerouslySetInnerHTML={{ __html: `
            #stage-${containerId} {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                min-height: 400px;
                perspective: 2000px;
                background-image: 
                  radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
                background-size: 24px 24px;
                overflow: hidden;
                position: relative;
            }
            #canvas-${containerId} {
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform: scale(${zoom});
                transform-origin: center center;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                will-change: transform;
                position: relative;
            }
            ${style.css}
          `}} />

          {/* 渲染舞台 */}
          <div className="w-full flex-1 relative flex items-center justify-center">
             <div id={`stage-${containerId}`}>
                <div id={`canvas-${containerId}`} dangerouslySetInnerHTML={{ __html: style.html }} />
             </div>
             
             {/* 交互提示 */}
             <div className="absolute bottom-6 left-6 pointer-events-none opacity-20">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Canvas Layer: {style.componentType}</span>
             </div>
          </div>
          
          {/* 技术解析面板 */}
          <div className="w-full px-6 pb-6 mt-auto">
            <div className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                 <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Technical Analysis</h4>
                 <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="max-h-[80px] overflow-y-auto custom-scrollbar">
                <p className="text-white/50 text-[10px] leading-relaxed font-mono">
                  {style.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20">
          <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <p className="mt-4 text-[9px] font-black uppercase tracking-[0.4em]">Engine Standby</p>
        </div>
      )}
    </div>
  );
};
