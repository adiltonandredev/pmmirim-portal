// Definições de Tipos Aceitos (MIME Types)
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
  DOCS: ['application/pdf', 'application/msword'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
}

// Configurações Padrão
const MAX_SIZE_DEFAULT = 4 * 1024 * 1024; // 4MB

interface ValidationOptions {
  allowedTypes?: string[];
  maxSizeInBytes?: number;
}

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export function validateFile(file: File, options: ValidationOptions): ValidationResult {
  const { 
    allowedTypes = FILE_TYPES.IMAGES, 
    maxSizeInBytes = MAX_SIZE_DEFAULT 
  } = options;

  // 1. Verifica o Tipo (Extensão)
  if (!allowedTypes.includes(file.type)) {
    // Formata a lista para ficar legível (ex: "jpeg, png")
    const formattedTypes = allowedTypes
      .map(t => t.split('/')[1].toUpperCase())
      .join(', ');

    return {
      isValid: false,
      errorMessage: `Formato inválido! Apenas ${formattedTypes} são aceitos.`
    };
  }

  // 2. Verifica o Tamanho
  if (file.size > maxSizeInBytes) {
    const sizeInMB = Math.round(maxSizeInBytes / 1024 / 1024);
    return {
      isValid: false,
      errorMessage: `Arquivo muito grande! O máximo permitido é ${sizeInMB}MB.`
    };
  }

  // Se passou por tudo
  return { isValid: true };
}