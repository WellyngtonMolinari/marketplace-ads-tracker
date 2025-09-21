import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../lib/utils.ts';

export function KpiCard({ summary }) {
  const { totalLucroBruto, mediaPercentualLucro, totalAnuncios } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Lucro Bruto
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={totalLucroBruto >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(totalLucroBruto)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Soma de todos os lucros
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Média de % Lucro
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={mediaPercentualLucro >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatPercentage(mediaPercentualLucro)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Média de margem de lucro
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Anúncios
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAnuncios}
          </div>
          <p className="text-xs text-muted-foreground">
            Anúncios cadastrados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

