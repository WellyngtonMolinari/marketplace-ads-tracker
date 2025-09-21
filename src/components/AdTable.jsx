import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../lib/utils.ts';

export function AdTable({ ads, onDeleteAd }) {
  if (ads.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum anúncio cadastrado ainda. Adicione seu primeiro anúncio usando o formulário acima.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Anúncios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Produto / Anúncio</TableHead>
                <TableHead className="text-right">Preço Venda</TableHead>
                <TableHead className="text-right">Preço Custo</TableHead>
                <TableHead className="text-right">Taxa Marketplace</TableHead>
                <TableHead className="text-right">Imposto</TableHead>
                <TableHead className="text-right">Frete</TableHead>
                <TableHead className="text-right">Lucro Bruto</TableHead>
                <TableHead className="text-right">% Lucro</TableHead>
                <TableHead className="w-[50px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-mono text-xs">
                    {ad.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {ad.produtoAnuncio}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(ad.precoVenda)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(ad.precoCusto)}
                  </TableCell>
                  <TableCell className="text-right">
                    {ad.taxaMarketplace < 1 
                      ? formatPercentage(ad.taxaMarketplace)
                      : formatCurrency(ad.taxaMarketplace)
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(ad.aliquotaImposto)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(ad.frete)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {ad.lucroBruto >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={ad.lucroBruto >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(ad.lucroBruto)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={ad.percentualLucro >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPercentage(ad.percentualLucro)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAd(ad.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

