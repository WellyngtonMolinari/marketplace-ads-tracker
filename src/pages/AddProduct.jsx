import { useState } from 'react';
import { ProductForm } from '../components/ProductForm.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AddProduct() {
  const navigate = useNavigate();

  const handleProductSaved = (product) => {
    // Produto salvo com sucesso
    console.log('Produto salvo:', product);
    // Redirecionar para a página de análise de performance
    navigate('/performance');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Adicionar Novo Produto
          </h1>
          <p className="text-muted-foreground">
            Preencha as informações do seu produto para começar a vender. 
            Todas as informações podem ser editadas posteriormente.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ProductForm onProductSaved={handleProductSaved} />
        </div>

        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 Marketplace Ads Tracker. Portal do Vendedor - Etapa 1: Cadastro de Produto</p>
        </footer>
      </div>
    </div>
  );
}

