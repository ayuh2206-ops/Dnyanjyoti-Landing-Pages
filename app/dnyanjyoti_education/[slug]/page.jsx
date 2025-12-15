'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Download, Star, X, Edit3, Plus, Trash2, RotateCcw,
  Sparkles, Zap, Instagram, Send, MessageCircle, Facebook, Link2,
  Eye, EyeOff, Palette, Type, Layout as LayoutIcon
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
  glow: 'shadow-[0_0_30px_-5px_rgba(255,107,0,0.6)]',
};

// Hero Section Component
const HeroBlock = ({ content, theme }) => (
  <section 
    className={`relative overflow-hidden pt-24 pb-32 px-6 ${theme.font}`} 
    style={{ backgroundColor: theme.secondary, color: 'white' }}
  >
    <div className="max-w-5xl mx-auto text-center">
      <div 
        className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full font-bold text-xs mb-8 border" 
        style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, borderColor: theme.primary }}
      >
        <span className="relative flex h-2 w-2">
          <span 
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" 
            style={{ backgroundColor: theme.primary }}
          ></span>
          <span 
            className="relative inline-flex rounded-full h-2 w-2" 
            style={{ backgroundColor: theme.primary }}
          ></span>
        </span>
        {content.tag || 'NEW LAUNCH'}
      </div>
      
      <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
        {content.headline || 'Your Amazing Headline Here'}
      </h1>
      
      <p className="text-lg md:text-2xl text-slate-300 mb-10 leading-relaxed">
        {content.subheadline || 'Write a compelling subtitle that captures attention'}
      </p>
      
      <a href="#form">
        <button 
          className={`px-10 py-5 font-bold text-lg text-white ${theme.radius} transition-all hover:scale-105 ${EFFECTS[content.effect] || ''}`} 
          style={{ backgroundColor: theme.primary }}
        >
          {content.ctaText || 'Get Started'} <ChevronRight className="inline ml-2" size={22} />
        </button>
      </a>
    </div>
  </section>
);

