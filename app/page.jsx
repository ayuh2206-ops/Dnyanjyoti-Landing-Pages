'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layout, Plus, Settings, Edit3, Trash2, Copy,
  Users, BarChart3, Lock, LogOut, Globe, ArrowRight, ShieldCheck, Key
} from 'lucide-react';
import { motion } from 'framer-motion';
// Add missing Firebase imports for Canvas mode
import { initializeApp } from 'firebase/app';
import { onAuthStateChanged, signInAnonymously, getAuth } from 'firebase/auth';
import { 
  collection, doc, getDocs, getDoc, setDoc, deleteDoc, getFirestore
} from 'firebase/firestore';

// --- 1. PRODUCTION SETUP (Uncomment this block in VS Code) ---

import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';


// --- 2. CANVAS/IMMERSIVE COMPATIBILITY MODE (Remove this block in VS Code) ---
const useRouter = () => ({ push: (url) => console.log("Navigate to:", url) });
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ------------------------------------------------------------------

const APP_ID = "dnyanjyoti-master";
const CLIENT_HANDLE = "dnyanjyoti_education";

const NEW_PAGE_TEMPLATE = (slug) => ({
  id: slug,
  status: 'draft',
  createdAt: new Date().toISOString(),
  theme: { primary: '#FF6B00', secondary: '#001124', bg: '#F8FAFC', font: 'font-serif', radius: 'rounded-xl' },
  seo: { title: "New Campaign", description: "", keywords: "" },
  thankYou: { title: "Success!", message: "We will contact you soon.", showSocials: true },
  sections: [
    {
      id: `hero_${Date.now()}`,
      type: 'hero',
      content: { tag: 'NEW LAUNCH', headline: 'Your Headline Here', subheadline: 'Write a compelling subtitle.', ctaText: 'Get Started' }
    }
  ]
});

