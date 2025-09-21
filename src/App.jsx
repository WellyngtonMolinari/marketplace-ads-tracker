import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdForm } from './components/AdForm.jsx';
import { AdTable } from './components/AdTable.jsx';
import { KpiCard } from './components/KpiCard.jsx';
import { AddProduct } from './pages/AddProduct.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Plus, BarChart3 } from 'lucide-react';
import { generateId, calculateAdMetrics, calculateSummary, parseFormData } from './lib/utils.ts';
import './App.css';

function PerformancePage() {
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Performance de Anúncios
              </h1>
              <p className="text-muted-foreground">
                Monitore a performance dos seus anúncios em marketplace com cálculos automáticos de lucro e margem.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/add-product'}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
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
          <p>© 2024 Marketplace Ads Tracker. Portal do Vendedor - Etapa 2: Análise de Performance</p>
        </footer>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Portal do Vendedor
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie seus produtos e monitore a performance dos seus anúncios em marketplace
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Etapa 1: Adicionar Produto */}
            <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl font-semibold">Cadastrar Produto</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Adicione as informações detalhadas do seu produto: nome, peso, medidas, 
                material, cores, fotos e preço de custo.
              </p>
              <Button 
                onClick={() => window.location.href = '/add-product'}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Novo Produto
              </Button>
            </div>

            {/* Etapa 2: Analisar Performance */}
            <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl font-semibold">Analisar Performance</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Configure os detalhes de venda (preços, taxas, frete) e monitore 
                automaticamente o lucro e margem dos seus anúncios.
              </p>
              <Button 
                onClick={() => window.location.href = '/performance'}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Ver Performance
              </Button>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Como funciona:</h3>
            <div className="space-y-2 text-blue-800">
              <p><strong>1. Cadastre seu produto:</strong> Adicione todas as informações necessárias para venda</p>
              <p><strong>2. Configure a venda:</strong> Defina preços, taxas do marketplace e custos de frete</p>
              <p><strong>3. Monitore resultados:</strong> Acompanhe automaticamente seu lucro e margem de cada anúncio</p>
            </div>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 Marketplace Ads Tracker. Desenvolvido para otimizar sua performance em marketplaces.</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

