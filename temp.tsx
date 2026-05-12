import React, { useState } from 'react';
import { Home, Calendar, ClipboardList, User, Download, LucideIcon } from 'lucide-react';

// --- TYPES ---
interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// --- DATA NAVIGASI ---
const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'rooms', label: 'Rooms', icon: Calendar },
  { id: 'history', label: 'History', icon: ClipboardList },
  { id: 'profile', label: 'Profile', icon: User },
];

// ==========================================
// KOMPONEN HEADER
// ==========================================
const Header: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="custom-header">
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 md:px-6">
        
        {/* Bagian Kiri: Logo & Judul */}
        <div className="flex items-center gap-3">
          {/* Placeholder Logo UNTIRTA */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-400 border-2 border-green-800 flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 bg-green-800 rounded-full"></div>
          </div>
          <h1 className="font-bold text-gray-800 text-base md:text-xl tracking-tight">
            Peminjaman Ruangan
          </h1>
        </div>

        {/* Bagian Kanan: Navbar Website (Desktop) - Disembunyikan di Mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-yellow-500' : ''} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

// ==========================================
// KOMPONEN FOOTER / BOTTOM NAV (Mobile)
// ==========================================
const BottomNav: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="custom-bottom-nav md:hidden">
      <div className="flex justify-between items-center px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center gap-1 min-w-[60px] p-2"
            >
              <Icon 
                size={22} 
                className={`transition-colors duration-200 ${
                  isActive ? 'text-yellow-400 fill-yellow-100' : 'text-gray-400'
                }`} 
              />
              <span 
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// ==========================================
// KOMPONEN KONTEN UTAMA (Sesuai Mockup)
// ==========================================
const MainContent = () => {
  return (
    <main className="flex-1 w-full max-w-md mx-auto md:max-w-3xl p-4 md:p-6 pb-24 md:pb-6 space-y-6">
      
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Gedung UNTIRTA" 
          className="object-cover w-full h-full brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-yellow-400 text-xl md:text-3xl font-extrabold text-center drop-shadow-lg" style={{ WebkitTextStroke: '0.5px black' }}>
            Peminjaman Ruangan<br/>UNTIRTA
          </h2>
        </div>
      </div>

      {/* Card Informasi */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        
        {/* Panduan Peminjaman */}
        <div className="mb-6">
          <h3 className="text-gray-800 font-bold mb-2 pb-2 border-b border-gray-100">
            Panduan Peminjaman
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed mb-4">
            Panduan lengkap dapat dilihat dalam dokumen dibawah ini
          </p>
          <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold py-2.5 px-4 rounded-full transition-colors border border-black shadow-sm w-max">
            <Download size={16} />
            Download Panduan
          </button>
        </div>

        {/* Dokumen Penting */}
        <div>
          <h3 className="text-gray-800 font-bold mb-2 pb-2 border-b border-gray-100">
            Dokumen Penting
          </h3>
          <ol className="list-decimal list-inside text-gray-600 text-xs space-y-2">
            <li>Surat Permohonan</li>
            <li>Proposal Kegiatan (opsional)</li>
          </ol>
        </div>

      </div>
    </main>
  );
};

// ==========================================
// HALAMAN UTAMA (APP)
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans flex flex-col relative">
      
      {/* Header dipanggil di atas */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Konten akan berubah berdasarkan activeTab (Routing simulasi) */}
      {activeTab === 'home' && <MainContent />}
      {activeTab === 'rooms' && <div className="p-8 text-center text-gray-500">Halaman List Ruangan (WIP)</div>}
      {activeTab === 'history' && <div className="p-8 text-center text-gray-500">Halaman Histori (WIP)</div>}
      {activeTab === 'profile' && <div className="p-8 text-center text-gray-500">Halaman Profil (WIP)</div>}

      {/* Bottom Nav dipanggil di bawah (Hanya terlihat di Mobile) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CSS Terpisah (Sesuai instruksi)
        Dalam Next.js ini akan diletakkan di globals.css atau module.css 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-header {
          background-color: #ffffff;
          padding-top: 1rem;
          padding-bottom: 1rem;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .custom-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #ffffff;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
          padding-top: 0.75rem;
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
          z-index: 50;
          box-shadow: 0 -4px 10px -1px rgba(0, 0, 0, 0.05);
        }
      `}} />
    </div>
  );
}