// Benefits Section Component
const BenefitsBlock = ({ content, theme }) => (
  <section className="py-20 px-6" style={{ backgroundColor: theme.bg }}>
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" style={{ color: theme.secondary }}>
        {content.title || 'Why Choose Us?'}
      </h2>
      <p className="text-center text-slate-600 mb-16 text-lg">
        {content.subtitle || 'Here are the key benefits'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(num => (
          <div 
            key={num}
            className={`bg-white p-8 ${theme.radius} shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: `${theme.primary}20` }}
            >
              <Star size={32} style={{ color: theme.primary }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: theme.secondary }}>
              {content[`benefit${num}Title`] || `Benefit ${num}`}
            </h3>
            <p className="text-slate-600">
              {content[`benefit${num}Text`] || 'Describe this benefit in detail'}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Form Section Component
const FormBlock = ({ content, theme, onSubmit }) => (
  <section id="form" className={`py-20 px-6 ${theme.font}`} style={{ backgroundColor: theme.bg }}>
    <div className={`max-w-lg mx-auto bg-white shadow-2xl p-8 ${theme.radius}`}>
      <h2 className="text-3xl font-bold text-center mb-3" style={{ color: theme.secondary }}>
        {content.title || 'Register Now'}
      </h2>
      <p className="text-center text-slate-600 mb-8">
        {content.subtitle || 'Fill the form to get started'}
      </p>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <input 
          required 
          name="name" 
          placeholder="Full Name" 
          className={`w-full px-4 py-3 border border-slate-300 focus:border-2 outline-none ${theme.radius}`}
          style={{ focusBorderColor: theme.primary }}
        />
        <input 
          required 
          name="email" 
          type="email" 
          placeholder="Email Address" 
          className={`w-full px-4 py-3 border border-slate-300 focus:border-2 outline-none ${theme.radius}`}
        />
        <input 
          required 
          name="phone" 
          type="tel" 
          placeholder="Phone Number" 
          className={`w-full px-4 py-3 border border-slate-300 focus:border-2 outline-none ${theme.radius}`}
        />
        <button 
          type="submit" 
          className={`w-full py-4 text-white font-bold ${theme.radius} transition-all hover:scale-105`} 
          style={{ backgroundColor: theme.primary }}
        >
          {content.btnText || 'Submit'} <ChevronRight className="inline ml-2" />
        </button>
      </form>
    </div>
  </section>
);

// Thank You Page Component
const ThankYouPage = ({ thankYou, theme }) => (
  <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: theme.bg }}>
    <div className={`max-w-2xl bg-white p-12 text-center shadow-2xl ${theme.radius}`}>
      <div className="mb-6">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: `${theme.primary}20` }}
        >
          <Star size={40} style={{ color: theme.primary }} />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4" style={{ color: theme.secondary }}>
        {thankYou.title || 'Thank You!'}
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        {thankYou.message || 'We will contact you soon.'}
      </p>
      
      {thankYou.showSocials && (
        <div className="space-y-3 mt-8">
          {thankYou.whatsappLink && (
            <a 
              href={thankYou.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} transition-all hover:scale-105`}
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <MessageCircle size={24} /> Join our WhatsApp
            </a>
          )}
          
          {thankYou.telegramLink && (
            <a 
              href={thankYou.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} transition-all hover:scale-105`}
              style={{ backgroundColor: '#0088cc', color: 'white' }}
            >
              <Send size={24} /> Join our Telegram
            </a>
          )}
          
          {thankYou.instagramLink && (
            <a 
              href={thankYou.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} transition-all hover:scale-105`}
              style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white' }}
            >
              <Instagram size={24} /> Follow on Instagram
            </a>
          )}
          
          {thankYou.facebookLink && (
            <a 
              href={thankYou.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 w-full py-4 font-bold ${theme.radius} transition-all hover:scale-105`}
              style={{ backgroundColor: '#1877F2', color: 'white' }}
            >
              <Facebook size={24} /> Like on Facebook
            </a>
          )}
        </div>
      )}
    </div>
  </div>
);

// Main Page Component
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
      alert('Failed to update page');
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
      alert('Failed to submit form');
    }
  };

  if (viewState === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading page...</p>
        </div>
      </div>
    );
  }

  if (viewState === 'error') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-slate-400">The page "{currentSlug}" does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className={`transition-all duration-300 ${isWorkspaceOpen ? 'mr-[420px]' : ''}`}>
        {viewState === 'live' && pageData && (
          <main style={{ backgroundColor: pageData.theme.bg }}>
            {pageData.sections.map(section => {
              if (section.type === 'hero') {
                return <HeroBlock key={section.id} content={section.content} theme={pageData.theme} />;
              }
              if (section.type === 'benefits') {
                return <BenefitsBlock key={section.id} content={section.content} theme={pageData.theme} />;
              }
              if (section.type === 'form') {
                return <FormBlock key={section.id} content={section.content} theme={pageData.theme} onSubmit={handleLeadSubmit} />;
              }
              return null;
            })}
          </main>
        )}
        
        {viewState === 'thankyou' && pageData && (
          <ThankYouPage thankYou={pageData.thankYou} theme={pageData.theme} />
        )}
      </div>

      {/* Builder Toggle Button */}
      {!isWorkspaceOpen && (
        <button
          onClick={() => setIsWorkspaceOpen(true)}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl z-40 transition-all hover:scale-110"
          title="Open Builder (Ctrl+Shift+X)"
        >
          <Edit3 size={24} />
        </button>
      )}

      <AnimatePresence>
        {isWorkspaceOpen && pageData && (
          <AdminWorkspace 
            page={pageData} 
            onUpdate={handleUpdatePage} 
            onClose={() => setIsWorkspaceOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Admin Workspace Component
const AdminWorkspace = ({ page, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [expandedSection, setExpandedSection] = useState(null);
  
  const updateContent = (sectionId, field, value) => {
    const updatedSections = page.sections.map(s => 
      s.id === sectionId 
        ? { ...s, content: { ...s.content, [field]: value } } 
        : s
    );
    onUpdate({ ...page, sections: updatedSections });
  };

  const updateThankYou = (field, value) => {
    onUpdate({ ...page, thankYou: { ...page.thankYou, [field]: value } });
  };

  const updateTheme = (field, value) => {
    onUpdate({ ...page, theme: { ...page.theme, [field]: value } });
  };

  const addSection = (type) => {
    const newSection = {
      id: `${type}_${Date.now()}`,
      type: type,
      content: type === 'hero' 
        ? { tag: 'NEW', headline: 'New Headline', subheadline: 'Subtitle', ctaText: 'Get Started', effect: 'none' }
        : type === 'benefits'
        ? { title: 'Benefits', subtitle: 'Why choose us', benefit1Title: 'Benefit 1', benefit1Text: 'Description', benefit2Title: 'Benefit 2', benefit2Text: 'Description', benefit3Title: 'Benefit 3', benefit3Text: 'Description' }
        : { title: 'Register', subtitle: 'Fill the form', btnText: 'Submit' }
    };
    onUpdate({ ...page, sections: [...page.sections, newSection] });
  };

  const deleteSection = (sectionId) => {
    if (confirm('Delete this section?')) {
      onUpdate({ ...page, sections: page.sections.filter(s => s.id !== sectionId) });
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 w-[420px] h-full bg-slate-900 text-white z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Edit3 size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Page Builder</h2>
            <p className="text-xs text-slate-400">Press Ctrl+Shift+X to toggle</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {[
          { id: 'content', icon: LayoutIcon, label: 'Content' },
          { id: 'thankyou', icon: Star, label: 'Thank You' },
          { id: 'theme', icon: Palette, label: 'Theme' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`flex-1 py-4 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
              activeTab === tab.id 
                ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-800' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-300">Page Sections</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => addSection('hero')}
                  className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1"
                  title="Add Hero"
                >
                  <Plus size={12} /> Hero
                </button>
                <button
                  onClick={() => addSection('benefits')}
                  className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 rounded flex items-center gap-1"
                  title="Add Benefits"
                >
                  <Plus size={12} /> Benefits
                </button>
                <button
                  onClick={() => addSection('form')}
                  className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-1"
                  title="Add Form"
                >
                  <Plus size={12} /> Form
                </button>
              </div>
            </div>

            {page.sections.map((section, index) => (
              <div key={section.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div 
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-750 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">#{index + 1}</span>
                    <span className="text-xs font-bold uppercase px-2 py-1 rounded" style={{
                      backgroundColor: section.type === 'hero' ? '#1e40af20' : section.type === 'benefits' ? '#16a34a20' : '#7c3aed20',
                      color: section.type === 'hero' ? '#60a5fa' : section.type === 'benefits' ? '#4ade80' : '#a78bfa'
                    }}>
                      {section.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.id);
                      }}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight 
                      size={16} 
                      className={`text-slate-400 transition-transform ${expandedSection === section.id ? 'rotate-90' : ''}`}
                    />
                  </div>
                </div>
                
                {expandedSection === section.id && (
                  <div className="p-4 pt-2 space-y-3 border-t border-slate-700">
                    {Object.entries(section.content).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-xs text-slate-400 uppercase block mb-1 font-semibold">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {key === 'effect' ? (
                          <select
                            value={value}
                            onChange={(e) => updateContent(section.id, key, e.target.value)}
                            className="w-full bg-slate-950 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
                          >
                            <option value="none">None</option>
                            <option value="pulse">Pulse</option>
                            <option value="bounce">Bounce</option>
                            <option value="glow">Glow</option>
                          </select>
                        ) : typeof value === 'string' && value.length > 50 ? (
                          <textarea
                            value={value}
                            onChange={(e) => updateContent(section.id, key, e.target.value)}
                            rows={3}
                            className="w-full bg-slate-950 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateContent(section.id, key, e.target.value)}
                            className="w-full bg-slate-950 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* THANK YOU TAB */}
        {activeTab === 'thankyou' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block font-semibold">Title</label>
              <input
                type="text"
                value={page.thankYou.title || ''}
                onChange={(e) => updateThankYou('title', e.target.value)}
                className="w-full bg-slate-800 text-white p-3 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
                placeholder="Thank You!"
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block font-semibold">Message</label>
              <textarea
                value={page.thankYou.message || ''}
                onChange={(e) => updateThankYou('message', e.target.value)}
                rows={3}
                className="w-full bg-slate-800 text-white p-3 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none resize-none"
                placeholder="We will contact you soon..."
              />
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-orange-400 uppercase">Social Links</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={page.thankYou.showSocials || false}
                    onChange={(e) => updateThankYou('showSocials', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-slate-400">Show Socials</span>
                </label>
              </div>
              
              {page.thankYou.showSocials && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
                      <MessageCircle size={14} style={{ color: '#25D366' }} />
                      WhatsApp Link
                    </label>
                    <input
                      type="url"
                      value={page.thankYou.whatsappLink || ''}
                      onChange={(e) => updateThankYou('whatsappLink', e.target.value)}
                      placeholder="https://wa.me/1234567890"
                      className="w-full bg-slate-800 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
                      <Send size={14} style={{ color: '#0088cc' }} />
                      Telegram Link
                    </label>
                    <input
                      type="url"
                      value={page.thankYou.telegramLink || ''}
                      onChange={(e) => updateThankYou('telegramLink', e.target.value)}
                      placeholder="https://t.me/yourchannel"
                      className="w-full bg-slate-800 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
                      <Instagram size={14} style={{ color: '#E4405F' }} />
                      Instagram Link
                    </label>
                    <input
                      type="url"
                      value={page.thankYou.instagramLink || ''}
                      onChange={(e) => updateThankYou('instagramLink', e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                      className="w-full bg-slate-800 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
                      <Facebook size={14} style={{ color: '#1877F2' }} />
                      Facebook Link
                    </label>
                    <input
                      type="url"
                      value={page.thankYou.facebookLink || ''}
                      onChange={(e) => updateThankYou('facebookLink', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full bg-slate-800 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* THEME TAB */}
        {activeTab === 'theme' && (
          <div className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block font-semibold">Primary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={page.theme.primary}
                  onChange={(e) => updateTheme('primary', e.target.value)}
                  className="w-16 h-12 rounded cursor-pointer border-2 border-slate-600"
                />
                <input
                  type="text"
                  value={page.theme.primary}
                  onChange={(e) => updateTheme('primary', e.target.value)}
                  className="flex-1 bg-slate-800 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none font-mono"
                  placeholder="#FF6B00"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block font-semibold">Secondary Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={page.theme.secondary}
                  onChange={(e) => updateTheme('secondary', e.target.value)}
                  className="w-16 h-12 rounded cursor-pointer border-2 border-slate-600"
                />
                <input
                  type="text"
                  value={page.theme.secondary}
                  onChange={(e) => updateTheme('secondary', e.target.value)}
                  className="flex-1 bg-slate-800 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none font-mono"
                  placeholder="#001124"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase mb-2 block font-semibold">Background Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={page.theme.bg}
                  onChange={(e) => updateTheme('bg', e.target.value)}
                  className="w-16 h-12 rounded cursor-pointer border-2 border-slate-600"
                />
                <input
                  type="text"
                  value={page.theme.bg}
                  onChange={(e) => updateTheme('bg', e.target.value)}
                  className="flex-1 bg-slate-800 text-white p-2 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none font-mono"
                  placeholder="#F8FAFC"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <label className="text-xs text-slate-400 uppercase mb-2 block font-semibold">Border Radius</label>
              <select
                value={page.theme.radius}
                onChange={(e) => updateTheme('radius', e.target.value)}
                className="w-full bg-slate-800 text-white p-3 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
              >
                <option value="rounded-none">Square (No Radius)</option>
                <option value="rounded">Small (4px)</option>
                <option value="rounded-lg">Medium (8px)</option>
                <option value="rounded-xl">Large (12px)</option>
                <option value="rounded-2xl">Extra Large (16px)</option>
                <option value="rounded-3xl">Huge (24px)</option>
                <option value="rounded-full">Pill (Full)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <label className="text-xs text-slate-400 uppercase mb-2 block font-semibold">Font Family</label>
              <select
                value={page.theme.font}
                onChange={(e) => updateTheme('font', e.target.value)}
                className="w-full bg-slate-800 text-white p-3 text-sm rounded border border-slate-600 focus:border-orange-500 outline-none"
              >
                <option value="font-sans">Sans Serif (Modern)</option>
                <option value="font-serif">Serif (Classic)</option>
                <option value="font-mono">Monospace (Tech)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
