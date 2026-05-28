import React, { useState } from 'react';
import { RouterContext, AccessibilityProvider, CartProvider } from './context/AppContexts';
import { Navbar } from './views/components/Navbar';
import { ModalFormulario } from './views/components/ModalFormulario';
import { LoginModal } from './views/components/LoginModal';
import { ReadingAssistant } from './views/components/ReadingAssistant';
import { HomePage } from './views/pages/HomePage';
import { TramitesPage } from './views/pages/TramitesPage';
import { SucursalesPage } from './views/pages/SucursalesPage';
import { AyudaPage } from './views/pages/AyudaPage';
import SparkAssistant from './views/components/SparkAssistant';


function PortalContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [globalSearch, setGlobalSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleOpenModal = (type) => setModalOpen(type);
  const handleCloseModal = () => setModalOpen(null);

  return (
    <RouterContext.Provider value={{ currentPage, setPage: setCurrentPage, globalSearch, setGlobalSearch }}>
      <div className="min-h-screen flex flex-col">
        <ReadingAssistant />
        <Navbar onLoginClick={() => setLoginOpen(true)} />
        
        <main className="flex-1 bg-slate-50/50 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl mix-blend-multiply"></div>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet-400/5 rounded-full blur-3xl mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10">
            {currentPage === 'home' && <HomePage onOpenModal={handleOpenModal} />}
            {currentPage === 'tramites' && <TramitesPage onOpenModal={handleOpenModal} />}
            {currentPage === 'sucursales' && <SucursalesPage />}
            {currentPage === 'ayuda' && <AyudaPage />}
          </div>
        </main>

        <SparkAssistant onOpenModal={handleOpenModal} onOpenLogin={() => setLoginOpen(true)} />
        
        {modalOpen && <ModalFormulario type={modalOpen} onClose={handleCloseModal} />}
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSubmit={() => {}} />}

      </div>
    </RouterContext.Provider>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <CartProvider>
        <PortalContent />
      </CartProvider>
    </AccessibilityProvider>
  );
}

export default App;
