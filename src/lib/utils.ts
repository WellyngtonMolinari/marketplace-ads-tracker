import { Ad, AdFormData, AdSummary } from '../types/ad.d.ts';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Converter entrada de porcentagem para decimal
export function parsePercentage(value: string): number {
  if (!value || value === '') return 0;
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;
  
  // Se o valor for maior que 1, assumir que é uma porcentagem (ex: 15 = 15%)
  // Se for menor ou igual a 1, assumir que já está em formato decimal (ex: 0.15 = 15%)
  return numValue > 1 ? numValue / 100 : numValue;
}

// Converter entrada de taxa do marketplace
export function parseMarketplaceFee(value: string, salePrice: number): number {
  if (!value || value === '') return 0;
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;
  
  // Se o valor for maior que 1 e menor ou igual a 100, assumir que é uma porcentagem
  if (numValue > 1 && numValue <= 100) {
    return (numValue / 100) * salePrice;
  }
  
  // Se for menor ou igual a 1, assumir que é uma porcentagem em decimal
  if (numValue <= 1) {
    return numValue * salePrice;
  }
  
  // Caso contrário, assumir que é um valor fixo em reais
  return numValue;
}

export function calculateAdMetrics(ad: Omit<Ad, 'lucroBruto' | 'percentualLucro'>): Ad {
  const { precoVenda, precoCusto, taxaMarketplace, aliquotaImposto, frete } = ad;
  
  // Se taxa do marketplace for < 1, assume que é porcentagem
  const taxaMarketplaceValor = taxaMarketplace < 1 
    ? taxaMarketplace * precoVenda 
    : taxaMarketplace;
  
  // Imposto é sempre porcentagem sobre o preço de venda
  const impostoValor = aliquotaImposto * precoVenda;
  
  // Lucro Bruto = Preço de Venda – (Preço de Custo + Taxa Marketplace + Imposto + Frete)
  const lucroBruto = precoVenda - (precoCusto + taxaMarketplaceValor + impostoValor + frete);
  
  // % Lucro = (Lucro Bruto ÷ Preço de Venda)
  const percentualLucro = precoVenda > 0 ? lucroBruto / precoVenda : 0;
  
  return {
    ...ad,
    lucroBruto,
    percentualLucro
  };
}

export function calculateSummary(ads: Ad[]): AdSummary {
  if (ads.length === 0) {
    return {
      totalLucroBruto: 0,
      mediaPercentualLucro: 0,
      totalAnuncios: 0
    };
  }
  
  const totalLucroBruto = ads.reduce((sum, ad) => sum + ad.lucroBruto, 0);
  const mediaPercentualLucro = ads.reduce((sum, ad) => sum + ad.percentualLucro, 0) / ads.length;
  
  return {
    totalLucroBruto,
    mediaPercentualLucro,
    totalAnuncios: ads.length
  };
}

export function parseFormData(formData: AdFormData): Omit<Ad, 'id' | 'lucroBruto' | 'percentualLucro'> {
  const precoVenda = parseFloat(formData.precoVenda) || 0;
  
  return {
    produtoAnuncio: formData.produtoAnuncio.trim(),
    precoVenda,
    precoCusto: parseFloat(formData.precoCusto) || 0,
    taxaMarketplace: parseMarketplaceFee(formData.taxaMarketplace, precoVenda),
    aliquotaImposto: parsePercentage(formData.aliquotaImposto),
    frete: parseFloat(formData.frete) || 0
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

