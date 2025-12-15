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
const CLIENT_HANDLE = "dnyanjyoti_education";

const EFFECTS = {
  none: '',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  glow: 'shadow-[0_0_30px_-5px_rgba(255,107,0,0.6)] z-10',
  shake: 'animate-pulse',
};

const THEMES = {
  royal: { primary: '#FF6B00', secondary: '#001124', accent: '#FFA500', bg: '#F8FAFC', textPrimary: '#1E293B', textSecondary: '#64748B', font: 'font-serif', radius: 'rounded-xl' },
  classic_navy: { primary: '#FF6B00', secondary: '#003366', accent: '#0066CC', bg: '#FFFFFF', textPrimary: '#1E293B', textSecondary: '#64748B', font: 'font-sans', radius: 'rounded-lg' },
  ocean: { primary: '#0EA5E9', secondary: '#0F172A', accent: '#38BDF8', bg: '#F0F9FF', textPrimary: '#0C4A6E', textSecondary: '#0369A1', font: 'font-sans', radius: 'rounded-lg' },
  forest: { primary: '#22C55E', secondary: '#064E3B', accent: '#4ADE80', bg: '#F0FDF4', textPrimary: '#14532D', textSecondary: '#166534', font: 'font-sans', radius: 'rounded-2xl' },
  crimson: { primary: '#E11D48', secondary: '#18181B', accent: '#F43F5E', bg: '#FFF1F2', textPrimary: '#881337', textSecondary: '#9F1239', font: 'font-mono', radius: 'rounded-none' },
  luxury: { primary: '#D4AF37', secondary: '#000000', accent: '#FFD700', bg: '#1a1a1a', textPrimary: '#FFFFFF', textSecondary: '#D4AF37', font: 'font-serif', radius: 'rounded-sm' }
};

const MPSC_IMPORT_DATA = {
  id: 'mpsc-webinar',
  status: 'published',
  theme: THEMES.classic_navy,
  seo: {
    title: "Conquer MPSC Descriptive Pattern | Dnyanjyoti Education",
    description: "Exclusive webinar by Dr. Vishal Bhedurkar.",
    keywords: "MPSC, Descriptive Pattern, Pune"
  },
  thankYou: {
    title: "Registration Successful!",
    message: "Join the Inner Circle to get your Free Material.",
    whatsappLink: "https://whatsapp.com",
    telegramLink: "https://t.me",
    instagramLink: "https://instagram.com",
    facebookLink: "https://facebook.com",
    customLink: "",
    customLinkText: "Visit Website",
    showSocials: true
  },
  sections: [
    { id: 'hero_imported', type: 'hero', content: { tag: 'EXCLUSIVE WEBINAR', headline: 'Conquer the Fear of the New Descriptive Pattern', subheadline: "Learn the exact answer-writing strategy used by 350+ Officers.", ctaText: 'Register Now', ctaSecondary: 'Get Free Study Material', effect: 'glow' } },
    { id: 'smart_text_demo', type: 'smart_text', content: { text: "Get the webinar worth [3999|#ff0000] for [FREE|#00cc00]!", alignment: 'center', fontSize: 'text-3xl', effect: 'none' } },
    { id: 'form_imported', type: 'form', content: { title: 'Secure Your Seat', subtitle: 'Register now to unlock free material.', btnText: 'Register & Unlock PDF', effect: 'none' } }
  ]
};

// --- HELPER: SMART TEXT PARSER ---
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

// --- COMPONENT RENDERERS ---
const SmartTextBlock = ({ content, theme }) => (
  <section className={`py-12 px-6 ${theme.font}`} style={{ backgroundColor: content.customBgColor || 'transparent' }}>
    <div className={`max-w-4xl mx-auto ${EFFECTS[content.effect] || ''}`}>
       <SmartTextParser text={content.text} className={`font-bold leading-tight ${content.alignment === 'center' ? 'text-center' : 'text-left'} ${content.fontSize || 'text-2xl'}`} />
    </div>
  </section>
);

const HeroBlock = ({ content, theme, onAction }) => (
  <section className={`relative overflow-hidden pt-24 pb-32 px-6 md:px-12 transition-colors duration-500 ${theme.font}`} style={{ backgroundColor: theme.secondary, color: 'white' }}>
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"><div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div></div>
    <div className="max-w-5xl mx-auto text-center relative z-10">
      <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full font-bold text-xs md:text-sm mb-8 border backdrop-blur-md" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, borderColor: `${theme.primary}30` }}>
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.primary }}></span><span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: theme.primary }}></span></span>{content.tag}
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">{content.headline}</h1>
      <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">{content.subheadline}</p>
      <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
        <button onClick={() => onAction('scroll-form')} className={`px-10 py-5 font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center gap-3 text-white shadow-lg ${theme.radius} ${EFFECTS[content.effect] || ''}`} style={{ backgroundColor: theme.primary }}>{content.ctaText} <ChevronRight size={22} /></button>
        {content.ctaSecondary && <button className={`px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-lg transition-all flex items-center gap-3 backdrop-blur-sm ${theme.radius}`}><Download size={22} style={{ color: theme.primary }} /> {content.ctaSecondary}</button>}
      </div>
    </div>
  </section>
);

