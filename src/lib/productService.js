import { databases, storage, ID, DATABASE_ID, PRODUCTS_COLLECTION_ID, STORAGE_BUCKET_ID } from './appwrite.js';

export class ProductService {
  // Upload de arquivo para o Appwrite Storage
  async uploadFile(file) {
    try {
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );
      
      // Retorna a URL do arquivo
      const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, response.$id);
      return {
        id: response.$id,
        url: fileUrl.href
      };
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw new Error('Falha no upload do arquivo');
    }
  }

  // Upload de múltiplos arquivos
  async uploadMultipleFiles(files) {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Erro ao fazer upload dos arquivos:', error);
      throw new Error('Falha no upload dos arquivos');
    }
  }

  // Criar produto no banco de dados
  async createProduct(productData) {
    try {
      // Upload dos arquivos primeiro
      let fotosVideosUrls = [];
      if (productData.fotosVideos && productData.fotosVideos.length > 0) {
        const uploadResults = await this.uploadMultipleFiles(productData.fotosVideos);
        fotosVideosUrls = uploadResults.map(result => result.url);
      }

      // Preparar dados para o banco
      const dbData = {
        nome: productData.nome,
        peso: productData.peso,
        medidas: productData.medidas,
        precoCusto: productData.precoCusto,
        material: productData.material,
        tamanho: productData.tamanho,
        cores: productData.cores,
        fotosVideos: fotosVideosUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        ID.unique(),
        dbData
      );

      return response;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Falha ao salvar produto no banco de dados');
    }
  }

  // Buscar todos os produtos
  async getProducts() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao carregar produtos');
    }
  }

  // Buscar produto por ID
  async getProduct(productId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId
      );
      return response;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw new Error('Falha ao carregar produto');
    }
  }

  // Atualizar produto
  async updateProduct(productId, productData) {
    try {
      const dbData = {
        ...productData,
        updatedAt: new Date().toISOString()
      };

      const response = await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId,
        dbData
      );

      return response;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Falha ao atualizar produto');
    }
  }

  // Deletar produto
  async deleteProduct(productId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId
      );
      return true;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error('Falha ao deletar produto');
    }
  }
}

export const productService = new ProductService();

