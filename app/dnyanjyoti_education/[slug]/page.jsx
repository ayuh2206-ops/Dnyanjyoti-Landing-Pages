'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, MessageCircle, Send, ChevronRight, Download, Star, 
  Layout, Eye, X, Edit3, Plus, Trash2, Search, Link as LinkIcon,
  Type as TypeIcon, Square, Circle, MousePointer, AlertTriangle, RotateCcw,
  Palette, Instagram, Facebook, FileText, Lock, Sparkles, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Add missing Firebase imports for Canvas mode
import { initializeApp } from 'firebase/app'; 
import { onAuthStateChanged, signInAnonymously, getAuth } from 'firebase/auth';
import { 
  collection, doc, getDoc, setDoc, addDoc, onSnapshot, updateDoc, 
  serverTimestamp, getFirestore 
} from 'firebase/firestore';

// --- 1. PRODUCTION SETUP (Uncomment this block in VS Code) ---
/*
import { auth, db } from '@/lib/firebase';
*/

// --- 2. CANVAS/IMMERSIVE COMPATIBILITY MODE (Remove this block in VS Code) ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ------------------------------------------------------------------

const APP_ID = typeof __app_id !== 'undefined' ? __app_id : "dnyanjyoti-master";
const CLIENT_HANDLE = "dnyanjyoti_education";

// --- EFFECTS CONFIG ---
const EFFECTS = {
  none: '',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  glow: 'shadow-[0_0_30px_-5px_rgba(255,107,0,0.6)] z-10', // Custom orange glow
  shake: 'animate-pulse', // Simplified for Tailwind default
};

const THEMES = {
  royal: { primary: '#FF6B00', secondary: '#001124', bg: '#F8FAFC', font: 'font-serif', radius: 'rounded-xl' },
  classic_navy: { primary: '#FF6B00', secondary: '#003366', bg: '#FFFFFF', font: 'font-sans', radius: 'rounded-lg' },
  ocean: { primary: '#0EA5E9', secondary: '#0F172A', bg: '#F0F9FF', font: 'font-sans', radius: 'rounded-lg' },
  forest: { primary: '#22C55E', secondary: '#064E3B', bg: '#F0FDF4', font: 'font-sans', radius: 'rounded-2xl' },
  crimson: { primary: '#E11D48', secondary: '#18181B', bg: '#FFF1F2', font: 'font-mono', radius: 'rounded-none' },
  luxury: { primary: '#D4AF37', secondary: '#000000', bg: '#1a1a1a', font: 'font-serif', radius: 'rounded-sm' }
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
    showSocials: true
  },
  sections: [
    { id: 'hero_imported', type: 'hero', content: { tag: 'EXCLUSIVE WEBINAR', headline: 'Conquer the Fear of the New Descriptive Pattern', subheadline: "Learn the exact answer-writing strategy used by 350+ Officers.", ctaText: 'Register Now', ctaSecondary: 'Get Free Study Material', effect: 'glow' } },
    { id: 'smart_text_demo', type: 'smart_text', content: { text: "Get the webinar worth [3999|#ff0000] for [FREE|#00cc00]!", alignment: 'center', fontSize: 'text-3xl' } },
    { id: 'form_imported', type: 'form', content: { title: 'Secure Your Seat', subtitle: 'Register now to unlock free material.', btnText: 'Register & Unlock PDF' } }
  ]
};

const NEW_PAGE_TEMPLATE = (slug) => ({
  id: slug, status: 'draft', theme: THEMES.royal,
  seo: { title: "New Campaign", description: "", keywords: "" },
  thankYou: { title: "Success!", message: "Check email.", showSocials: true },
  sections: [{ id: `hero_${Date.now()}`, type: 'hero', content: { tag: 'NEW', headline: 'Headline', subheadline: 'Subtitle', ctaText: 'Register' } }]
});

// --- HELPER: SMART TEXT PARSER ---
// Syntax: [Text|Color]
const SmartTextParser = ({ text, className }) => {
  if (!text) return null;
  const parts = text.split(/(\[.*?\|.*?\])/g);
  return (
    <div className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^\[(.*?)\|(.*?)\]$/);
        if (match) {
          return <span key={i} style={{ color: match[2], fontWeight: 'bold' }}>{match[1]}</span>;
        }
        return part;
      })}
    </div>
  );
};

// --- COMPONENT RENDERERS (With Effects) ---

