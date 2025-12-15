'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Star, X, Edit3, Plus, Trash2, 
  Instagram, Send, MessageCircle, Facebook,
  ChevronUp, ChevronDown, GripVertical,
  Type, Image as ImageIcon, Award, User, FileText, Mail, Globe, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, doc, addDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const APP_ID = "dnyanjyoti-master";

// Parse Smart Text with [Text|color] syntax and apply VFX per word
const parseSmartText = (text, wordEffect = null, wordEffectConfig = {}) => {
  const regex = /\[([^\]]+)\|([^\]]+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), highlight: false });
    }
    parts.push({ 
      text: match[1], 
      highlight: true, 
      color: match[2],
      effect: wordEffect,
      effectConfig: wordEffectConfig
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }];
};

const getEffectClass = (effect, config = {}) => {
  if (!effect) return '';
  
  const effects = {
    pulse: 'animate-pulse-elegant',
    bounce: 'animate-bounce-elegant',
    glow: 'animate-glow-elegant',
    shake: 'animate-shake-elegant'
  };
  return effects[effect] || '';
};

const getEffectStyle = (effect, config = {}) => {
  if (effect === 'glow') {
    const color = config.glowColor || '#FF6B00';
    const intensity = config.glowIntensity || 0.5;
    return {
      filter: `drop-shadow(0 0 ${intensity * 20}px ${color})`,
      textShadow: `0 0 ${intensity * 10}px ${color}`
    };
  }
  return {};
};