export default function VeroDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadCounts, setLeadCounts] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) signInAnonymously(auth).catch(() => {});
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAdmin || !user) return;
    fetchDashboardData();
  }, [isAdmin, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const pagesRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'pages');
      const snap = await getDocs(pagesRef);
      setPages(snap.docs.map(d => d.data()));

      const leadsRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'leads');
      const leadsSnap = await getDocs(leadsRef);
      const counts = {};
      leadsSnap.forEach(doc => {
        const d = doc.data();
        if(d.source_page) counts[d.source_page] = (counts[d.source_page] || 0) + 1;
      });
      setLeadCounts(counts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    const slugRaw = prompt("Enter URL Slug (e.g. 'talathi-bharti'):");
    if (!slugRaw) return;
    const slug = slugRaw.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (pages.find(p => p.id === slug)) {
      alert("Page already exists!");
      return;
    }
    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', slug), NEW_PAGE_TEMPLATE(slug));
      fetchDashboardData();
      if(confirm("Page created! Go to builder now?")) router.push(`/${CLIENT_HANDLE}/${slug}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClonePage = async (sourcePage) => {
    const newSlugRaw = prompt(`Duplicate "${sourcePage.id}" to new slug (e.g. ${sourcePage.id}-marathi):`);
    if (!newSlugRaw) return;
    const newSlug = newSlugRaw.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (pages.find(p => p.id === newSlug)) {
        alert("A page with this name already exists.");
        return;
    }

    try {
        const newPageData = {
            ...sourcePage,
            id: newSlug,
            createdAt: new Date().toISOString(),
            status: 'draft'
        };
        await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', newSlug), newPageData);
        alert(`Success! Cloned to /${newSlug}`);
        fetchDashboardData();
    } catch (err) {
        alert("Clone failed: " + err.message);
    }
  };

  const handleDeletePage = async (pageId) => {
    if(!confirm(`Delete ${pageId}?`)) return;
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'pages', pageId));
    setPages(prev => prev.filter(p => p.id !== pageId));
  };

  if (!isAdmin) return <LoginScreen onLoginSuccess={() => setIsAdmin(true)} />;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6B00] rounded-lg"><Layout size={24} className="text-white" /></div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Vero Workspace</h1>
              <p className="text-xs text-slate-400 font-mono">{CLIENT_HANDLE}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchDashboardData} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><Settings size={20} /></button>
            <div className="h-8 w-px bg-slate-800"></div>
            <button onClick={() => setIsAdmin(false)} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"><LogOut size={16} /> Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Globe className="text-blue-400" />} label="Active Pages" value={pages.length} sub="Campaigns" />
          <StatCard icon={<Users className="text-green-400" />} label="Total Leads" value={Object.values(leadCounts).reduce((a,b)=>a+b,0)} sub="All time" />
          <StatCard icon={<BarChart3 className="text-[#FF6B00]" />} label="Top Performer" value={getTopPerformer(leadCounts)} sub="Highest leads" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
          <div><h2 className="text-2xl font-bold mb-1">Landing Pages</h2><p className="text-slate-400 text-sm">Manage your campaigns.</p></div>
          <button onClick={handleCreatePage} className="px-6 py-3 bg-[#FF6B00] hover:bg-[#e56000] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all"><Plus size={20} /> Create New Page</button>
        </div>

        {loading ? <div className="text-center py-20 text-slate-500 animate-pulse">Loading...</div> : 
         pages.length === 0 ? <EmptyState onCreate={handleCreatePage} /> :
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map(page => (
              <PageCard key={page.id} page={page} leads={leadCounts[page.id] || 0} onDelete={() => handleDeletePage(page.id)} onClone={() => handleClonePage(page)} clientHandle={CLIENT_HANDLE} />
            ))}
         </div>
        }
      </main>
    </div>
  );
}

const LoginScreen = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const settingsRef = doc(db, 'artifacts', APP_ID, 'settings', 'admin');
        const snap = await getDoc(settingsRef);
        if (!snap.exists() || !snap.data().password) setIsSetupMode(true);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    checkSetup();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const settingsRef = doc(db, 'artifacts', APP_ID, 'settings', 'admin');
      if (isSetupMode) {
        if(pass.length < 6) { setError("Password must be 6+ chars"); return; }
        await setDoc(settingsRef, { password: pass });
        alert("Passkey Saved!");
        setIsSetupMode(false);
        setPass('');
      } else {
        const snap = await getDoc(settingsRef);
        if (pass === snap.data().password) onLoginSuccess();
        else setError("Incorrect Passkey");
      }
    } catch (err) { setError("Connection Error"); }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Checking...</div>;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
        <div className="inline-flex p-4 bg-slate-950 rounded-2xl mb-6 shadow-2xl border border-slate-800">
          {isSetupMode ? <Key size={40} className="text-blue-500" /> : <ShieldCheck size={40} className="text-[#FF6B00]" />}
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">{isSetupMode ? "Setup Security" : "Admin Access"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
            <input autoFocus type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:border-[#FF6B00] outline-none" placeholder={isSetupMode ? "Create Passkey" : "Enter Passkey"} />
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <button className={`w-full py-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 ${isSetupMode ? 'bg-blue-600' : 'bg-[#FF6B00]'}`}>
            {isSetupMode ? "Save & Continue" : "Unlock"} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-5">
    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">{icon}</div>
    <div><p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{label}</p><h3 className="text-3xl font-bold text-white">{value}</h3><p className="text-slate-500 text-xs mt-1">{sub}</p></div>
  </div>
);

const PageCard = ({ page, leads, onDelete, onClone, clientHandle }) => {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-6 pb-4 border-b border-slate-800/50 flex justify-between items-start">
        <div><h3 className="font-bold text-lg text-white mb-1">{page.id}</h3><div className="flex items-center gap-2 text-xs text-slate-500"><span className={`w-2 h-2 rounded-full ${page.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span><span className="capitalize">{page.status || 'Draft'}</span></div></div>
        <div className="flex gap-1">
            <button onClick={onClone} className="text-slate-500 hover:text-blue-400 transition-colors p-2" title="Duplicate"><Copy size={16}/></button>
            <button onClick={onDelete} className="text-slate-500 hover:text-red-500 transition-colors p-2" title="Delete"><Trash2 size={16}/></button>
        </div>
      </div>
      <div className="px-6 py-4 bg-slate-950/30 flex items-center gap-4">
        <div className="flex-1"><p className="text-[10px] text-slate-500 uppercase font-bold">Leads</p><p className="text-xl font-bold text-white">{leads}</p></div>
      </div>
      <div className="mt-auto p-4 border-t border-slate-800 grid grid-cols-2 gap-3">
        <button onClick={() => window.open(`/${clientHandle}/${page.id}`, '_blank')} className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-950 rounded-lg">View Live</button>
        <button onClick={() => router.push(`/${clientHandle}/${page.id}`)} className="flex items-center justify-center gap-2 py-2 text-xs font-bold bg-white text-slate-900 rounded-lg">Builder</button>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ onCreate }) => (
  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
    <h3 className="text-xl font-bold text-white mb-2">No Pages Yet</h3>
    <button onClick={onCreate} className="px-6 py-3 bg-[#FF6B00] text-white font-bold rounded-xl mt-4 inline-flex items-center gap-2"><Plus size={20} /> Create First Page</button>
  </div>
);

function getTopPerformer(counts) {
  let max = 0; let top = "None";
  Object.entries(counts).forEach(([id, count]) => { if(count > max) { max = count; top = id; } });
  return top;
}
