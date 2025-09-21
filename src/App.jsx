import { useState } from 'react';
import { AdForm } from './components/AdForm.jsx';
import { AdTable } from './components/AdTable.jsx';
import { KpiCard } from './components/KpiCard.jsx';
import { generateId, calculateAdMetrics, calculateSummary, parseFormData } from './lib/utils.ts';
import './App.css';

function App() {
  const [ads, setAds] = useState([]);

  const handleAddAd = (formData) => {
    try {
      const parsedData = parseFormData(formData);
      const newAd = calculateAdMetrics({
        id: generateId(),
        ...parsedData
      });
      
      setAds(prevAds => [...prevAds, newAd]);
    } catch (error) {
      console.error('Erro ao adicionar anúncio:', error);
      alert('Erro ao adicionar anúncio. Verifique os dados inseridos.');
    }
  };

  const handleDeleteAd = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      setAds(prevAds => prevAds.filter(ad => ad.id !== id));
    }
  };

  const summary = calculateSummary(ads);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Marketplace Ads Tracker
          </h1>
          <p className="text-muted-foreground">
            Monitore a performance dos seus anúncios em marketplace com cálculos automáticos de lucro e margem.
          </p>
        </header>

        <div className="space-y-8">
          {/* KPI Cards */}
          <KpiCard summary={summary} />

          {/* Formulário para adicionar anúncios */}
          <AdForm onAddAd={handleAddAd} />

          {/* Tabela de anúncios */}
          <AdTable ads={ads} onDeleteAd={handleDeleteAd} />
        </div>

        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 Marketplace Ads Tracker. Desenvolvido para otimizar sua performance em marketplaces.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

