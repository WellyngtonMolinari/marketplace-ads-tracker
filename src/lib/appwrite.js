import { Client, Databases, Storage, ID } from 'appwrite';

// Configuração do cliente Appwrite
const client = new Client();

// Configure com suas credenciais do Appwrite
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Endpoint padrão do Appwrite Cloud
  .setProject('YOUR_PROJECT_ID'); // Substitua pelo seu Project ID

// Instâncias dos serviços
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configurações do banco de dados
export const DATABASE_ID = 'YOUR_DATABASE_ID'; // Substitua pelo seu Database ID
export const PRODUCTS_COLLECTION_ID = 'YOUR_PRODUCTS_COLLECTION_ID'; // Substitua pelo seu Collection ID
export const STORAGE_BUCKET_ID = 'YOUR_STORAGE_BUCKET_ID'; // Substitua pelo seu Bucket ID

// Função para gerar IDs únicos
export { ID };

export default client;

