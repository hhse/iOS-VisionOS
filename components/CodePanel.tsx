
import React, { useState } from 'react';
import { GeneratedStyle, CodeLanguage } from '../types';

interface CodePanelProps {
  style: GeneratedStyle | null;
  activeLanguage: CodeLanguage;
  onLanguageChange: (lang: CodeLanguage) => void;
}

export const CodePanel: React.FC<CodePanelProps> = ({ style, activeLanguage, onLanguageChange }) => {
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (!style) return '';
    switch (activeLanguage) {
      case 'html': return style.html;
      case 'css': return style.css;
      case 'swiftui': return style.swiftui;
      case 'objc': return style.objc;
      default: return '';
    }
  };

  const copyToClipboard = () => {
    const text = getActiveCode();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages: { id: CodeLanguage; label: string }[] = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'swiftui', label: 'SwiftUI' },
    { id: 'objc', label: 'Obj-C' }
  ];

  return (
    <div className="flex flex-col h-full glass rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/20">
      {/* 头部：带有滑动背景的 Tab 切换 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="relative flex p-1 bg-black/40 rounded-xl overflow-hidden border border-white/5">
          {/* 滑动背景指示器 */}
          <div 
            className="absolute top-1 bottom-1 bg-white rounded-lg transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-xl"
            style={{
              left: `${languages.findIndex(l => l.id === activeLanguage) * 25}%`,
              width: '25%'
            }}
          />
          {languages.map(lang => (
            <button 
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`relative z-10 w-16 py-1.5 text-[9px] uppercase font-black tracking-widest transition-colors duration-300 ${activeLanguage === lang.id ? 'text-black' : 'text-white/30 hover:text-white/60'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        <button 
          disabled={!style}
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-white/70 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-30 shrink-0 ml-2"
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              COPIED
            </span>
          ) : 'COPY CODE'}
        </button>
      </div>

      {/* 代码显示区 */}
      <div className="flex-1 p-6 overflow-auto bg-[#050507] custom-scrollbar">
        {style ? (
          <pre className="fira-code text-[12px] leading-relaxed text-indigo-100/70 whitespace-pre-wrap">
            {getActiveCode()}
          </pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4 opacity-10 select-none">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">STANDBY MODE</p>
          </div>
        )}
      </div>
    </div>
  );
};
