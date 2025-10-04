/**
 * Servicio para generar imágenes aleatorias de productos
 * Utiliza servicios como Lorem Picsum, Unsplash y Picsum para obtener imágenes
 */

export interface ProductImageOptions {
  width?: number;
  height?: number;
  category?: string;
  seed?: string;
}

class ImageService {
  private imageServices = [
    'unsplash',
    'picsum',
    'placeholder'
  ];

  private productCategories = [
    'product',
    'electronics',
    'clothing',
    'food',
    'furniture',
    'sports',
    'beauty',
    'books',
    'toys',
    'jewelry',
    'automotive',
    'home',
    'garden',
    'office',
    'health'
  ];

  // URLs de imágenes de productos reales de diferentes categorías
  private productImages: { [key: string]: string[] } = {
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
    ],
    clothing: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    ],
    food: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=400&fit=crop'
    ],
    furniture: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
    ],
    sports: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ],
    books: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop'
    ],
    toys: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    ],
    product: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ]
  };

  /**
   * Genera una URL de imagen aleatoria para un producto
   */
  getRandomProductImage(options: ProductImageOptions = {}): string {
    const {
      width = 300,
      height = 300,
      category = 'product'
    } = options;

    // Determinar la categoría
    const detectedCategory = this.getCategoryFromName(category);
    
    // Obtener imágenes de la categoría correspondiente
    const categoryImages = this.productImages[detectedCategory] || this.productImages.product;
    
    // Seleccionar una imagen aleatoria de la categoría
    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    
    return categoryImages[randomIndex];
  }

  /**
   * Genera una imagen específica para un producto basada en su ID
   * Esto asegura que el mismo producto siempre tenga la misma imagen
   */
  getProductImage(productId: number, options: ProductImageOptions = {}): string {
    const {
      width = 300,
      height = 300,
      category = 'product'
    } = options;

    // Determinar la categoría basada en el nombre del producto si se proporciona
    const detectedCategory = this.getCategoryFromName(category);
    
    // Obtener imágenes de la categoría correspondiente
    const categoryImages = this.productImages[detectedCategory] || this.productImages.product;
    
    // Usar el ID del producto para seleccionar una imagen consistente
    const imageIndex = productId % categoryImages.length;
    
    return categoryImages[imageIndex];
  }

  /**
   * Genera múltiples imágenes para una lista de productos
   */
  getProductImages(products: Array<{ id: number; name: string }>): Array<{ id: number; image: string }> {
    return products.map(product => ({
      id: product.id,
      image: this.getProductImage(product.id, {
        width: 300,
        height: 300,
        category: product.name
      })
    }));
  }

  /**
   * Servicio Picsum (Lorem Picsum) - Imágenes aleatorias
   */
  private getPicsumImage(width: number, height: number, seed: string): string {
    const seedHash = this.hashString(seed);
    return `https://picsum.photos/seed/${seedHash}/${width}/${height}`;
  }

  /**
   * Servicio Unsplash - Imágenes de alta calidad
   */
  private getUnsplashImage(width: number, height: number, category: string): string {
    const categoryParam = this.productCategories.includes(category) ? category : 'product';
    return `https://source.unsplash.com/${width}x${height}/?${categoryParam}`;
  }

  /**
   * Servicio Lorem Picsum alternativo
   */
  private getLoremPicsumImage(width: number, height: number, seed: string): string {
    const seedHash = this.hashString(seed);
    return `https://picsum.photos/id/${seedHash}/${width}/${height}`;
  }

  /**
   * Genera un seed aleatorio
   */
  private generateSeed(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Genera un hash simple de un string
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Obtiene un servicio aleatorio
   */
  private getRandomService(): string {
    const randomIndex = Math.floor(Math.random() * this.imageServices.length);
    return this.imageServices[randomIndex];
  }

  /**
   * Determina la categoría de imagen basada en el nombre del producto
   */
  private getCategoryFromName(productName: string): string {
    const name = productName.toLowerCase();
    
    if (name.includes('laptop') || name.includes('computadora') || name.includes('celular') || name.includes('tablet')) {
      return 'electronics';
    }
    if (name.includes('camisa') || name.includes('pantalón') || name.includes('zapato') || name.includes('ropa')) {
      return 'clothing';
    }
    if (name.includes('comida') || name.includes('bebida') || name.includes('alimento')) {
      return 'food';
    }
    if (name.includes('mesa') || name.includes('silla') || name.includes('mueble')) {
      return 'furniture';
    }
    if (name.includes('deporte') || name.includes('ejercicio') || name.includes('fitness')) {
      return 'sports';
    }
    if (name.includes('libro') || name.includes('revista') || name.includes('papel')) {
      return 'books';
    }
    if (name.includes('juguete') || name.includes('niño') || name.includes('bebé')) {
      return 'toys';
    }
    
    return 'product'; // Categoría por defecto
  }

  /**
   * Genera una imagen placeholder mientras se carga la imagen real
   */
  getPlaceholderImage(width = 300, height = 300, text = 'Cargando...'): string {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodedText}`;
  }

  /**
   * Verifica si una URL de imagen es válida
   */
  isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene una imagen de fallback si la imagen principal falla
   */
  getFallbackImage(width = 300, height = 300): string {
    return `https://via.placeholder.com/${width}x${height}/e5e7eb/9ca3af?text=Sin+Imagen`;
  }
}

// Exportar una instancia singleton
export const imageService = new ImageService();
export default imageService;
