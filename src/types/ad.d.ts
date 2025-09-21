export interface Ad {
  id: string;
  produtoAnuncio: string;
  precoVenda: number;
  precoCusto: number;
  taxaMarketplace: number; // Pode ser % (0.0-1.0) ou valor fixo em R$
  aliquotaImposto: number; // Sempre % (0.0-1.0)
  frete: number;
  lucroBruto: number; // Calculado
  percentualLucro: number; // Calculado
}

export interface AdFormData {
  produtoAnuncio: string;
  precoVenda: string;
  precoCusto: string;
  taxaMarketplace: string;
  aliquotaImposto: string;
  frete: string;
}

export interface AdSummary {
  totalLucroBruto: number;
  mediaPercentualLucro: number;
  totalAnuncios: number;
}