const FeaturesBlock = ({ content, theme }) => (
    <section className={`py-24 px-6 transition-colors duration-500 ${theme.font}`} style={{ backgroundColor: content.customBgColor || theme.bg || '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-${content.alignment || 'center'} mb-16`}>
          <h2 className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: theme.primary }}>{content.title}</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: content.customTextColor || theme.secondary }}>{content.subtitle}</h3>
          <div className={`w-20 h-1.5 rounded-full ${content.alignment === 'left' ? '' : 'mx-auto'}`} style={{ backgroundColor: content.customTextColor || theme.secondary }}></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(content.items || []).map((item, idx) => (
            <div key={idx} className={`group p-8 bg-white border border-slate-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${theme.radius} ${EFFECTS[content.effect] || ''}`}>
              <div className={`w-14 h-14 flex items-center justify-center mb-6 shadow-lg text-white ${theme.radius}`} style={{ backgroundColor: theme.primary }}><Star size={24}/></div>
              <h3 className="text-xl font-bold mb-3" style={{ color: content.customTextColor || theme.secondary }}>{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
);

const FormBlock = ({ content, theme, onSubmit }) => (
  <section id="registration-form" className={`py-20 px-6 bg-white ${theme.font}`}>
    <div className={`max-w-lg mx-auto bg-white shadow-2xl p-8 border border-slate-100 ${theme.radius} ${EFFECTS[content.effect] || ''}`}>
      <h2 className="text-2xl font-bold text-center mb-6" style={{ color: theme.secondary }}>{content.title}</h2>
      <p className="text-center text-sm text-slate-500 mb-6">{content.subtitle}</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required name="name" placeholder="Full Name" className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 outline-none transition-all ${theme.radius}`} style={{ '--tw-ring-color': theme.primary }} />
        <input required name="phone" placeholder="WhatsApp Number" className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 outline-none transition-all ${theme.radius}`} style={{ '--tw-ring-color': theme.primary }} />
        <input required name="email" type="email" placeholder="Email Address" className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 outline-none transition-all ${theme.radius}`} style={{ '--tw-ring-color': theme.primary }} />
        <button type="submit" className={`w-full py-4 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${theme.radius}`} style={{ backgroundColor: theme.primary }}>{content.btnText} <ChevronRight size={20} /></button>
      </form>
    </div>
  </section>
);

const ThankYouPage = ({ thankYou, theme }) => (
  <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.bg }}>
    <div className={`max-w-2xl w-full bg-white p-12 text-center shadow-2xl ${theme.radius}`}>
      <div className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center ${theme.radius}`} style={{ backgroundColor: theme.primary }}>
        <Star size={40} className="text-white"/>
      </div>
      <h1 className="text-4xl font-bold mb-4" style={{ color: theme.secondary }}>{thankYou.title}</h1>
      <p className="text-lg mb-8" style={{ color: theme.textSecondary }}>{thankYou.message}</p>
      
      {thankYou.showSocials && (
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: theme.primary }}>Connect With Us</p>
          
          {thankYou.whatsappLink && (
            <a href={thankYou.whatsappLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold text-lg transition-all hover:scale-105 ${theme.radius}`} style={{ backgroundColor: '#25D366', color: 'white' }}>
              <MessageCircle size={24} /> Join WhatsApp Community
            </a>
          )}
          
          {thankYou.telegramLink && (
            <a href={thankYou.telegramLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold text-lg transition-all hover:scale-105 ${theme.radius}`} style={{ backgroundColor: '#0088cc', color: 'white' }}>
              <Send size={24} /> Join Telegram Channel
            </a>
          )}
          
          {thankYou.instagramLink && (
            <a href={thankYou.instagramLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold text-lg transition-all hover:scale-105 ${theme.radius}`} style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', color: 'white' }}>
              <Instagram size={24} /> Follow on Instagram
            </a>
          )}
          
          {thankYou.facebookLink && (
            <a href={thankYou.facebookLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold text-lg transition-all hover:scale-105 ${theme.radius}`} style={{ backgroundColor: '#1877F2', color: 'white' }}>
              <Facebook size={24} /> Like on Facebook
            </a>
          )}
          
          {thankYou.customLink && (
            <a href={thankYou.customLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold text-lg transition-all hover:scale-105 border-2 ${theme.radius}`} style={{ borderColor: theme.primary, color: theme.primary }}>
              <Link2 size={24} /> {thankYou.customLinkText || 'Visit Website'}
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
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const currentSlug = params.slug || 'mpsc-webinar';

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, setUser);
    signInAnonymously(auth).catch(console.error);
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        isAdminUnlocked ? setIsWorkspaceOpen(prev => !prev) : setShowLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminUnlocked]);

  useEffect(() => {
    if (!user) return;
    const pageRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', currentSlug);
    const unsub = onSnapshot(pageRef, (snap) => {
      if (snap.exists()) {
        setPageData(snap.data());
        setViewState(prev => prev === 'thankyou' ? 'thankyou' : 'live');
        if(snap.data().seo) document.title = snap.data().seo.title;
      } else {
        if (currentSlug === 'mpsc-webinar') setDoc(pageRef, MPSC_IMPORT_DATA);
        else setViewState('404');
      }
    });
    return () => unsub();
  }, [user, currentSlug]);

  const handleUpdatePage = async (newData) => await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', currentSlug), newData);
  
  const handleReImport = async () => {
    if(confirm("Reset content?")) await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', 'mpsc-webinar'), MPSC_IMPORT_DATA);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'leads'), { ...data, source_page: currentSlug, timestamp: serverTimestamp() });
    setViewState('thankyou');
  };

  const checkPassword = async (pass) => {
    const snap = await getDoc(doc(db, 'artifacts', APP_ID, 'settings', 'admin'));
    if (!snap.exists() || !snap.data().password) { alert("Setup password in dashboard first."); return; }
    if (snap.data().password === pass) { setIsAdminUnlocked(true); setShowLoginModal(false); setIsWorkspaceOpen(true); }
    else alert("Incorrect");
  };

  if (showLoginModal) return <LoginModal onClose={() => setShowLoginModal(false)} onLogin={checkPassword} />;

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans ${pageData?.theme.font}`}>
      <div className={`transition-all duration-300 ${isWorkspaceOpen ? 'mr-[420px]' : ''}`}>
        {viewState === 'loading' && <div className="h-screen flex items-center justify-center">Loading...</div>}
        {viewState === '404' && <div className="h-screen flex items-center justify-center">404 | Page Not Found</div>}
        {viewState === 'live' && pageData && (
          <main style={{ backgroundColor: pageData.theme.bg }}>
            {pageData.sections.map(section => {
              if (section.type === 'hero') return <HeroBlock key={section.id} content={section.content} theme={pageData.theme} onAction={()=>{}} />;
              if (section.type === 'smart_text') return <SmartTextBlock key={section.id} content={section.content} theme={pageData.theme} />;
              if (section.type === 'features') return <FeaturesBlock key={section.id} content={section.content} theme={pageData.theme} />;
              if (section.type === 'form') return <FormBlock key={section.id} content={section.content} theme={pageData.theme} onSubmit={handleLeadSubmit} />;
              return null;
            })}
          </main>
        )}
        {viewState === 'thankyou' && pageData && <ThankYouPage thankYou={pageData.thankYou} theme={pageData.theme} />}
      </div>
      <AnimatePresence>
        {isWorkspaceOpen && isAdminUnlocked && pageData && (
          <AdminWorkspace page={pageData} currentSlug={currentSlug} onUpdate={handleUpdatePage} onClose={() => setIsWorkspaceOpen(false)} onReImport={handleReImport} />
        )}
      </AnimatePresence>
    </div>
  );
}

const LoginModal = ({ onClose, onLogin }) => {
  const [pass, setPass] = useState('');
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-xl max-w-sm w-full">
        <h2 className="font-bold text-xl mb-4">Admin Access</h2>
        <input autoFocus type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Password"/>
        <button onClick={() => onLogin(pass)} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Unlock</button>
      </div>
    </div>
  );
};

