import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { LanguageProvider } from './context/LanguageContext';
import { PhoneSimulator } from './components/PhoneSimulator';
import { ExportExpoModal } from './components/ExportExpoModal';

export default function App() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <MarketplaceProvider>
          <PhoneSimulator onOpenExport={() => setIsExportOpen(true)} />
          <ExportExpoModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
        </MarketplaceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
