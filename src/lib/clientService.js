import { databases } from './appwrite.js';

// IDs das coleções no Appwrite (devem ser configurados pelo usuário)
const DATABASE_ID = 'YOUR_DATABASE_ID';
const CLIENTS_COLLECTION_ID = 'YOUR_CLIENTS_COLLECTION_ID';

class ClientService {
  // Listar todos os clientes
  async getClients() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  // Criar um novo cliente
  async createClient(clientData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        'unique()', // Gerar ID único
        {
          nome: clientData.nome.trim()
        }
      );
      return response;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  // Atualizar um cliente existente
  async updateClient(clientId, clientData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        clientId,
        {
          nome: clientData.nome.trim()
        }
      );
      return response;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  // Excluir um cliente
  async deleteClient(clientId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        clientId
      );
      return true;
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  async getClient(clientId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        CLIENTS_COLLECTION_ID,
        clientId
      );
      return response;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }
}

export const clientService = new ClientService();

