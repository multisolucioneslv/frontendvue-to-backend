<template>
  <div class="file-upload-container">
    <div 
      class="file-drop-zone"
      :class="{ 'drag-over': isDragOver, 'has-files': files.length > 0 }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileSelect"
        class="hidden-input"
      />
      
      <div v-if="files.length === 0" class="upload-placeholder">
        <div class="upload-icon">📁</div>
        <p class="upload-text">Arrastra imágenes aquí o haz clic para seleccionar</p>
        <p class="upload-subtext">Formatos: JPG, PNG, GIF, WebP (máximo 10 archivos)</p>
      </div>
      
      <div v-else class="files-preview">
        <div 
          v-for="(file, index) in files" 
          :key="index"
          class="file-preview-item"
        >
          <div class="file-preview-image">
            <img :src="file.preview" :alt="file.name" />
            <button 
              @click.stop="removeFile(index)"
              class="remove-file-btn"
              title="Eliminar imagen"
            >
              ×
            </button>
          </div>
          <div class="file-info">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-size">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        
        <div v-if="files.length < maxFiles" class="add-more-files" @click.stop="triggerFileInput">
          <div class="add-icon">+</div>
          <p>Agregar más</p>
        </div>
      </div>
    </div>
    
    <div v-if="files.length > 0" class="upload-actions">
      <Button @click="clearAllFiles" variant="outline" size="sm">
        Limpiar Todo
      </Button>
      <Button @click="triggerFileInput" variant="secondary" size="sm">
        Seleccionar Más
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from './Button.vue'

interface FileWithPreview {
  file: File
  name: string
  size: number
  preview: string
}

interface Props {
  maxFiles?: number
  maxFileSize?: number // en MB
  acceptedFormats?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 10,
  maxFileSize: 5, // 5MB por defecto
  acceptedFormats: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
})

const emit = defineEmits<{
  filesChange: [files: File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const files = ref<FileWithPreview[]>([])
const isDragOver = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    processFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const processFiles = (newFiles: File[]) => {
  const validFiles: FileWithPreview[] = []
  
  for (const file of newFiles) {
    // Validar formato
    if (!props.acceptedFormats.includes(file.type)) {
      console.warn(`Formato no soportado: ${file.type}`)
      continue
    }
    
    // Validar tamaño
    if (file.size > props.maxFileSize * 1024 * 1024) {
      console.warn(`Archivo muy grande: ${file.name}`)
      continue
    }
    
    // Validar límite de archivos
    if (files.value.length + validFiles.length >= props.maxFiles) {
      console.warn('Límite de archivos alcanzado')
      break
    }
    
    // Crear preview
    const preview = URL.createObjectURL(file)
    validFiles.push({
      file,
      name: file.name,
      size: file.size,
      preview
    })
  }
  
  files.value.push(...validFiles)
  emitFilesChange()
}

const removeFile = (index: number) => {
  // Liberar URL del objeto
  URL.revokeObjectURL(files.value[index].preview)
  files.value.splice(index, 1)
  emitFilesChange()
}

const clearAllFiles = () => {
  // Liberar todas las URLs
  files.value.forEach(file => URL.revokeObjectURL(file.preview))
  files.value = []
  emitFilesChange()
}

const emitFilesChange = () => {
  emit('filesChange', files.value.map(f => f.file))
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Limpiar URLs cuando el componente se desmonte
watch(() => files.value, (newFiles, oldFiles) => {
  if (oldFiles) {
    oldFiles.forEach(file => URL.revokeObjectURL(file.preview))
  }
}, { flush: 'post' })
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}

.file-drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-drop-zone:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.file-drop-zone.drag-over {
  border-color: #3b82f6;
  background: #dbeafe;
  transform: scale(1.02);
}

.file-drop-zone.has-files {
  padding: 1rem;
  min-height: auto;
}

.dark .file-drop-zone {
  border-color: #4b5563;
  background: #1f2937;
}

.dark .file-drop-zone:hover {
  border-color: #3b82f6;
  background: #1e3a8a;
}

.dark .file-drop-zone.drag-over {
  border-color: #3b82f6;
  background: #1e40af;
}

.hidden-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-text {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .upload-text {
  color: #d1d5db;
}

.dark .upload-subtext {
  color: #9ca3af;
}

.files-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
}

.file-preview-item {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.file-preview-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .file-preview-item {
  background: #1f2937;
  border-color: #374151;
}

.file-preview-image {
  position: relative;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.file-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-file-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.file-info {
  padding: 0.5rem;
}

.file-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.625rem;
  color: #6b7280;
  margin: 0;
}

.dark .file-name {
  color: #d1d5db;
}

.dark .file-size {
  color: #9ca3af;
}

.add-more-files {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;
  min-height: 80px;
}

.add-more-files:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.dark .add-more-files {
  border-color: #4b5563;
  background: #1f2937;
}

.dark .add-more-files:hover {
  border-color: #3b82f6;
  background: #1e3a8a;
}

.add-icon {
  font-size: 1.5rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.add-more-files p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dark .add-icon,
.dark .add-more-files p {
  color: #9ca3af;
}

.upload-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .files-preview {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
  
  .file-preview-image {
    height: 60px;
  }
  
  .file-info {
    padding: 0.25rem;
  }
  
  .file-name {
    font-size: 0.625rem;
  }
  
  .file-size {
    font-size: 0.5rem;
  }
}
</style>

