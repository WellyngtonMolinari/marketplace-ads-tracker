import { Ad, AdFormData, AdSummary } from '../types/ad.d.ts';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
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
  return {
    produtoAnuncio: formData.produtoAnuncio.trim(),
    precoVenda: parseFloat(formData.precoVenda) || 0,
    precoCusto: parseFloat(formData.precoCusto) || 0,
    taxaMarketplace: parseFloat(formData.taxaMarketplace) || 0,
    aliquotaImposto: parseFloat(formData.aliquotaImposto) || 0,
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

