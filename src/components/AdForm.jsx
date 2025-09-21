import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Plus } from 'lucide-react';

export function AdForm({ onAddAd }) {
  const [formData, setFormData] = useState({
    produtoAnuncio: '',
    precoVenda: '',
    precoCusto: '',
    taxaMarketplace: '',
    aliquotaImposto: '',
    frete: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.produtoAnuncio.trim()) {
      alert('Por favor, insira o nome do produto/anúncio');
      return;
    }
    
    if (!formData.precoVenda || parseFloat(formData.precoVenda) <= 0) {
      alert('Por favor, insira um preço de venda válido');
      return;
    }

    onAddAd(formData);
    
    // Limpar formulário
    setFormData({
      produtoAnuncio: '',
      precoVenda: '',
      precoCusto: '',
      taxaMarketplace: '',
      aliquotaImposto: '',
      frete: ''
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Adicionar Novo Anúncio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="produtoAnuncio">Produto / Anúncio *</Label>
              <Input
                id="produtoAnuncio"
                name="produtoAnuncio"
                type="text"
                value={formData.produtoAnuncio}
                onChange={handleChange}
                placeholder="Ex: Camiseta Estampada"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="precoVenda">Preço de Venda (R$) *</Label>
              <Input
                id="precoVenda"
                name="precoVenda"
                type="number"
                step="0.01"
                min="0"
                value={formData.precoVenda}
                onChange={handleChange}
                placeholder="89.90"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="precoCusto">Preço de Custo (R$)</Label>
              <Input
                id="precoCusto"
                name="precoCusto"
                type="number"
                step="0.01"
                min="0"
                value={formData.precoCusto}
                onChange={handleChange}
                placeholder="35.00"
              />
            </div>
            
            <div>
              <Label htmlFor="taxaMarketplace">Taxa do Marketplace</Label>
              <Input
                id="taxaMarketplace"
                name="taxaMarketplace"
                type="number"
                step="0.01"
                min="0"
                value={formData.taxaMarketplace}
                onChange={handleChange}
                placeholder="0.15 (15%) ou 10.50 (R$)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use 0.15 para 15% ou 10.50 para R$ 10,50
              </p>
            </div>
            
            <div>
              <Label htmlFor="aliquotaImposto">Alíquota de Imposto (%)</Label>
              <Input
                id="aliquotaImposto"
                name="aliquotaImposto"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.aliquotaImposto}
                onChange={handleChange}
                placeholder="0.10 (10%)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use 0.10 para 10%
              </p>
            </div>
            
            <div>
              <Label htmlFor="frete">Frete (R$)</Label>
              <Input
                id="frete"
                name="frete"
                type="number"
                step="0.01"
                min="0"
                value={formData.frete}
                onChange={handleChange}
                placeholder="12.50"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Anúncio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

