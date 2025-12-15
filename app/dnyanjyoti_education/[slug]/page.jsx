'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Download, Star, X, Edit3, Plus, Trash2, RotateCcw,
  Sparkles, Zap, Instagram, Send, MessageCircle, Facebook, Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { 
  collection, doc, getDoc, setDoc, addDoc, onSnapshot, updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const APP_ID = "dnyanjyoti-master";

const EFFECTS = {
  none: '',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  glow: 'shadow-[0_0_30px_-5px_rgba(255,107,0,0.6)] z-10',
};

const THEMES = {
  royal: { primary: '#FF6B00', secondary: '#001124', bg: '#F8FAFC', font: 'font-serif', radius: 'rounded-xl' },
};

const SmartTextParser = ({ text, className }) => {
  if (!text) return null;
  const parts = text.split(/(\[.*?\|.*?\])/g);
  return (
    <div className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^\[(.*?)\|(.*?)\]$/);
        if (match) return <span key={i} style={{ color: match[2], fontWeight: 'bold' }}>{match[1]}</span>;
        return part;
      })}
    </div>
  );
};

const HeroBlock = ({ content, theme }) => (
  <section className={`relative overflow-hidden pt-24 pb-32 px-6 ${theme.font}`} style={{ backgroundColor: theme.secondary, color: 'white' }}>
    <div className="max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full font-bold text-xs mb-8 border" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.primary }}></span></span>{content.tag}
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold mb-8">{content.headline}</h1>
      <p className="text-lg md:text-2xl text-slate-300 mb-10">{content.subheadline}</p>
      <button className={`px-10 py-5 font-bold text-lg text-white ${theme.radius} ${EFFECTS[content.effect] || ''}`} style={{ backgroundColor: theme.primary }}>{content.ctaText} <ChevronRight className="inline" size={22} /></button>
    </div>
  </section>
);

const FormBlock = ({ content, theme, onSubmit }) => (
  <section className={`py-20 px-6 ${theme.font}`}>
    <div className={`max-w-lg mx-auto bg-white shadow-2xl p-8 ${theme.radius}`}>
      <h2 className="text-2xl font-bold text-center mb-6" style={{ color: theme.secondary }}>{content.title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required name="name" placeholder="Full Name" className={`w-full px-4 py-3 border ${theme.radius}`} />
        <input required name="email" type="email" placeholder="Email" className={`w-full px-4 py-3 border ${theme.radius}`} />
        <button type="submit" className={`w-full py-4 text-white font-bold ${theme.radius}`} style={{ backgroundColor: theme.primary }}>{content.btnText}</button>
      </form>
    </div>
  </section>
);

const ThankYouPage = ({ thankYou, theme }) => (
  <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.bg }}>
    <div className={`max-w-2xl bg-white p-12 text-center ${theme.radius}`}>
      <h1 className="text-4xl font-bold mb-4" style={{ color: theme.secondary }}>{thankYou.title}</h1>
      <p className="text-lg mb-8">{thankYou.message}</p>
      {thankYou.showSocials && (
        <div className="space-y-4">
          {thankYou.whatsappLink && (
            <a href={thankYou.whatsappLink} className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius}`} style={{ backgroundColor: '#25D366', color: 'white' }}>
              <MessageCircle size={24} /> WhatsApp
            </a>
          )}
          {thankYou.telegramLink && (
            <a href={thankYou.telegramLink} className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius}`} style={{ backgroundColor: '#0088cc', color: 'white' }}>
              <Send size={24} /> Telegram
            </a>
          )}
          {thankYou.instagramLink && (
            <a href={thankYou.instagramLink} className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius}`} style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)', color: 'white' }}>
              <Instagram size={24} /> Instagram
            </a>
          )}
          {thankYou.facebookLink && (
            <a href={thankYou.facebookLink} className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius}`} style={{ backgroundColor: '#1877F2', color: 'white' }}>
              <Facebook size={24} /> Facebook
            </a>
          )}
        </div>
      )}
    </div>
  </div>
);