const SmartTextBlock = ({ content, theme }) => (
  <section className={`py-12 px-6 ${theme.font}`} style={{ backgroundColor: content.customBgColor || 'transparent' }}>
    <div className={`max-w-4xl mx-auto ${EFFECTS[content.effect] || ''}`}>
       <SmartTextParser 
         text={content.text} 
         className={`font-bold leading-tight ${content.alignment === 'center' ? 'text-center' : 'text-left'} ${content.fontSize || 'text-2xl'}`} 
       />
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
        {/* Effect applied to Primary Button */}
        <button onClick={() => onAction('scroll-form')} className={`px-10 py-5 font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center gap-3 text-white shadow-lg ${theme.radius} ${EFFECTS[content.effect] || ''}`} style={{ backgroundColor: theme.primary }}>{content.ctaText} <ChevronRight size={22} /></button>
        {content.ctaSecondary && <button className={`px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-lg transition-all flex items-center gap-3 backdrop-blur-sm ${theme.radius}`}><Download size={22} style={{ color: theme.primary }} /> {content.ctaSecondary}</button>}
      </div>
    </div>
  </section>
);

// (FeaturesBlock, CustomContentBlock, BioBlock omitted for brevity but assume they exist and are standard)
// I will include FormBlock as it's a key conversion point often needing effects
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

