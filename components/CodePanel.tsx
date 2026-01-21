
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
      case 'js': return style.js;
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
    { id: 'js', label: 'JS' },
    { id: 'swiftui', label: 'SWIFT' },
    { id: 'objc', label: 'OBJC' }
  ];

  return (
    <div className="flex flex-col h-full glass rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/5">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="relative flex p-1 bg-black/40 rounded-xl border border-white/5 overflow-x-auto no-scrollbar max-w-[240px]">
          {languages.map(lang => (
            <button 
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`relative z-10 px-3 py-1.5 text-[8px] uppercase font-black tracking-widest transition-all duration-300 ${activeLanguage === lang.id ? 'text-white bg-white/10 rounded-lg shadow-sm' : 'text-white/20 hover:text-white/40'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        <button 
          disabled={!style}
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/70 hover:bg-white/10 transition-all disabled:opacity-30"
        >
          {copied ? 'DONE' : 'COPY'}
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto bg-[#050507] custom-scrollbar">
        {style ? (
          <pre className="fira-code text-[11px] leading-relaxed text-indigo-100/60 whitespace-pre-wrap">
            {getActiveCode()}
          </pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Code Standby</p>
          </div>
        )}
      </div>
    </div>
  );
};
