import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdForm } from './components/AdForm.jsx';
import { AdTable } from './components/AdTable.jsx';
import { KpiCard } from './components/KpiCard.jsx';
import { AddProduct } from './pages/AddProduct.jsx';
import { Clients } from './pages/Clients.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Plus, BarChart3, Users, Package, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
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
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                ← Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Performance de Anúncios
                </h1>
                <p className="text-muted-foreground">
                  Monitore a performance dos seus anúncios em marketplace com cálculos automáticos de lucro e margem.
                </p>
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Portal do Vendedor
          </h1>
          <p className="text-lg text-gray-600">
            Gerencie seus produtos, clientes e analise a performance dos seus anúncios
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Cadastro de Produto */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Etapa 1</CardTitle>
              <p className="text-sm text-gray-600">Cadastro de Produto</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-4">
                Adicione as informações do seu produto: nome, peso, medidas, material, fotos e preço de custo.
              </p>
              <Button 
                onClick={() => window.location.href = '/add-product'}
                className="w-full group-hover:bg-blue-700 transition-colors"
              >
                Adicionar Produto
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Análise de Performance */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Etapa 2</CardTitle>
              <p className="text-sm text-gray-600">Análise de Performance</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-4">
                Calcule o lucro dos seus anúncios considerando taxas, impostos e frete.
              </p>
              <Button 
                onClick={() => window.location.href = '/performance'}
                variant="outline"
                className="w-full group-hover:bg-green-50 transition-colors"
              >
                Analisar Performance
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Portal de Clientes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Clientes</CardTitle>
              <p className="text-sm text-gray-600">Gerenciamento</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-4">
                Organize seus produtos por cliente e gerencie suas lojas de forma eficiente.
              </p>
              <Button 
                onClick={() => window.location.href = '/clients'}
                variant="outline"
                className="w-full group-hover:bg-purple-50 transition-colors"
              >
                Gerenciar Clientes
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Process Flow */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <h3 className="font-semibold mb-1">Cadastre seus Produtos</h3>
                <p className="text-sm text-gray-600">
                  Adicione informações detalhadas dos seus produtos
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <h3 className="font-semibold mb-1">Analise a Performance</h3>
                <p className="text-sm text-gray-600">
                  Calcule lucros e margens dos seus anúncios
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <h3 className="font-semibold mb-1">Organize por Cliente</h3>
                <p className="text-sm text-gray-600">
                  Gerencie produtos de diferentes lojas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2024 Marketplace Ads Tracker. Portal do Vendedor
        </div>
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
        <Route path="/clients" element={<Clients />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

