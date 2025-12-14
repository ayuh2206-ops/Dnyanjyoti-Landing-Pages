'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Play, 
  Pause,
  Maximize,
  MessageCircle, 
  Send, 
  ChevronRight, 
  BookOpen, 
  Users, 
  Clock, 
  Award,
  Download,
  ShieldCheck,
  Star,
  Settings,
  X,
  RotateCcw,
  Lock,
  Unlock,
  Upload,
  Link as LinkIcon,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Default Configs ---
const DEFAULT_THEME = {
  primary: '#002244', // Deep Royal Navy
  accent: '#EA580C',  // Burnt Orange
  background: '#F8FAFC' // Slate 50
};

const DEFAULT_SOCIAL = {
  whatsapp: '#',
  telegram: '#'
};

const DEFAULT_VIDEO = {
  type: 'none', // 'url', 'file', 'none'
  src: '',
  title: 'Message from Dr. Vishal Bhedurkar'
};

// --- Custom Video Player Component ---
const CustomVideoPlayer = ({ videoSource, theme }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full group bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {!videoSource.src ? (
        // Fallback Placeholder if no video set
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500">
           <Video size={48} className="mb-4 opacity-50" />
           <p>No Video Configured</p>
        </div>
      ) : (
        <video 
          ref={videoRef}
          src={videoSource.src}
          className="w-full h-full object-cover"
          onClick={togglePlay}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Overlay Controls */}
      <AnimatePresence>
        {showControls && videoSource.src && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6 transition-colors duration-300"
          >
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button 
                onClick={togglePlay}
                className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform shadow-xl"
              >
                {isPlaying ? (
                  <Pause className="text-white fill-white" size={32} />
                ) : (
                  <Play className="text-white fill-white ml-2" size={32} />
                )}
              </button>
            </div>

            {/* Bottom Bar */}
            <div className="mt-auto flex justify-between items-end z-20 pointer-events-none">
              <div className="pointer-events-auto">
                 <span className="inline-block px-2 py-1 bg-[var(--accent)] text-white text-xs font-bold rounded mb-2 shadow-sm">IMPORTANT</span>
                 <p className="text-white font-bold text-lg drop-shadow-md">{videoSource.title || "Webinar Update"}</p>
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="pointer-events-auto p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Landing Page ---
const LandingPage = ({ onRegister, theme }) => {
  const scrollToForm = () => {
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="min-h-screen font-sans text-slate-900 transition-colors duration-300"
      style={{
        '--primary': theme.primary,
        '--accent': theme.accent,
        '--bg-body': theme.background,
        backgroundColor: 'var(--bg-body)'
      }}
    >
       {/* Global Selection Style override */}
       <style jsx global>{`
        ::selection {
          background-color: var(--accent);
          color: white;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden text-white pt-24 pb-32 px-6 md:px-12 transition-colors duration-300 bg-[var(--primary)]">
        {/* Abstract Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--accent)] rounded-full blur-[100px] opacity-10"></div>
          <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[var(--accent)] bg-opacity-10 text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-8 border border-[var(--accent)] border-opacity-20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
              </span>
              Live Exclusive Webinar
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Conquer the Fear of the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] brightness-125">
                New Descriptive Pattern
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Stop letting syllabus anxiety derail your dream. Master the exact <span className="text-white font-medium">Framework Method</span> used by 350+ Officers to clear the exam in their first attempt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button 
                onClick={scrollToForm}
                className="w-full sm:w-auto px-10 py-5 bg-[var(--accent)] hover:brightness-110 text-white font-bold rounded-xl text-lg transition-all shadow-xl shadow-orange-900/20 hover:shadow-orange-500/20 transform hover:-translate-y-1 flex items-center justify-center gap-2 ring-1 ring-white/10"
              >
                Secure Your Spot Free
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={scrollToForm}
                className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-lg transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
              >
                <Download size={20} className="text-[var(--accent)] group-hover:translate-y-1 transition-transform" />
                Download Syllabus PDF
              </button>
            </div>
            <p className="mt-6 text-sm text-slate-500 font-medium tracking-wide uppercase">
              *Limited to first 40 serious aspirants only
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-24 px-6 bg-white relative z-20 -mt-10 rounded-t-[40px]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">Why This Webinar is Mandatory</h2>
            <div className="w-20 h-1.5 bg-[var(--accent)] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="text-[var(--accent)]" size={32} />,
                title: "Decoding the Pattern",
                desc: "Stop guessing. Understand exactly what the Commission expects in the new descriptive format versus the old objective style."
              },
              {
                icon: <Clock className="text-[var(--accent)]" size={32} />,
                title: "Strategic Time-Blocking",
                desc: "A scientifically backed routine to balance General Studies, Optional subjects, and Answer Writing practice without burnout."
              },
              {
                icon: <Award className="text-[var(--accent)]" size={32} />,
                title: "The Framework Method",
                desc: "Learn the specific 'Skeleton Structure' our toppers use to draft high-scoring answers in under 8 minutes."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-[var(--bg-body)] border border-slate-100 hover:border-[var(--accent)] hover:border-opacity-30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--primary)] mb-3 group-hover:text-[var(--accent)] transition-colors">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AUTHORITY SECTION --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[var(--primary)] rounded-[2.5rem] overflow-hidden shadow-2xl text-white border border-slate-800 transition-colors duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-5/12 bg-slate-900 relative min-h-[450px] group overflow-hidden">
                <img 
                  src="https://www.dnyanjyoti.com/wp-content/uploads/2025/04/MD-Photo.jpg" 
                  alt="Dr. Vishal Bhedurkar" 
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                        <p className="font-serif italic text-blue-100 text-sm">"Success isn't about reading more. It's about thinking clearly."</p>
                    </div>
                </div>
              </div>

              <div className="md:w-7/12 p-8 md:p-14 flex flex-col justify-center">
                <h3 className="text-[var(--accent)] font-bold tracking-widest uppercase text-xs mb-3">Your Mentor</h3>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Dr. Vishal Bhedurkar</h2>
                <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                  Founder & Director of Dnyanjyoti Education. With a heart for students and a mind for strategy, Dr. Vishal has transformed the lives of thousands of aspirants in Pune through precision mentorship.
                </p>
                
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <div>
                    <h4 className="text-4xl font-extrabold text-white">12+</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-wide mt-1">Years Experience</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-extrabold text-white">1000+</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-wide mt-1">Officers Guided</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-extrabold text-white">350+</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-wide mt-1">Final Selections</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-extrabold text-white">4</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-wide mt-1">Centers in Pune</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REGISTRATION FORM --- */}
      <section id="registration-form" className="py-24 px-6 bg-[var(--bg-body)] transition-colors duration-300">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] brightness-110"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--primary)]">Secure Your Seat</h2>
            <p className="text-slate-500 mt-3">Register now to instantly unlock the pre-webinar study material.</p>
          </div>

          <form onSubmit={onRegister} className="space-y-6">
            <input required type="text" name="fullName" placeholder="Full Name" className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[var(--accent)] outline-none" />
            <input required type="email" name="email" placeholder="Email Address" className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[var(--accent)] outline-none" />
            <input required type="tel" name="phone" placeholder="Phone Number" className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[var(--accent)] outline-none" />

            <button type="submit" className="w-full py-5 bg-[var(--primary)] hover:brightness-125 text-white font-bold rounded-xl text-lg shadow-xl shadow-slate-900/20 transition-all transform active:scale-95 flex items-center justify-center gap-3 mt-6">
              Register & Unlock PDF <ChevronRight size={20} />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">By registering, you agree to receive critical updates via WhatsApp.</p>
          </form>
        </div>
      </section>
    </div>
  );
};

// --- Thank You Page ---
const ThankYouPage = ({ theme, videoConfig, socialLinks }) => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center py-12 px-6 transition-colors duration-300"
      style={{
        '--primary': theme.primary,
        '--accent': theme.accent,
        '--bg-body': theme.background,
        backgroundColor: 'var(--bg-body)'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-green-200 shadow-xl">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-3">Registration Successful!</h1>
          <p className="text-slate-600 text-lg">You are one step away from your study material.</p>
        </div>

        {/* Dynamic Video Player */}
        <div className="aspect-video w-full mb-10 rounded-2xl overflow-hidden shadow-2xl">
           <CustomVideoPlayer videoSource={videoConfig} theme={theme} />
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
          
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-8">
            Step 2: Join the Inner Circle to get your Free Material
          </h2>
          
          <div className="space-y-4">
            <a href={socialLinks.whatsapp || "#"} target="_blank" rel="noreferrer" className="block w-full">
              <button className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-lg shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1">
                <MessageCircle size={28} />
                Join WhatsApp Group
              </button>
            </a>
            
            <a href={socialLinks.telegram || "#"} target="_blank" rel="noreferrer" className="block w-full">
              <button className="w-full py-4 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1">
                <Send size={28} />
                Join Telegram Channel
              </button>
            </a>
          </div>
          
          <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                <Download size={14} />
                The PDF download link is pinned in the group description.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Admin Dashboard Component ---
const AdminPanel = ({ 
  currentTheme, onThemeChange, 
  videoConfig, onVideoChange,
  socialLinks, onSocialChange,
  isAdmin, setIsAdmin
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('theme'); // 'theme' | 'content'

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onVideoChange({ ...videoConfig, type: 'file', src: url });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end pointer-events-none">
      {/* Toggle Button */}
      <button 
        onClick={() => {
          if (!isAdmin) setIsAdmin(true); // Simulating Login
          setIsOpen(!isOpen);
        }}
        className={`pointer-events-auto p-3 rounded-full shadow-xl border transition-all mt-4 ${isAdmin ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-orange-600'}`}
        title="Admin Access"
      >
        {isAdmin && isOpen ? <X size={24} /> : (isAdmin ? <Settings size={24} /> : <Lock size={20} />)}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-auto bg-white p-0 rounded-2xl shadow-2xl border border-slate-200 w-80 overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-500" />
                Admin Dashboard
              </h3>
              <button onClick={() => setIsAdmin(false)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <Unlock size={12} /> Logout
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('theme')}
                className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'theme' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Theme
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'content' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Content & Links
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'theme' ? (
                /* --- THEME TAB --- */
                <div className="space-y-5">
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-400 uppercase">Brand Colors</span>
                     <button onClick={() => onThemeChange(DEFAULT_THEME)} className="text-[10px] text-blue-600 flex items-center gap-1 hover:underline"><RotateCcw size={10} /> Reset</button>
                   </div>
                   
                   {['primary', 'accent', 'background'].map((key) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-slate-600 capitalize mb-1">{key}</label>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
                            <input 
                              type="color" 
                              value={currentTheme[key]} 
                              onChange={(e) => onThemeChange({...currentTheme, [key]: e.target.value})}
                              className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                            />
                          </div>
                          <code className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">{currentTheme[key]}</code>
                        </div>
                      </div>
                   ))}
                </div>
              ) : (
                /* --- CONTENT TAB --- */
                <div className="space-y-6">
                   {/* Video Section */}
                   <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
                        <Video size={14} /> Thank You Video
                      </h4>
                      
                      <div className="flex gap-2 mb-3">
                        <button 
                          onClick={() => onVideoChange({...videoConfig, type: 'url'})}
                          className={`flex-1 py-2 text-xs rounded-lg border ${videoConfig.type === 'url' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-100 text-slate-500'}`}
                        >
                          Link URL
                        </button>
                        <button 
                          onClick={() => onVideoChange({...videoConfig, type: 'file'})}
                          className={`flex-1 py-2 text-xs rounded-lg border ${videoConfig.type === 'file' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-100 text-slate-500'}`}
                        >
                          Upload
                        </button>
                      </div>

                      {videoConfig.type === 'url' ? (
                        <div className="relative">
                          <LinkIcon size={14} className="absolute left-3 top-3 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="https://example.com/video.mp4"
                            value={videoConfig.src}
                            onChange={(e) => onVideoChange({...videoConfig, src: e.target.value})}
                            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[var(--primary)] outline-none"
                          />
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative">
                          <input 
                            type="file" 
                            accept="video/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload size={20} className="mx-auto text-slate-400 mb-2" />
                          <p className="text-xs text-slate-500">Click to upload MP4</p>
                        </div>
                      )}
                   </div>

                   {/* Social Links Section */}
                   <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase mb-3 flex items-center gap-2">
                        <Users size={14} /> Group Links
                      </h4>
                      <div className="space-y-3">
                        <div className="relative">
                           <MessageCircle size={14} className="absolute left-3 top-3 text-green-600" />
                           <input 
                             type="text" 
                             placeholder="WhatsApp Group Link"
                             value={socialLinks.whatsapp}
                             onChange={(e) => onSocialChange({...socialLinks, whatsapp: e.target.value})}
                             className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-green-500 outline-none"
                           />
                        </div>
                        <div className="relative">
                           <Send size={14} className="absolute left-3 top-3 text-blue-500" />
                           <input 
                             type="text" 
                             placeholder="Telegram Channel Link"
                             value={socialLinks.telegram}
                             onChange={(e) => onSocialChange({...socialLinks, telegram: e.target.value})}
                             className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                           />
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // App State
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [videoConfig, setVideoConfig] = useState(DEFAULT_VIDEO);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL);

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Logic Requirement: Sanitize Inputs
    const cleanData = {
        name: data.fullName.toString().trim(),
        email: data.email.toString().trim(),
        phone: data.phone.toString().trim()
    };

    console.log("Lead Captured (Sanitized):", cleanData);
    
    setTimeout(() => {
      setCurrentPage('thankyou');
      window.scrollTo(0,0);
    }, 800);
  };

  return (
    <>
      <AdminPanel 
        currentTheme={theme} 
        onThemeChange={setTheme}
        videoConfig={videoConfig}
        onVideoChange={setVideoConfig}
        socialLinks={socialLinks}
        onSocialChange={setSocialLinks}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
      
      <AnimatePresence mode="wait">
        {currentPage === 'landing' ? (
          <motion.div 
            key="landing"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onRegister={handleRegister} theme={theme} />
          </motion.div>
        ) : (
          <motion.div 
            key="thankyou"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ThankYouPage theme={theme} videoConfig={videoConfig} socialLinks={socialLinks} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}