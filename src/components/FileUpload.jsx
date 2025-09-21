import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Upload, X, Image, Video, FileText } from 'lucide-react';

export function FileUpload({ onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      // Aceitar apenas imagens e vídeos
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!isImage && !isVideo) {
        alert(`Arquivo ${file.name} não é uma imagem ou vídeo válido.`);
        return false;
      }

      if (file.size > maxSize) {
        alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        return false;
      }

      return true;
    });

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            Adicione fotos e vídeos do seu produto
          </h3>
          <p className="text-muted-foreground mb-4">
            Arraste e solte arquivos aqui ou clique para selecionar
          </p>
          <Button type="button" onClick={openFileSelector} variant="outline">
            Selecionar Arquivos
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Aceita imagens (JPG, PNG, GIF) e vídeos (MP4, MOV) até 10MB cada
          </p>
        </CardContent>
      </Card>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Arquivos Selecionados ({files.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dicas para o usuário */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para melhores fotos:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use boa iluminação natural sempre que possível</li>
            <li>• Tire fotos de diferentes ângulos do produto</li>
            <li>• Mostre detalhes importantes como texturas e acabamentos</li>
            <li>• Inclua fotos do produto sendo usado (se aplicável)</li>
            <li>• Vídeos curtos podem mostrar melhor o produto em movimento</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