const HeroSection = ({ section, theme }) => {
  const fontSize = section.fontSize || 'default';
  const fontSizeClasses = {
    small: 'text-3xl md:text-5xl',
    default: 'text-4xl md:text-6xl',
    large: 'text-5xl md:text-7xl',
    xlarge: 'text-6xl md:text-8xl'
  };

  return (
    <section 
      className={`relative overflow-hidden pt-24 pb-32 px-6 ${section.effect ? getEffectClass(section.effect, section.effectConfig) : ''}`}
      style={{ 
        backgroundColor: section.bgColor || theme.secondary, 
        color: 'white',
        ...getEffectStyle(section.effect, section.effectConfig)
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full font-bold text-xs mb-8 border" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, borderColor: theme.primary }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.primary }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: theme.primary }}></span>
          </span>
          {section.content.tag || 'NEW'}
        </div>
        <h1 className={`${fontSizeClasses[fontSize]} font-extrabold mb-8`}>{section.content.headline || 'Your Headline'}</h1>
        <p className="text-lg md:text-2xl text-slate-300 mb-10">{section.content.subheadline || 'Subtitle here'}</p>
        <a href="#form">
          <button className={`px-10 py-5 font-bold text-lg text-white ${theme.radius} hover:scale-105 transition-all`} style={{ backgroundColor: theme.primary }}>
            {section.content.ctaText || 'Get Started'} <ChevronRight className="inline ml-2" size={22} />
          </button>
        </a>
      </div>
    </section>
  );
};

const SmartTextSection = ({ section, theme }) => {
  const fontSize = section.fontSize || 'default';
  const fontSizeClasses = {
    small: 'text-base',
    default: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  const titleSizeClasses = {
    small: 'text-2xl md:text-4xl',
    default: 'text-3xl md:text-5xl',
    large: 'text-4xl md:text-6xl',
    xlarge: 'text-5xl md:text-7xl'
  };

  const width = section.width || 'default';
  const widthClasses = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-7xl'
  };

  return (
    <section 
      className={`py-20 px-6 ${section.effect ? getEffectClass(section.effect, section.effectConfig) : ''}`}
      style={{ 
        backgroundColor: section.bgColor || theme.bg,
        ...getEffectStyle(section.effect, section.effectConfig)
      }}
    >
      <div className={`${widthClasses[width]} mx-auto`}>
        <h2 className={`${titleSizeClasses[fontSize]} font-bold text-center mb-6`} style={{ color: theme.secondary }}>
          {section.content.title || 'Smart Text Title'}
        </h2>
        <div className={`${fontSizeClasses[fontSize]} text-slate-700 leading-relaxed space-y-4`}>
          {(section.content.paragraphs || ['Add your text here...']).map((para, i) => (
            <p key={i}>
              {parseSmartText(para, section.wordEffect, section.wordEffectConfig).map((part, idx) => 
                part.highlight ? (
                  <strong 
                    key={idx} 
                    className={part.effect ? getEffectClass(part.effect, part.effectConfig) : ''}
                    style={{ 
                      color: part.color, 
                      fontWeight: 'bold',
                      ...getEffectStyle(part.effect, part.effectConfig)
                    }}
                  >
                    {part.text}
                  </strong>
                ) : (
                  <span key={idx}>{part.text}</span>
                )
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContentSection = ({ section, theme }) => {
  const imagePosition = section.content.imagePosition || 'left';
  const showImage = section.content.showImage !== false;
  const fontSize = section.fontSize || 'default';
  
  const fontSizeClasses = {
    small: 'text-base',
    default: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  const titleSizeClasses = {
    small: 'text-2xl md:text-3xl',
    default: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl',
    xlarge: 'text-5xl md:text-6xl'
  };
  
  return (
    <section 
      className={`py-20 px-6 ${section.effect ? getEffectClass(section.effect, section.effectConfig) : ''}`}
      style={{ 
        backgroundColor: section.bgColor || theme.bg,
        ...getEffectStyle(section.effect, section.effectConfig)
      }}
    >
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center ${imagePosition === 'right' ? 'md:grid-flow-dense' : ''}`}>
        {showImage && (
          <div className={`${theme.radius} overflow-hidden bg-slate-200 aspect-video flex items-center justify-center ${imagePosition === 'right' ? 'md:col-start-2' : ''}`}>
            {section.content.imageUrl ? (
              <img src={section.content.imageUrl} alt={section.content.title || 'Content'} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={64} className="text-slate-400" />
            )}
          </div>
        )}
        <div className={imagePosition === 'right' ? 'md:col-start-1' : ''}>
          <h2 className={`${titleSizeClasses[fontSize]} font-bold mb-6`} style={{ color: theme.secondary }}>
            {section.content.title || 'Content Title'}
          </h2>
          <p className={`${fontSizeClasses[fontSize]} text-slate-700 mb-6`}>
            {section.content.description || 'Add your content description here...'}
          </p>
          <button className={`px-8 py-3 font-bold text-white ${theme.radius}`} style={{ backgroundColor: theme.primary }}>
            {section.content.btnText || 'Learn More'}
          </button>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = ({ section, theme }) => {
  const fontSize = section.fontSize || 'default';
  
  const titleSizeClasses = {
    small: 'text-2xl md:text-4xl',
    default: 'text-3xl md:text-5xl',
    large: 'text-4xl md:text-6xl',
    xlarge: 'text-5xl md:text-7xl'
  };

  return (
    <section 
      className={`py-20 px-6 ${section.effect ? getEffectClass(section.effect, section.effectConfig) : ''}`}
      style={{ 
        backgroundColor: section.bgColor || theme.bg,
        ...getEffectStyle(section.effect, section.effectConfig)
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className={`${titleSizeClasses[fontSize]} font-bold text-center mb-4`} style={{ color: theme.secondary }}>
          {section.content.title || 'Features'}
        </h2>
        <p className="text-center text-slate-600 mb-16 text-lg">{section.content.subtitle || 'What we offer'}</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map(num => (
            <div key={num} className={`bg-white p-8 ${theme.radius} shadow-lg hover:shadow-xl transition-shadow text-center`}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${theme.primary}20` }}>
                <Award size={32} style={{ color: theme.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: theme.secondary }}>
                {section.content[`feature${num}Title`] || `Feature ${num}`}
              </h3>
              <p className="text-slate-600">{section.content[`feature${num}Text`] || 'Description here'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BioSection = ({ section, theme }) => {
  const fontSize = section.fontSize || 'default';
  
  const titleSizeClasses = {
    small: 'text-2xl md:text-3xl',
    default: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl',
    xlarge: 'text-5xl md:text-6xl'
  };

  const textSizeClasses = {
    small: 'text-base',
    default: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  return (
    <section 
      className={`py-20 px-6 ${section.effect ? getEffectClass(section.effect, section.effectConfig) : ''}`}
      style={{ 
        backgroundColor: section.bgColor || theme.bg,
        ...getEffectStyle(section.effect, section.effectConfig)
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-slate-200 flex items-center justify-center overflow-hidden">
          {section.content.imageUrl ? (
            <img src={section.content.imageUrl} alt={section.content.name || 'Bio'} className="w-full h-full object-cover" />
          ) : (
            <User size={64} className="text-slate-400" />
          )}
        </div>
        <h2 className={`${titleSizeClasses[fontSize]} font-bold mb-4`} style={{ color: theme.secondary }}>
          {section.content.name || 'Your Name'}
        </h2>
        <p className="text-xl mb-6" style={{ color: theme.primary }}>{section.content.title || 'Your Title'}</p>
        <p className={`${textSizeClasses[fontSize]} text-slate-700 max-w-2xl mx-auto`}>
          {section.content.bio || 'Write your bio here...'}
        </p>
      </div>
    </section>
  );
};

const FormSection = ({ section, theme, onSubmit }) => {
  const fontSize = section.fontSize || 'default';
  
  const titleSizeClasses = {
    small: 'text-2xl',
    default: 'text-3xl',
    large: 'text-4xl',
    xlarge: 'text-5xl'
  };

  return (
    <section 
      id="form" 
      className={`py-20 px-6 ${section.effect ? getEffectClass(section.effect, section.effectConfig) : ''}`}
      style={{ 
        backgroundColor: section.bgColor || theme.bg,
        ...getEffectStyle(section.effect, section.effectConfig)
      }}
    >
      <div className={`max-w-lg mx-auto bg-white shadow-2xl p-8 ${theme.radius}`}>
        <h2 className={`${titleSizeClasses[fontSize]} font-bold text-center mb-3`} style={{ color: theme.secondary }}>
          {section.content.title || 'Register Now'}
        </h2>
        <p className="text-center text-slate-600 mb-8">{section.content.subtitle || 'Fill the form'}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input required name="name" placeholder="Full Name" className={`w-full px-4 py-3 border border-slate-300 outline-none ${theme.radius}`} />
          <input required name="email" type="email" placeholder="Email" className={`w-full px-4 py-3 border border-slate-300 outline-none ${theme.radius}`} />
          <input required name="phone" type="tel" placeholder="Phone" className={`w-full px-4 py-3 border border-slate-300 outline-none ${theme.radius}`} />
          <button type="submit" className={`w-full py-4 text-white font-bold ${theme.radius} hover:scale-105 transition-all`} style={{ backgroundColor: theme.primary }}>
            {section.content.btnText || 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
};

const RenderSection = ({ section, theme, onSubmit }) => {
  const components = { 
    hero: HeroSection, 
    smarttext: SmartTextSection, 
    content: ContentSection, 
    features: FeaturesSection, 
    bio: BioSection, 
    form: FormSection 
  };
  const Component = components[section.type];
  return Component ? <Component section={section} theme={theme} onSubmit={onSubmit} /> : null;
};

const ThankYouPage = ({ thankYou, theme }) => (
  <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.bg }}>
    <div className={`max-w-2xl bg-white p-12 text-center shadow-2xl ${theme.radius}`}>
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: `${theme.primary}20` }}>
          <Star size={40} style={{ color: theme.primary }} />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-4" style={{ color: theme.secondary }}>{thankYou.title || 'Thank You!'}</h1>
      <p className="text-lg text-slate-600 mb-8">{thankYou.message || 'We will contact you soon.'}</p>
      {thankYou.showSocials && (
        <div className="space-y-3 mt-8">
          {thankYou.whatsappLink && (
            <a href={thankYou.whatsappLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} hover:scale-105 transition-all`} style={{ backgroundColor: '#25D366', color: 'white' }}>
              <MessageCircle size={24} /> Join WhatsApp
            </a>
          )}
          {thankYou.telegramLink && (
            <a href={thankYou.telegramLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} hover:scale-105 transition-all`} style={{ backgroundColor: '#0088cc', color: 'white' }}>
              <Send size={24} /> Join Telegram
            </a>
          )}
          {thankYou.instagramLink && (
            <a href={thankYou.instagramLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} hover:scale-105 transition-all`} style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white' }}>
              <Instagram size={24} /> Follow Instagram
            </a>
          )}
          {thankYou.facebookLink && (
            <a href={thankYou.facebookLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} hover:scale-105 transition-all`} style={{ backgroundColor: '#1877F2', color: 'white' }}>
              <Facebook size={24} /> Like Facebook
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
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
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
      } else {
        setViewState('error');
      }
    });
    return () => unsub();
  }, [user, currentSlug]);

  const handleUpdatePage = async (newData) => {
    try {
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', currentSlug), newData);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'leads'), { 
        ...data, 
        source_page: currentSlug, 
        timestamp: serverTimestamp() 
      });
      setViewState('thankyou');
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  if (viewState === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (viewState === 'error') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-slate-400">"{currentSlug}" does not exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className={`transition-all duration-300 ${isWorkspaceOpen ? 'mr-[420px]' : ''}`}>
        {viewState === 'live' && pageData && (
          <main>
            {pageData.sections.map(section => (
              <RenderSection key={section.id} section={section} theme={pageData.theme} onSubmit={handleLeadSubmit} />
            ))}
          </main>
        )}
        {viewState === 'thankyou' && pageData && <ThankYouPage thankYou={pageData.thankYou} theme={pageData.theme} />}
      </div>

      {!isWorkspaceOpen && (
        <button onClick={() => setIsWorkspaceOpen(true)} className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl z-40 transition-all hover:scale-110">
          <Edit3 size={24} />
        </button>
      )}

      <AnimatePresence>
        {isWorkspaceOpen && pageData && <AdminWorkspace page={pageData} onUpdate={handleUpdatePage} onClose={() => setIsWorkspaceOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

const AdminWorkspace = ({ page, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('sections');
  const [expandedSection, setExpandedSection] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const SECTION_TEMPLATES = {
    hero: { 
      type: 'hero', 
      bgColor: '#001124', 
      effect: null,
      effectConfig: {},
      fontSize: 'default',
      content: { tag: 'NEW', headline: 'Headline', subheadline: 'Subtitle', ctaText: 'Get Started' } 
    },
    smarttext: { 
      type: 'smarttext', 
      bgColor: '#F8FAFC', 
      effect: null,
      effectConfig: {},
      wordEffect: null,
      wordEffectConfig: {},
      fontSize: 'default',
      width: 'default',
      content: { title: 'Smart Text', paragraphs: ['Use [highlighted text|#FF6B00] to add colors!'] } 
    },
    content: { 
      type: 'content', 
      bgColor: '#FFFFFF', 
      effect: null,
      effectConfig: {},
      fontSize: 'default',
      content: { 
        title: 'Content Title', 
        description: 'Description...', 
        btnText: 'Learn More',
        imageUrl: '',
        showImage: true,
        imagePosition: 'left'
      } 
    },
    features: { 
      type: 'features', 
      bgColor: '#F8FAFC', 
      effect: null,
      effectConfig: {},
      fontSize: 'default',
      content: { 
        title: 'Features', 
        subtitle: 'What we offer', 
        feature1Title: 'Feature 1', 
        feature1Text: 'Description', 
        feature2Title: 'Feature 2', 
        feature2Text: 'Description', 
        feature3Title: 'Feature 3', 
        feature3Text: 'Description' 
      } 
    },
    bio: { 
      type: 'bio', 
      bgColor: '#FFFFFF', 
      effect: null,
      effectConfig: {},
      fontSize: 'default',
      content: { name: 'Your Name', title: 'Your Title', bio: 'Bio...', imageUrl: '' } 
    },
    form: { 
      type: 'form', 
      bgColor: '#F8FAFC', 
      effect: null,
      effectConfig: {},
      fontSize: 'default',
      content: { title: 'Register', subtitle: 'Fill form', btnText: 'Submit' } 
    },
  };

  const addSection = (type) => {
    const newSection = { ...SECTION_TEMPLATES[type], id: `${type}_${Date.now()}` };
    onUpdate({ ...page, sections: [...page.sections, newSection] });
    setShowAddMenu(false);
  };

  const deleteSection = (id) => {
    if (confirm('Delete section?')) {
      onUpdate({ ...page, sections: page.sections.filter(s => s.id !== id) });
    }
  };

  const moveSection = (id, direction) => {
    const idx = page.sections.findIndex(s => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === page.sections.length - 1)) return;
    const newSections = [...page.sections];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newSections[idx], newSections[newIdx]] = [newSections[newIdx], newSections[idx]];
    onUpdate({ ...page, sections: newSections });
  };

  const updateSection = (id, field, value) => {
    const updated = page.sections.map(s => s.id === id ? { ...s, [field]: value } : s);
    onUpdate({ ...page, sections: updated });
  };

  const updateSectionContent = (id, field, value) => {
    const updated = page.sections.map(s => s.id === id ? { ...s, content: { ...s.content, [field]: value } } : s);
    onUpdate({ ...page, sections: updated });
  };

  const updateEffectConfig = (id, field, value) => {
    const updated = page.sections.map(s => 
      s.id === id ? { ...s, effectConfig: { ...s.effectConfig, [field]: value } } : s
    );
    onUpdate({ ...page, sections: updated });
  };

  const updateWordEffectConfig = (id, field, value) => {
    const updated = page.sections.map(s => 
      s.id === id ? { ...s, wordEffectConfig: { ...s.wordEffectConfig, [field]: value } } : s
    );
    onUpdate({ ...page, sections: updated });
  };

  const updateThankYou = (field, value) => onUpdate({ ...page, thankYou: { ...page.thankYou, [field]: value } });
  const updateTheme = (field, value) => onUpdate({ ...page, theme: { ...page.theme, [field]: value } });
  const updateSEO = (field, value) => onUpdate({ ...page, seo: { ...page.seo, [field]: value } });

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
      className="fixed top-0 right-0 w-[420px] h-full bg-slate-900 text-white z-50 flex flex-col shadow-2xl overflow-hidden"
    >
      <div className="flex justify-between items-center p-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg"><Edit3 size={20} /></div>
          <div>
            <h2 className="font-bold text-lg">Builder</h2>
            <p className="text-xs text-slate-400">Ctrl+Shift+X</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg"><X size={20} /></button>
      </div>

      <div className="flex border-b border-slate-700 flex-shrink-0">
        {['sections', 'seo', 'thankyou', 'theme'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 py-4 text-xs font-bold uppercase ${activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-800' : 'text-slate-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {activeTab === 'sections' && (
          <>
            <div className="mb-4">
              <button onClick={() => setShowAddMenu(!showAddMenu)} className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold">
                <Plus size={20} /> Add Section
              </button>
              {showAddMenu && (
                <div className="mt-2 bg-slate-800 rounded-lg p-2 space-y-1">
                  {Object.keys(SECTION_TEMPLATES).map(type => (
                    <button 
                      key={type} 
                      onClick={() => addSection(type)} 
                      className="w-full text-left px-3 py-2 hover:bg-slate-700 rounded text-sm capitalize flex items-center gap-2"
                    >
                      {type === 'hero' && <Type size={14} />}
                      {type === 'smarttext' && <FileText size={14} />}
                      {type === 'content' && <ImageIcon size={14} />}
                      {type === 'features' && <Award size={14} />}
                      {type === 'bio' && <User size={14} />}
                      {type === 'form' && <Mail size={14} />}
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {page.sections.map((section, idx) => (
                <div key={section.id} className="bg-slate-800 rounded-lg border border-slate-700">
                  <div 
                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-750" 
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-slate-500" />
                      <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-slate-700">{section.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }} 
                        disabled={idx === 0} 
                        className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }} 
                        disabled={idx === page.sections.length - 1} 
                        className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} 
                        className="p-1 hover:bg-red-500/20 text-red-400 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight size={16} className={`text-slate-400 transition-transform ${expandedSection === section.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {expandedSection === section.id && (
                    <div className="p-4 pt-2 space-y-3 border-t border-slate-700">
                      {/* Background Color */}
                      <div>
                        <label className="text-xs text-slate-400 uppercase block mb-1">Background Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={section.bgColor || '#FFFFFF'} 
                            onChange={(e) => updateSection(section.id, 'bgColor', e.target.value)} 
                            className="w-12 h-10 rounded cursor-pointer" 
                          />
                          <input 
                            type="text" 
                            value={section.bgColor || '#FFFFFF'} 
                            onChange={(e) => updateSection(section.id, 'bgColor', e.target.value)} 
                            className="flex-1 bg-slate-950 p-2 text-xs rounded border border-slate-600 font-mono" 
                          />
                        </div>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="text-xs text-slate-400 uppercase block mb-1">Font Size</label>
                        <select 
                          value={section.fontSize || 'default'} 
                          onChange={(e) => updateSection(section.id, 'fontSize', e.target.value)}
                          className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600"
                        >
                          <option value="small">Small</option>
                          <option value="default">Default</option>
                          <option value="large">Large</option>
                          <option value="xlarge">Extra Large</option>
                        </select>
                      </div>

                      {/* Width (Smart Text only) */}
                      {section.type === 'smarttext' && (
                        <div>
                          <label className="text-xs text-slate-400 uppercase block mb-1">Section Width</label>
                          <select 
                            value={section.width || 'default'} 
                            onChange={(e) => updateSection(section.id, 'width', e.target.value)}
                            className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600"
                          >
                            <option value="narrow">Narrow</option>
                            <option value="default">Default</option>
                            <option value="wide">Wide</option>
                            <option value="full">Full Width</option>
                          </select>
                        </div>
                      )}

                      {/* Section Visual Effect */}
                      <div>
                        <label className="text-xs text-slate-400 uppercase block mb-1 flex items-center gap-2">
                          <Sparkles size={12} />
                          Section Visual Effect
                        </label>
                        <select 
                          value={section.effect || 'none'} 
                          onChange={(e) => updateSection(section.id, 'effect', e.target.value === 'none' ? null : e.target.value)}
                          className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600"
                        >
                          <option value="none">None</option>
                          <option value="pulse">Pulse (Elegant)</option>
                          <option value="bounce">Bounce (Elegant)</option>
                          <option value="glow">Glow (Customizable)</option>
                          <option value="shake">Shake (Refined)</option>
                        </select>
                      </div>

                      {/* Glow Effect Config */}
                      {section.effect === 'glow' && (
                        <div className="bg-slate-950 p-3 rounded space-y-2">
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">Glow Color</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={section.effectConfig?.glowColor || '#FF6B00'} 
                                onChange={(e) => updateEffectConfig(section.id, 'glowColor', e.target.value)} 
                                className="w-10 h-8 rounded cursor-pointer" 
                              />
                              <input 
                                type="text" 
                                value={section.effectConfig?.glowColor || '#FF6B00'} 
                                onChange={(e) => updateEffectConfig(section.id, 'glowColor', e.target.value)} 
                                className="flex-1 bg-slate-900 p-1 text-xs rounded font-mono" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">Intensity: {section.effectConfig?.glowIntensity || 0.5}</label>
                            <input 
                              type="range" 
                              min="0.1" 
                              max="2" 
                              step="0.1" 
                              value={section.effectConfig?.glowIntensity || 0.5} 
                              onChange={(e) => updateEffectConfig(section.id, 'glowIntensity', parseFloat(e.target.value))} 
                              className="w-full" 
                            />
                          </div>
                        </div>
                      )}

                      {/* Word Effect (Smart Text only) */}
                      {section.type === 'smarttext' && (
                        <>
                          <div>
                            <label className="text-xs text-slate-400 uppercase block mb-1 flex items-center gap-2">
                              <Sparkles size={12} />
                              Highlighted Word Effect
                            </label>
                            <select 
                              value={section.wordEffect || 'none'} 
                              onChange={(e) => updateSection(section.id, 'wordEffect', e.target.value === 'none' ? null : e.target.value)}
                              className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600"
                            >
                              <option value="none">None</option>
                              <option value="pulse">Pulse</option>
                              <option value="bounce">Bounce</option>
                              <option value="glow">Glow</option>
                              <option value="shake">Shake</option>
                            </select>
                          </div>

                          {/* Word Glow Config */}
                          {section.wordEffect === 'glow' && (
                            <div className="bg-slate-950 p-3 rounded space-y-2">
                              <div>
                                <label className="text-xs text-slate-400 block mb-1">Word Glow Color</label>
                                <div className="flex gap-2">
                                  <input 
                                    type="color" 
                                    value={section.wordEffectConfig?.glowColor || '#FF6B00'} 
                                    onChange={(e) => updateWordEffectConfig(section.id, 'glowColor', e.target.value)} 
                                    className="w-10 h-8 rounded cursor-pointer" 
                                  />
                                  <input 
                                    type="text" 
                                    value={section.wordEffectConfig?.glowColor || '#FF6B00'} 
                                    onChange={(e) => updateWordEffectConfig(section.id, 'glowColor', e.target.value)} 
                                    className="flex-1 bg-slate-900 p-1 text-xs rounded font-mono" 
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-slate-400 block mb-1">Intensity: {section.wordEffectConfig?.glowIntensity || 0.5}</label>
                                <input 
                                  type="range" 
                                  min="0.1" 
                                  max="2" 
                                  step="0.1" 
                                  value={section.wordEffectConfig?.glowIntensity || 0.5} 
                                  onChange={(e) => updateWordEffectConfig(section.id, 'glowIntensity', parseFloat(e.target.value))} 
                                  className="w-full" 
                                />
                              </div>
                            </div>
                          )}

                          {/* Smart Text Info */}
                          <div className="bg-slate-950 p-3 rounded border border-slate-700">
                            <p className="text-xs text-slate-400 mb-2">💡 Smart Text Tip:</p>
                            <p className="text-xs text-slate-300">Use <code className="bg-slate-800 px-1 py-0.5 rounded">[Text|#color]</code> to highlight!</p>
                            <p className="text-xs text-slate-500 mt-1">Example: Get it [FREE|#00ff00] now!</p>
                          </div>
                        </>
                      )}

                      {/* Image Controls for Content */}
                      {section.type === 'content' && (
                        <>
                          <div>
                            <label className="text-xs text-slate-400 uppercase block mb-1">Image URL</label>
                            <input 
                              type="url"
                              value={section.content.imageUrl || ''} 
                              onChange={(e) => updateSectionContent(section.id, 'imageUrl', e.target.value)} 
                              placeholder="https://example.com/image.jpg"
                              className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600" 
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-sm">
                              <input 
                                type="checkbox" 
                                checked={section.content.showImage !== false} 
                                onChange={(e) => updateSectionContent(section.id, 'showImage', e.target.checked)}
                                className="w-4 h-4"
                              />
                              Show Image
                            </label>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 uppercase block mb-1">Image Position</label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateSectionContent(section.id, 'imagePosition', 'left')}
                                className={`flex-1 py-2 px-3 text-xs rounded font-bold ${section.content.imagePosition === 'left' || !section.content.imagePosition ? 'bg-orange-500 text-white' : 'bg-slate-950 text-slate-400'}`}
                              >
                                Left
                              </button>
                              <button
                                onClick={() => updateSectionContent(section.id, 'imagePosition', 'right')}
                                className={`flex-1 py-2 px-3 text-xs rounded font-bold ${section.content.imagePosition === 'right' ? 'bg-orange-500 text-white' : 'bg-slate-950 text-slate-400'}`}
                              >
                                Right
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Bio Image */}
                      {section.type === 'bio' && (
                        <div>
                          <label className="text-xs text-slate-400 uppercase block mb-1">Profile Image URL</label>
                          <input 
                            type="url"
                            value={section.content.imageUrl || ''} 
                            onChange={(e) => updateSectionContent(section.id, 'imageUrl', e.target.value)} 
                            placeholder="https://example.com/profile.jpg"
                            className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600" 
                          />
                        </div>
                      )}

                      {/* Content Fields */}
                      {Object.entries(section.content).filter(([key]) => 
                        !['imageUrl', 'showImage', 'imagePosition'].includes(key)
                      ).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-xs text-slate-400 uppercase block mb-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}
                          </label>
                          {Array.isArray(value) ? (
                            <textarea 
                              value={value.join('\n')} 
                              onChange={(e) => updateSectionContent(section.id, key, e.target.value.split('\n'))} 
                              rows={3} 
                              className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600 resize-none" 
                            />
                          ) : typeof value === 'string' && value.length > 40 ? (
                            <textarea 
                              value={value} 
                              onChange={(e) => updateSectionContent(section.id, key, e.target.value)} 
                              rows={2} 
                              className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600 resize-none" 
                            />
                          ) : typeof value === 'string' ? (
                            <input 
                              type="text" 
                              value={value} 
                              onChange={(e) => updateSectionContent(section.id, key, e.target.value)} 
                              className="w-full bg-slate-950 p-2 text-sm rounded border border-slate-600" 
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <Globe size={20} />
              <span className="text-sm font-bold">Search Engine Optimization</span>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Meta Title</label>
              <input 
                type="text" 
                value={page.seo?.title || ''} 
                onChange={(e) => updateSEO('title', e.target.value)} 
                placeholder="Your Page Title"
                className="w-full bg-slate-800 p-3 text-sm rounded" 
                maxLength={60}
              />
              <p className="text-xs text-slate-500 mt-1">{(page.seo?.title || '').length}/60 characters</p>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Meta Description</label>
              <textarea 
                value={page.seo?.description || ''} 
                onChange={(e) => updateSEO('description', e.target.value)} 
                rows={3} 
                placeholder="Brief description of your page"
                className="w-full bg-slate-800 p-3 text-sm rounded resize-none" 
                maxLength={160}
              />
              <p className="text-xs text-slate-500 mt-1">{(page.seo?.description || '').length}/160 characters</p>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Keywords</label>
              <input 
                type="text" 
                value={page.seo?.keywords || ''} 
                onChange={(e) => updateSEO('keywords', e.target.value)} 
                placeholder="education, course, learning"
                className="w-full bg-slate-800 p-3 text-sm rounded" 
              />
              <p className="text-xs text-slate-500 mt-1">Comma-separated keywords</p>
            </div>
          </div>
        )}

        {activeTab === 'thankyou' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Title</label>
              <input 
                type="text" 
                value={page.thankYou.title || ''} 
                onChange={(e) => updateThankYou('title', e.target.value)} 
                className="w-full bg-slate-800 p-3 text-sm rounded" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Message</label>
              <textarea 
                value={page.thankYou.message || ''} 
                onChange={(e) => updateThankYou('message', e.target.value)} 
                rows={3} 
                className="w-full bg-slate-800 p-3 text-sm rounded resize-none" 
              />
            </div>
            <div className="pt-4 border-t border-slate-700">
              <label className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  checked={page.thankYou.showSocials || false} 
                  onChange={(e) => updateThankYou('showSocials', e.target.checked)} 
                />
                <span className="text-sm">Show Social Links</span>
              </label>
              {page.thankYou.showSocials && (
                <div className="space-y-3">
                  {[
                    { field: 'whatsappLink', label: 'WhatsApp', icon: MessageCircle },
                    { field: 'telegramLink', label: 'Telegram', icon: Send },
                    { field: 'instagramLink', label: 'Instagram', icon: Instagram },
                    { field: 'facebookLink', label: 'Facebook', icon: Facebook }
                  ].map(({ field, label, icon: Icon }) => (
                    <div key={field}>
                      <label className="text-xs text-slate-400 uppercase block mb-1 flex items-center gap-2">
                        <Icon size={12} />
                        {label}
                      </label>
                      <input 
                        type="url" 
                        value={page.thankYou[field] || ''} 
                        onChange={(e) => updateThankYou(field, e.target.value)} 
                        placeholder={`https://${label.toLowerCase()}.com/...`}
                        className="w-full bg-slate-800 p-2 text-sm rounded" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-4">
            {[
              { field: 'primary', label: 'Primary Color' },
              { field: 'secondary', label: 'Secondary Color' },
              { field: 'bg', label: 'Background Color' }
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="text-xs text-slate-400 uppercase mb-2 block">{label}</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={page.theme[field]} 
                    onChange={(e) => updateTheme(field, e.target.value)} 
                    className="w-12 h-10 rounded cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={page.theme[field]} 
                    onChange={(e) => updateTheme(field, e.target.value)} 
                    className="flex-1 bg-slate-800 p-2 text-sm rounded font-mono" 
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Border Radius</label>
              <select 
                value={page.theme.radius} 
                onChange={(e) => updateTheme('radius', e.target.value)} 
                className="w-full bg-slate-800 p-3 text-sm rounded"
              >
                <option value="rounded-none">Square</option>
                <option value="rounded">Small</option>
                <option value="rounded-lg">Medium</option>
                <option value="rounded-xl">Large</option>
                <option value="rounded-2xl">Extra Large</option>
                <option value="rounded-full">Pill</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block">Font Family</label>
              <select 
                value={page.theme.font || 'font-sans'} 
                onChange={(e) => updateTheme('font', e.target.value)} 
                className="w-full bg-slate-800 p-3 text-sm rounded"
              >
                <option value="font-sans">Sans Serif</option>
                <option value="font-serif">Serif</option>
                <option value="font-mono">Monospace</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
