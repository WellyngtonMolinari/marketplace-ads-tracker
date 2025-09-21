import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Plus, Package } from 'lucide-react';
import { productService } from '../lib/productService.js';

export function ProductSelector({ onProductSelect, selectedProductId, className = "" }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Tentar carregar produtos do Appwrite
      try {
        const productsData = await productService.getProducts();
        setProducts(productsData);
      } catch (appwriteError) {
        console.warn('Appwrite não configurado, usando produtos simulados:', appwriteError);
        
        // Produtos simulados para demonstração
        const mockProducts = [
          {
            $id: 'demo_1',
            nome: 'Camiseta Básica Premium',
            material: '100% Algodão',
            precoCusto: 25.00,
            peso: 150,
            tamanho: 'M',
            cores: ['Branco', 'Preto', 'Azul']
          },
          {
            $id: 'demo_2',
            nome: 'Vestido Floral Verão',
            material: 'Viscose',
            precoCusto: 45.00,
            peso: 300,
            tamanho: 'P',
            cores: ['Floral Rosa', 'Floral Azul']
          },
          {
            $id: 'demo_3',
            nome: 'Calça Jeans Skinny',
            material: 'Denim',
            precoCusto: 65.00,
            peso: 500,
            tamanho: 'G',
            cores: ['Azul Escuro', 'Azul Claro']
          }
        ];
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (productId) => {
    const selectedProduct = products.find(p => p.$id === productId);
    if (selectedProduct && onProductSelect) {
      onProductSelect(selectedProduct);
    }
  };

  const formatProductDisplay = (product) => {
    const cores = product.cores && product.cores.length > 0 
      ? ` • ${product.cores.join(', ')}` 
      : '';
    const material = product.material ? ` • ${product.material}` : '';
    const tamanho = product.tamanho ? ` • Tam. ${product.tamanho}` : '';
    
    return `${product.nome}${material}${tamanho}${cores}`;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Package className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando produtos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-red-600">{error}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadProducts}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Select value={selectedProductId || ""} onValueChange={handleProductChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um produto cadastrado" />
          </SelectTrigger>
          <SelectContent>
            {products.length === 0 ? (
              <SelectItem value="no-products" disabled>
                Nenhum produto cadastrado
              </SelectItem>
            ) : (
              products.map((product) => (
                <SelectItem key={product.$id} value={product.$id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatProductDisplay(product).replace(product.nome, '').trim()}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/add-product'}
          className="flex items-center gap-1 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>
      
      {products.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Nenhum produto encontrado. Cadastre seu primeiro produto para começar.
        </p>
      )}
    </div>
  );
}