const CustomContentBlock = ({ content, theme }) => (
    <section className={`py-20 px-6 border-t border-slate-100 ${theme.font}`} style={{ backgroundColor: content.customBgColor || 'white' }}>
      <div className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 ${EFFECTS[content.effect] || ''}`}>
        <div className={`flex-1 ${content.imagePosition === 'right' ? 'order-1' : 'order-2 md:order-1'}`}>
          <h2 className="text-3xl font-bold mb-6" style={{ color: content.customTextColor || theme.secondary }}>{content.title}</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{content.body}</p>
          {content.btnText && <a href={content.btnLink || "#"} className="inline-flex items-center gap-2 font-bold hover:underline" style={{ color: theme.primary }}>{content.btnText} <ChevronRight size={18}/></a>}
        </div>
        {content.imageUrl && (
          <div className={`flex-1 w-full ${content.imagePosition === 'right' ? 'order-2' : 'order-1 md:order-2'}`}>
            <img src={content.imageUrl} alt="Section" className={`w-full shadow-xl ${theme.radius}`} />
          </div>
        )}
      </div>
    </section>
);

const BioBlock = ({ content, theme }) => (
    <section className={`py-20 px-6 bg-slate-50 ${theme.font}`}>
      <div className={`max-w-4xl mx-auto bg-white p-8 shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-8 ${theme.radius} ${EFFECTS[content.effect] || ''}`}>
        <div className={`w-32 h-32 md:w-48 md:h-48 overflow-hidden border-4 flex-shrink-0 ${theme.radius === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`} style={{ borderColor: theme.secondary }}>
           <img src={content.imageUrl || "https://via.placeholder.com/300"} alt="Profile" className="w-full h-full object-cover"/>
        </div>
        <div className="text-center md:text-left">
           <h3 className="text-xl font-bold" style={{ color: theme.secondary }}>{content.name}</h3>
           <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: theme.primary }}>{content.role}</p>
           <p className="text-slate-600 italic">"{content.bio}"</p>
        </div>
      </div>
    </section>
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
              if (section.type === 'content') return <CustomContentBlock key={section.id} content={section.content} theme={pageData.theme} />;
              if (section.type === 'bio') return <BioBlock key={section.id} content={section.content} theme={pageData.theme} />;
              if (section.type === 'form') return <FormBlock key={section.id} content={section.content} theme={pageData.theme} onSubmit={handleLeadSubmit} />;
              return null;
            })}
          </main>
        )}
        {viewState === 'thankyou' && <div className="h-screen flex items-center justify-center"><h1>{pageData.thankYou.title}</h1></div>}
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
  
  // Helpers
  const updateContent = (sid, f, v) => onUpdate({ ...page, sections: page.sections.map(s => s.id === sid ? { ...s, content: { ...s.content, [f]: v } } : s) });
  const updateThankYou = (f, v) => onUpdate({ ...page, thankYou: { ...page.thankYou, [f]: v } });
  const updateTheme = (f, v) => onUpdate({ ...page, theme: { ...page.theme, [f]: v } });
  
  const addBlock = (type) => {
    let content = {};
    if (type === 'hero') content = { tag: 'NEW', headline: 'Header', subheadline: 'Sub', ctaText: 'Action', effect: 'none' };
    if (type === 'smart_text') content = { text: "Highlight [Important|red] text", alignment: 'center', fontSize: 'text-2xl', effect: 'none' };
    if (type === 'form') content = { title: 'Register', btnText: 'Submit', effect: 'none' };
    
    const newBlock = { id: `${type}_${Date.now()}`, type: type, content };
    onUpdate({ ...page, sections: [...page.sections, newBlock] });
    setShowBlockPicker(false);
  };
  const deleteBlock = (id) => { if(confirm("Delete?")) onUpdate({ ...page, sections: page.sections.filter(s => s.id !== id) }); };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 w-[420px] h-full bg-slate-900 text-white z-50 flex flex-col p-6">
      <div className="flex justify-between mb-6"><h2 className="font-bold">Builder</h2><button onClick={onClose}><X/></button></div>
      <div className="flex border-b border-slate-700 overflow-x-auto">
        {['content', 'thankyou', 'theme'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-bold uppercase ${activeTab === tab ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' : 'text-slate-500'}`}>{tab}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-6 relative">
         {activeTab === 'content' && (
            <div className="space-y-4">
               <button onClick={() => setShowBlockPicker(true)} className="w-full py-3 bg-[#FF6B00] text-white rounded font-bold">+ Add Block</button>
               {page.sections.map((s, i) => (
                 <div key={s.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                    <div className="flex justify-between mb-2 cursor-pointer" onClick={() => setExpandedSection(expandedSection === s.id ? null : s.id)}>
                       <span className="text-xs font-bold uppercase flex items-center gap-2">
                         {s.type} 
                         {s.content.effect && s.content.effect !== 'none' && <Sparkles size={10} className="text-yellow-400"/>}
                       </span>
                       <div className="flex gap-2">
                         <Edit3 size={12}/>
                         <button onClick={(e) => { e.stopPropagation(); deleteBlock(s.id); }}><Trash2 size={12} className="text-red-500"/></button>
                       </div>
                    </div>
                    {expandedSection === s.id && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-700">
                        {/* Effect Selector for ALL blocks */}
                        <div>
                           <label className="text-[10px] text-blue-400 uppercase font-bold flex items-center gap-1"><Zap size={10}/> Visual Effect</label>
                           <select value={s.content.effect || 'none'} onChange={(e) => updateContent(s.id, 'effect', e.target.value)} className="w-full bg-slate-950 text-xs border border-slate-600 rounded p-1">
                              <option value="none">None</option>
                              <option value="pulse">Pulse (Subtle)</option>
                              <option value="bounce">Bounce (Attention)</option>
                              <option value="glow">Glow (Highlight)</option>
                              <option value="shake">Shake (Urgent)</option>
                           </select>
                        </div>
                        {/* Fields */}
                        {Object.keys(s.content).map(k => {
                           if(typeof s.content[k] !== 'string' || k === 'effect') return null;
                           return (
                             <div key={k}>
                               <label className="text-[10px] text-slate-500 uppercase">{k}</label>
                               <input value={s.content[k]} onChange={e => updateContent(s.id, k, e.target.value)} className="w-full bg-slate-900 p-1 mb-1 text-xs rounded border border-slate-700" placeholder={k} />
                               {k === 'text' && s.type === 'smart_text' && <p className="text-[9px] text-slate-500">Use [Text|Color] for highlighting. Ex: [Free|red]</p>}
                             </div>
                           )
                        })}
                      </div>
                    )}
                 </div>
               ))}
            </div>
         )}
         {activeTab === 'thankyou' && (
            <div className="space-y-2">
               {['title', 'message', 'whatsappLink'].map(k => (
                  <input key={k} value={page.thankYou[k] || ''} onChange={e => updateThankYou(k, e.target.value)} className="w-full bg-slate-800 p-2 text-sm rounded" placeholder={k}/>
               ))}
            </div>
         )}
         {activeTab === 'theme' && (
            <div className="space-y-4">
               <h3 className="text-xs font-bold uppercase text-slate-500">Colors</h3>
               <input type="color" value={page.theme.primary} onChange={e => updateTheme('primary', e.target.value)} className="w-full h-10"/>
               <button onClick={onReImport} className="w-full py-3 mt-4 bg-red-900/20 text-red-500 text-xs font-bold border border-red-900/50 rounded flex items-center justify-center gap-2"><RotateCcw size={14}/> Reset to Legacy Data</button>
            </div>
         )}
      </div>
      {showBlockPicker && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-50 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-white">Select Block</h3><button onClick={() => setShowBlockPicker(false)}><X size={20}/></button></div>
            <div className="grid grid-cols-1 gap-3 overflow-y-auto">
               {['hero', 'smart_text', 'content', 'features', 'bio', 'form'].map(type => (<button key={type} onClick={() => addBlock(type)} className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-left capitalize font-bold hover:bg-slate-700">{type.replace('_', ' ')}</button>))}
            </div>
          </div>
      )}
    </motion.div>
  );
};