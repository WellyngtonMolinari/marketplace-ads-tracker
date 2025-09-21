import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Users, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { clientService } from '../lib/clientService.js';

export function Clients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    nome: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      
      // Tentar carregar clientes do Appwrite
      try {
        const clientsData = await clientService.getClients();
        setClients(clientsData);
      } catch (appwriteError) {
        console.warn('Appwrite não configurado, usando clientes simulados:', appwriteError);
        
        // Clientes simulados para demonstração
        const mockClients = [
          {
            $id: 'client_1',
            nome: 'Loja da Maria',
            $createdAt: '2025-09-20T10:00:00.000Z'
          },
          {
            $id: 'client_2',
            nome: 'Ateliê do João',
            $createdAt: '2025-09-19T15:30:00.000Z'
          },
          {
            $id: 'client_3',
            nome: 'Boutique Elegante',
            $createdAt: '2025-09-18T09:15:00.000Z'
          }
        ];
        setClients(mockClients);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert('Por favor, insira o nome do cliente');
      return;
    }

    try {
      if (editingClient) {
        // Atualizar cliente existente
        await clientService.updateClient(editingClient.$id, formData);
      } else {
        // Criar novo cliente
        await clientService.createClient(formData);
      }
      
      await loadClients();
      setIsDialogOpen(false);
      setEditingClient(null);
      setFormData({ nome: '' });
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Tente novamente.');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({ nome: client.nome });
    setIsDialogOpen(true);
  };

  const handleDelete = async (clientId) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      await clientService.deleteClient(clientId);
      await loadClients();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente. Tente novamente.');
    }
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setFormData({ nome: '' });
    setIsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-8 w-8" />
                Portal de Clientes
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie seus clientes e organize seus produtos por loja
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewClient} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Cliente *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ nome: e.target.value })}
                    placeholder="Ex: Loja da Maria, Ateliê do João"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nome da loja ou cliente para organizar os produtos
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingClient ? 'Atualizar' : 'Criar'} Cliente
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Users className="h-8 w-8 animate-pulse mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Carregando clientes...</p>
                </div>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum cliente cadastrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Adicione seu primeiro cliente para começar a organizar seus produtos
                </p>
                <Button onClick={handleNewClient} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Primeiro Cliente
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Cliente</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.$id}>
                        <TableCell className="font-medium">
                          {client.nome}
                        </TableCell>
                        <TableCell>
                          {formatDate(client.$createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(client)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(client.$id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2024 Marketplace Ads Tracker. Portal do Vendedor - Gerenciamento de Clientes
        </div>
      </div>
    </div>
  );
}