export default function Page({ params }) {
  const [user, setUser] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [viewState, setViewState] = useState('loading');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const currentSlug = params.slug || 'mpsc-webinar';

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, setUser);
    signInAnonymously(auth).catch(console.error);
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'x') {
        e.preventDefault();
        setIsWorkspaceOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!user) return;
    const pageRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', currentSlug);
    const unsub = onSnapshot(pageRef, (snap) => {
      if (snap.exists()) {
        setPageData(snap.data());
        setViewState(prev => prev === 'thankyou' ? 'thankyou' : 'live');
      }
    });
    return () => unsub();
  }, [user, currentSlug]);

  const handleUpdatePage = async (newData) => {
    await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', currentSlug), newData);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'leads'), { ...data, source_page: currentSlug, timestamp: serverTimestamp() });
    setViewState('thankyou');
  };

  return (
    <div className="min-h-screen">
      <div className={`transition-all duration-300 ${isWorkspaceOpen ? 'mr-[420px]' : ''}`}>
        {viewState === 'loading' && <div className="h-screen flex items-center justify-center">Loading...</div>}
        {viewState === 'live' && pageData && (
          <main style={{ backgroundColor: pageData.theme.bg }}>
            {pageData.sections.map(section => {
              if (section.type === 'hero') return <HeroBlock key={section.id} content={section.content} theme={pageData.theme} />;
              if (section.type === 'form') return <FormBlock key={section.id} content={section.content} theme={pageData.theme} onSubmit={handleLeadSubmit} />;
              return null;
            })}
          </main>
        )}
        {viewState === 'thankyou' && pageData && <ThankYouPage thankYou={pageData.thankYou} theme={pageData.theme} />}
      </div>
      <AnimatePresence>
        {isWorkspaceOpen && pageData && (
          <AdminWorkspace page={pageData} onUpdate={handleUpdatePage} onClose={() => setIsWorkspaceOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const AdminWorkspace = ({ page, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [expandedSection, setExpandedSection] = useState(null);
  
  const updateContent = (sid, f, v) => onUpdate({ ...page, sections: page.sections.map(s => s.id === sid ? { ...s, content: { ...s.content, [f]: v } } : s) });
  const updateThankYou = (f, v) => onUpdate({ ...page, thankYou: { ...page.thankYou, [f]: v } });
  const updateTheme = (f, v) => onUpdate({ ...page, theme: { ...page.theme, [f]: v } });

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 w-[420px] h-full bg-slate-900 text-white z-50 flex flex-col">
      <div className="flex justify-between p-6 border-b border-slate-700">
        <h2 className="font-bold">Builder</h2>
        <button onClick={onClose}><X/></button>
      </div>
      
      <div className="flex border-b border-slate-700">
        {['content', 'thankyou', 'theme'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-xs font-bold uppercase ${activeTab === tab ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' : 'text-slate-500'}`}>{tab}</button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'content' && (
          <div className="space-y-4">
            {page.sections.map((s) => (
              <div key={s.id} className="bg-slate-800 p-3 rounded">
                <div className="flex justify-between mb-2 cursor-pointer" onClick={() => setExpandedSection(expandedSection === s.id ? null : s.id)}>
                  <span className="text-xs font-bold uppercase">{s.type}</span>
                  <Edit3 size={12}/>
                </div>
                {expandedSection === s.id && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-slate-700">
                    {Object.keys(s.content).filter(k => typeof s.content[k] === 'string').map(k => (
                      <div key={k}>
                        <label className="text-xs text-slate-500 uppercase">{k}</label>
                        <input value={s.content[k]} onChange={e => updateContent(s.id, k, e.target.value)} className="w-full bg-slate-950 p-1 text-xs rounded border border-slate-700" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'thankyou' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 uppercase mb-1 block">Title</label>
              <input value={page.thankYou.title || ''} onChange={e => updateThankYou('title', e.target.value)} className="w-full bg-slate-800 p-2 text-sm rounded"/>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-1 block">Message</label>
              <textarea value={page.thankYou.message || ''} onChange={e => updateThankYou('message', e.target.value)} rows={3} className="w-full bg-slate-800 p-2 text-sm rounded"/>
            </div>
            <div className="pt-3 border-t border-slate-700">
              <h4 className="text-xs font-bold text-blue-400 uppercase mb-3">Social Links</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><MessageCircle size={12}/> WhatsApp</label>
                  <input value={page.thankYou.whatsappLink || ''} onChange={e => updateThankYou('whatsappLink', e.target.value)} placeholder="https://wa.me/..." className="w-full bg-slate-800 p-2 text-sm rounded"/>
                </div>
                <div>
                  <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><Send size={12}/> Telegram</label>
                  <input value={page.thankYou.telegramLink || ''} onChange={e => updateThankYou('telegramLink', e.target.value)} placeholder="https://t.me/..." className="w-full bg-slate-800 p-2 text-sm rounded"/>
                </div>
                <div>
                  <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><Instagram size={12}/> Instagram</label>
                  <input value={page.thankYou.instagramLink || ''} onChange={e => updateThankYou('instagramLink', e.target.value)} placeholder="https://instagram.com/..." className="w-full bg-slate-800 p-2 text-sm rounded"/>
                </div>
                <div>
                  <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><Facebook size={12}/> Facebook</label>
                  <input value={page.thankYou.facebookLink || ''} onChange={e => updateThankYou('facebookLink', e.target.value)} placeholder="https://facebook.com/..." className="w-full bg-slate-800 p-2 text-sm rounded"/>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Primary Color</label>
              <input type="color" value={page.theme.primary} onChange={e => updateTheme('primary', e.target.value)} className="w-full h-10 rounded"/>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Secondary Color</label>
              <input type="color" value={page.theme.secondary} onChange={e => updateTheme('secondary', e.target.value)} className="w-full h-10 rounded"/>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Background</label>
              <input type="color" value={page.theme.bg} onChange={e => updateTheme('bg', e.target.value)} className="w-full h-10 rounded"/>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
