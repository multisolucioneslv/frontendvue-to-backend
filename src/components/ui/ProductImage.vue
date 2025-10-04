<template>
  <div class="product-image-container">
    <div class="image-wrapper" :class="{ 'error': hasError }">
      <img
        v-if="!hasError"
        :src="imageUrl"
        :alt="alt"
        class="product-image"
        @load="onImageLoad"
        @error="onImageError"
        @click.stop="openPreview"
      />
      
      <!-- Error state -->
      <div v-if="hasError" class="image-error">
        <div class="error-icon">📷</div>
        <span class="error-text">Sin imagen</span>
      </div>
    </div>
    
            <!-- Preview modal -->
            <Dialog :open="showPreview" @update:open="showPreview = $event" title="Vista Previa">
              <div class="image-preview-container">
                <img :src="imageUrl" :alt="alt" class="preview-image" />
                <div class="preview-info">
                  <h3>{{ alt }}</h3>
                  <p class="text-sm text-muted-foreground">ID del producto: {{ productId }}</p>
                </div>
              </div>
            </Dialog>

            <!-- Gallery modal with carousel -->
            <Dialog :open="showGallery" @update:open="showGallery = $event" :title="`Galería - ${productName}`" class="gallery-modal">
              <div class="gallery-container">
                <div class="gallery-main">
                  <div class="gallery-image-container">
                    <img 
                      :src="allImages[currentImageIndex]" 
                      :alt="`Imagen ${currentImageIndex + 1} de ${allImages.length}`"
                      class="gallery-main-image"
                    />
                    
                    <!-- Navigation arrows -->
                    <button 
                      v-if="allImages.length > 1"
                      @click="prevImage" 
                      class="gallery-nav gallery-nav-prev"
                      title="Imagen anterior"
                    >
                      ←
                    </button>
                    <button 
                      v-if="allImages.length > 1"
                      @click="nextImage" 
                      class="gallery-nav gallery-nav-next"
                      title="Siguiente imagen"
                    >
                      →
                    </button>
                  </div>
                  
                  <!-- Image counter -->
                  <div class="gallery-counter">
                    {{ currentImageIndex + 1 }} / {{ allImages.length }}
                  </div>
                </div>
                
                <!-- Thumbnail strip -->
                <div v-if="allImages.length > 1" class="gallery-thumbnails">
                  <div 
                    v-for="(image, index) in allImages" 
                    :key="index"
                    @click="goToImage(index)"
                    class="gallery-thumbnail"
                    :class="{ active: index === currentImageIndex }"
                  >
                    <img :src="image" :alt="`Miniatura ${index + 1}`" />
                  </div>
                </div>
              </div>
            </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Dialog from './Dialog.vue'
import { imageService } from '@/services/imageService'

interface Props {
  productId?: number
  productName?: string
  imageUrl?: string
  width?: number
  height?: number
  showPreview?: boolean
  lazy?: boolean
  showGallery?: boolean
  allImages?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  productId: 0,
  productName: 'Producto',
  imageUrl: '',
  width: 80,
  height: 80,
  showPreview: true,
  lazy: true,
  showGallery: false,
  allImages: () => []
})

const isLoading = ref(false)
const hasError = ref(false)
const showPreview = ref(false)
const showGallery = ref(false)
const currentImageIndex = ref(0)

// URL de la imagen
const imageUrl = computed(() => {
  if (props.imageUrl && imageService.isValidImageUrl(props.imageUrl)) {
    return props.imageUrl
  }
  
  // Generar imagen aleatoria basada en el ID del producto
  if (props.productId) {
    return imageService.getProductImage(props.productId, {
      width: props.width,
      height: props.height,
      category: imageService.getCategoryFromName(props.productName)
    })
  }
  
  // Imagen placeholder por defecto
  return imageService.getPlaceholderImage(props.width, props.height, props.productName)
})

// Alt text para accesibilidad
const alt = computed(() => `Imagen del producto: ${props.productName}`)

// Event handlers
const onImageLoad = () => {
  hasError.value = false
}

const onImageError = () => {
  hasError.value = true
}

const openPreview = () => {
  if (props.showPreview && !hasError.value) {
    if (props.showGallery && props.allImages && props.allImages.length > 0) {
      showGallery.value = true
      currentImageIndex.value = 0
    } else {
      showPreview.value = true
    }
  }
}

const openGallery = () => {
  if (props.showGallery && props.allImages && props.allImages.length > 0) {
    showGallery.value = true
    currentImageIndex.value = 0
  }
}

const nextImage = () => {
  if (props.allImages && props.allImages.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.allImages.length
  }
}

const prevImage = () => {
  if (props.allImages && props.allImages.length > 0) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? props.allImages.length - 1 
      : currentImageIndex.value - 1
  }
}

const goToImage = (index: number) => {
  currentImageIndex.value = index
}

// Recargar imagen cuando cambien las props
watch(() => [props.productId, props.productName, props.imageUrl], () => {
  hasError.value = false
}, { immediate: false })

// Inicializar estado
onMounted(() => {
  if (!props.lazy) {
    hasError.value = false
  }
})
</script>

<style scoped>
.product-image-container {
  display: inline-block;
  position: relative;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.image-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.2s ease;
}


.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #f3f4f6;
  color: #6b7280;
}

.error-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.error-text {
  font-size: 0.75rem;
  text-align: center;
}

.image-preview-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  max-height: 80vh;
}

.preview-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  background: #f8fafc;
}

.preview-info {
  text-align: center;
}

.preview-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

/* Responsive */
@media (max-width: 768px) {
  .image-wrapper:hover {
    transform: none;
  }
  
  .preview-image {
    max-height: 300px;
  }
}

/* Gallery Modal Styles */
:deep(.gallery-modal) {
  width: 90vw !important;
  max-width: 1200px !important;
  height: 90vh !important;
  max-height: 800px !important;
}

:deep(.gallery-modal .dialog-content) {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.gallery-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.dark .gallery-container {
  background: #1a1a1a;
}

.gallery-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.gallery-image-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  overflow: hidden;
}

.dark .gallery-image-container {
  background: #111827;
}

.gallery-main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.gallery-nav:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.gallery-nav-prev {
  left: 20px;
}

.gallery-nav-next {
  right: 20px;
}

.gallery-counter {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.gallery-thumbnails {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f3f4f6;
  overflow-x: auto;
  border-top: 1px solid #e5e7eb;
}

.dark .gallery-thumbnails {
  background: #1f2937;
  border-top-color: #374151;
}

.gallery-thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s ease;
}

.gallery-thumbnail:hover {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.gallery-thumbnail.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.gallery-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive */
@media (max-width: 768px) {
  :deep(.gallery-modal) {
    width: 95vw !important;
    height: 95vh !important;
  }
  
  .gallery-nav {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .gallery-nav-prev {
    left: 10px;
  }
  
  .gallery-nav-next {
    right: 10px;
  }
  
  .gallery-counter {
    top: 10px;
    right: 10px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .gallery-thumbnail {
    width: 60px;
    height: 60px;
  }
}
</style>
