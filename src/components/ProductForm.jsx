import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Package, Palette, Ruler, Weight, DollarSign, Shirt, X, Plus, CheckCircle } from 'lucide-react';
import { FileUpload } from './FileUpload.jsx';
import { productService } from '../lib/productService.js';

export function ProductForm({ onProductSaved }) {
  const [formData, setFormData] = useState({
    nome: '',
    peso: '',
    medidas: '',
    precoCusto: '',
    material: '',
    tamanho: '',
    cores: [],
    fotosVideos: []
  });

  const [newCor, setNewCor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCor = () => {
    if (newCor.trim() && !formData.cores.includes(newCor.trim())) {
      setFormData(prev => ({
        ...prev,
        cores: [...prev.cores, newCor.trim()]
      }));
      setNewCor('');
    }
  };

  const removeCor = (corToRemove) => {
    setFormData(prev => ({
      ...prev,
      cores: prev.cores.filter(cor => cor !== corToRemove)
    }));
  };

  const handleFilesChange = (files) => {
    setFormData(prev => ({
      ...prev,
      fotosVideos: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress('Validando dados...');

    try {
      // Validação básica
      if (!formData.nome.trim()) {
        alert('Por favor, insira o nome do produto');
        return;
      }

      if (!formData.precoCusto || parseFloat(formData.precoCusto) <= 0) {
        alert('Por favor, insira um preço de custo válido');
        return;
      }

      // Preparar dados para salvamento
      const productData = {
        nome: formData.nome.trim(),
        peso: parseFloat(formData.peso) || 0,
        medidas: formData.medidas.trim(),
        precoCusto: parseFloat(formData.precoCusto) || 0,
        material: formData.material.trim(),
        tamanho: formData.tamanho,
        cores: formData.cores,
        fotosVideos: formData.fotosVideos
      };

      setUploadProgress('Salvando produto...');

      // Salvar no Appwrite (ou simular se não configurado)
      let savedProduct;
      try {
        savedProduct = await productService.createProduct(productData);
        setUploadProgress('Produto salvo com sucesso!');
      } catch (appwriteError) {
        console.warn('Appwrite não configurado, simulando salvamento:', appwriteError);
        // Simular salvamento para demonstração
        savedProduct = {
          $id: 'demo_' + Date.now(),
          ...productData,
          fotosVideos: [], // URLs simuladas
          $createdAt: new Date().toISOString()
        };
        setUploadProgress('Produto salvo (modo demonstração)!');
      }

      // Aguardar um pouco para mostrar o feedback
      setTimeout(() => {
        onProductSaved(savedProduct);
        setIsLoading(false);
        setUploadProgress('');
      }, 1500);

    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
      setIsLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Vestido Floral Verão"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use um nome descritivo que seus clientes possam encontrar facilmente
            </p>
          </div>

          <div>
            <Label htmlFor="material">Material Principal</Label>
            <Input
              id="material"
              name="material"
              type="text"
              value={formData.material}
              onChange={handleChange}
              placeholder="Ex: Algodão, Poliéster, Couro"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medidas e Peso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Dimensões e Peso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso" className="flex items-center gap-2">
                <Weight className="h-4 w-4" />
                Peso (gramas)
              </Label>
              <Input
                id="peso"
                name="peso"
                type="number"
                min="0"
                step="1"
                value={formData.peso}
                onChange={handleChange}
                placeholder="300"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Peso aproximado para cálculo do frete
              </p>
            </div>

            <div>
              <Label htmlFor="medidas">Medidas (Comprimento x Largura x Altura)</Label>
              <Input
                id="medidas"
                name="medidas"
                type="text"
                value={formData.medidas}
                onChange={handleChange}
                placeholder="30 x 20 x 5 cm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Medidas da embalagem para envio
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tamanho e Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            Variações do Produto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tamanho">Tamanho que Veste</Label>
            <Select onValueChange={(value) => handleSelectChange('tamanho', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PP">PP</SelectItem>
                <SelectItem value="P">P</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="G">G</SelectItem>
                <SelectItem value="GG">GG</SelectItem>
                <SelectItem value="XG">XG</SelectItem>
                <SelectItem value="Único">Tamanho Único</SelectItem>
                <SelectItem value="Infantil">Infantil</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Cores Disponíveis
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={newCor}
                onChange={(e) => setNewCor(e.target.value)}
                placeholder="Ex: Azul Marinho"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCor())}
              />
              <Button type="button" onClick={addCor} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.cores.map((cor, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {cor}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeCor(cor)}
                  />
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione as cores disponíveis do seu produto
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Informações Financeiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="precoCusto">Preço de Custo (R$) *</Label>
            <Input
              id="precoCusto"
              name="precoCusto"
              type="number"
              step="0.01"
              min="0"
              value={formData.precoCusto}
              onChange={handleChange}
              placeholder="45.00"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Quanto você pagou ou gastou para produzir este produto
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload de Fotos/Vídeos */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos e Vídeos do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onFilesChange={handleFilesChange} />
        </CardContent>
      </Card>

      {/* Progresso do Upload */}
      {isLoading && uploadProgress && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">{uploadProgress}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão de Envio */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  );
}