const AdminWorkspace = ({ page, onUpdate, onClose, onReImport }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  
  const updateContent = (sid, f, v) => onUpdate({ ...page, sections: page.sections.map(s => s.id === sid ? { ...s, content: { ...s.content, [f]: v } } : s) });
  const updateThankYou = (f, v) => onUpdate({ ...page, thankYou: { ...page.thankYou, [f]: v } });
  const updateTheme = (f, v) => onUpdate({ ...page, theme: { ...page.theme, [f]: v } });
  
  const addBlock = (type) => {
    let content = {};
    if (type === 'hero') content = { tag: 'NEW', headline: 'Your Headline Here', subheadline: 'Compelling subtitle', ctaText: 'Get Started', ctaSecondary: '', effect: 'none' };
    if (type === 'smart_text') content = { text: "Highlight [Important Text|#ff0000] easily", alignment: 'center', fontSize: 'text-2xl', effect: 'none' };
    if (type === 'features') content = { title: 'FEATURES', subtitle: 'Why Choose Us', alignment: 'center', items: [], effect: 'none' };
    if (type === 'form') content = { title: 'Register Now', subtitle: 'Fill the form below', btnText: 'Submit', effect: 'none' };
    
    const newBlock = { id: `${type}_${Date.now()}`, type: type, content };
    onUpdate({ ...page, sections: [...page.sections, newBlock] });
    setShowBlockPicker(false);
  };
  
  const deleteBlock = (id) => { if(confirm("Delete this block?")) onUpdate({ ...page, sections: page.sections.filter(s => s.id !== id) }); };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 w-[420px] h-full bg-slate-900 text-white z-50 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <h2 className="font-bold text-xl">Builder</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg"><X size={20}/></button>
      </div>
      
      <div className="flex border-b border-slate-700">
        {['content', 'thankyou', 'theme'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-xs font-bold uppercase transition-colors ${activeTab === tab ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' : 'text-slate-400 hover:text-white'}`}>{tab}</button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
         {activeTab === 'content' && (
            <div className="space-y-4">
               <button onClick={() => setShowBlockPicker(true)} className="w-full py-3 bg-[#FF6B00] hover:bg-[#e56000] text-white rounded-lg font-bold flex items-center justify-center gap-2">
                 <Plus size={20}/> Add Block
               </button>
               
               {page.sections.map((s) => (
                 <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-750" onClick={() => setExpandedSection(expandedSection === s.id ? null : s.id)}>
                       <span className="text-sm font-bold uppercase flex items-center gap-2">
                         {s.type.replace('_', ' ')} 
                         {s.content.effect && s.content.effect !== 'none' && <Sparkles size={12} className="text-yellow-400"/>}
                       </span>
                       <div className="flex gap-2">
                         <Edit3 size={14} className="text-blue-400"/>
                         <button onClick={(e) => { e.stopPropagation(); deleteBlock(s.id); }}><Trash2 size={14} className="text-red-400"/></button>
                       </div>
                    </div>
                    
                    {expandedSection === s.id && (
                      <div className="p-4 space-y-3 border-t border-slate-700 bg-slate-900">
                        <div>
                           <label className="text-xs text-blue-400 uppercase font-bold flex items-center gap-1 mb-1"><Zap size={12}/> Effect</label>
                           <select value={s.content.effect || 'none'} onChange={(e) => updateContent(s.id, 'effect', e.target.value)} className="w-full bg-slate-950 text-sm border border-slate-600 rounded p-2 text-white">
                              <option value="none">None</option>
                              <option value="pulse">Pulse</option>
                              <option value="bounce">Bounce</option>
                              <option value="glow">Glow</option>
                              <option value="shake">Shake</option>
                           </select>
                        </div>
                        
                        {Object.keys(s.content).filter(k => typeof s.content[k] === 'string' && k !== 'effect').map(k => (
                          <div key={k}>
                            <label className="text-xs text-slate-400 uppercase mb-1 block">{k.replace(/([A-Z])/g, ' $1').trim()}</label>
                            {k === 'text' && s.type === 'smart_text' ? (
                              <textarea value={s.content[k]} onChange={e => updateContent(s.id, k, e.target.value)} rows={3} className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-700 text-white" placeholder={k} />
                            ) : (
                              <input value={s.content[k]} onChange={e => updateContent(s.id, k, e.target.value)} className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-700 text-white" placeholder={k} />
                            )}
                            {k === 'text' && s.type === 'smart_text' && <p className="text-xs text-slate-500 mt-1">Use [Text|#color] - Example: [FREE|#00ff00]</p>}
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               ))}
            </div>
         )}
         
         {activeTab === 'thankyou' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Thank You Page</h3>
              
              <div>
                <label className="text-xs text-slate-400 uppercase mb-1 block">Title</label>
                <input value={page.thankYou.title || ''} onChange={e => updateThankYou('title', e.target.value)} className="w-full bg-slate-800 p-2 text-sm rounded border border-slate-700 text-white"/>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 uppercase mb-1 block">Message</label>
                <textarea value={page.thankYou.message || ''} onChange={e => updateThankYou('message', e.target.value)} rows={3} className="w-full bg-slate-800 p-2 text-sm rounded border border-slate-700 text-white"/>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-xs font-bold text-blue-400 uppercase mb-3">Social Links</h4>
