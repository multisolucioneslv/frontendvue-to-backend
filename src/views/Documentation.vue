<template>
  <div class="documentation-page">
    <!-- Header -->
    <div class="doc-header">
      <div class="header-content">
        <div class="header-icon">
          <HelpCircle class="h-8 w-8" />
        </div>
        <div class="header-text">
          <h1 class="doc-title">Documentación del Sistema</h1>
          <p class="doc-subtitle">Guía completa para usar todas las funcionalidades</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="doc-nav">
      <div class="nav-container">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="activeSection = section.id"
          :class="['nav-item', { active: activeSection === section.id }]"
        >
          <component :is="section.icon" class="h-5 w-5" />
          <span>{{ section.title }}</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="doc-content">
      <!-- Introducción -->
      <div v-if="activeSection === 'introduction'" class="doc-section">
        <div class="section-header">
          <h2>Introducción al Sistema</h2>
          <p>Bienvenido al sistema de gestión empresarial</p>
        </div>
        
        <div class="section-content">
          <div class="info-grid">
            <div class="info-card">
              <div class="card-icon">
                <BarChart3 class="h-6 w-6" />
              </div>
              <h3>Dashboard</h3>
              <p>Panel principal con estadísticas y métricas en tiempo real</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">
                <Package class="h-6 w-6" />
              </div>
              <h3>Productos</h3>
              <p>Gestión completa de inventario y catálogo de productos</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">
                <Users class="h-6 w-6" />
              </div>
              <h3>Clientes</h3>
              <p>Administración de base de datos de clientes</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">
                <Building2 class="h-6 w-6" />
              </div>
              <h3>Sucursales</h3>
              <p>Control de múltiples ubicaciones y sucursales</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard -->
      <div v-if="activeSection === 'dashboard'" class="doc-section">
        <div class="section-header">
          <h2>Dashboard</h2>
          <p>Panel principal del sistema</p>
        </div>
        
        <div class="section-content">
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">
                <BarChart3 class="h-5 w-5" />
              </div>
              <div class="feature-content">
                <h3>Estadísticas en Tiempo Real</h3>
                <p>Visualiza métricas importantes como ventas, productos, clientes y más</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <TrendingUp class="h-5 w-5" />
              </div>
              <div class="feature-content">
                <h3>Gráficos Interactivos</h3>
                <p>Analiza tendencias con gráficos que se actualizan automáticamente</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <Activity class="h-5 w-5" />
              </div>
              <div class="feature-content">
                <h3>Actividad Reciente</h3>
                <p>Monitorea las últimas acciones realizadas en el sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos -->
      <div v-if="activeSection === 'productos'" class="doc-section">
        <div class="section-header">
          <h2>Gestión de Productos</h2>
          <p>Administra tu inventario de manera eficiente</p>
        </div>
        
        <div class="section-content">
          <div class="steps-container">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Agregar Producto</h3>
                <p>Haz clic en "Nuevo Producto" y completa la información básica</p>
                <ul>
                  <li>Nombre del producto</li>
                  <li>Descripción</li>
                  <li>Precio</li>
                  <li>Categoría</li>
                  <li>Stock inicial</li>
                </ul>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Subir Imágenes</h3>
                <p>Agrega imágenes del producto para mejor presentación</p>
                <ul>
                  <li>Formatos soportados: JPG, PNG, WebP</li>
                  <li>Tamaño máximo: 2MB por imagen</li>
                  <li>Puedes subir múltiples imágenes</li>
                </ul>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Configurar Códigos</h3>
                <p>Establece códigos de barras y QR para identificación</p>
                <ul>
                  <li>Código de barras único</li>
                  <li>Código QR personalizado</li>
                  <li>Generación automática disponible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clientes -->
      <div v-if="activeSection === 'customers'" class="doc-section">
        <div class="section-header">
          <h2>Gestión de Clientes</h2>
          <p>Administra la información de tus clientes</p>
        </div>
        
        <div class="section-content">
          <div class="feature-grid">
            <div class="feature-card">
              <h3>Información Personal</h3>
              <ul>
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Teléfono</li>
                <li>Dirección</li>
                <li>Fecha de nacimiento</li>
              </ul>
            </div>
            
            <div class="feature-card">
              <h3>Historial de Compras</h3>
              <ul>
                <li>Productos adquiridos</li>
                <li>Fechas de compra</li>
                <li>Monto total</li>
                <li>Estado de pedidos</li>
              </ul>
            </div>
            
            <div class="feature-card">
              <h3>Comunicación</h3>
              <ul>
                <li>Notificaciones por email</li>
                <li>Mensajes SMS</li>
                <li>Integración con Telegram</li>
                <li>Recordatorios automáticos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuraciones -->
      <div v-if="activeSection === 'settings'" class="doc-section">
        <div class="section-header">
          <h2>Configuraciones del Sistema</h2>
          <p>Personaliza la experiencia según tus necesidades</p>
        </div>
        
        <div class="section-content">
          <div class="settings-guide">
            <div class="guide-section">
              <h3>Configuración General</h3>
              <p>Personaliza aspectos básicos del sistema:</p>
              <ul>
                <li><strong>Fuentes:</strong> Cambia la tipografía del sistema</li>
                <li><strong>Tamaño:</strong> Ajusta el tamaño de la fuente</li>
                <li><strong>Animaciones:</strong> Habilita/deshabilita efectos visuales</li>
                <li><strong>Sonidos:</strong> Controla las notificaciones sonoras</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <h3>Apariencia</h3>
              <p>Personaliza los colores y temas:</p>
              <ul>
                <li><strong>Esquemas de color:</strong> Selecciona entre paletas predefinidas</li>
                <li><strong>Colores personalizados:</strong> Define tus propios colores</li>
                <li><strong>Vista previa:</strong> Ve los cambios en tiempo real</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <h3>Branding</h3>
              <p>Configura la identidad visual:</p>
              <ul>
                <li><strong>Logo:</strong> Sube el logo de tu empresa</li>
                <li><strong>Favicon:</strong> Personaliza el icono del navegador</li>
                <li><strong>Fondo de login:</strong> Personaliza la pantalla de inicio</li>
                <li><strong>Plantillas:</strong> Selecciona el estilo del login</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <h3>Vistas</h3>
              <p>Controla qué secciones están disponibles:</p>
              <ul>
                <li><strong>Activar/Desactivar:</strong> Controla el acceso a cada sección</li>
                <li><strong>Configuraciones rápidas:</strong> Perfiles predefinidos</li>
                <li><strong>Roles:</strong> Diferentes niveles de acceso</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div v-if="activeSection === 'faq'" class="doc-section">
        <div class="section-header">
          <h2>Preguntas Frecuentes</h2>
          <p>Respuestas a las dudas más comunes</p>
        </div>
        
        <div class="section-content">
          <div class="faq-container">
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Cómo puedo cambiar mi contraseña?</h3>
              </div>
              <div class="faq-answer">
                <p>Ve a tu perfil de usuario y selecciona "Cambiar contraseña". Ingresa tu contraseña actual y la nueva contraseña.</p>
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Puedo exportar los datos del sistema?</h3>
              </div>
              <div class="faq-answer">
                <p>Sí, puedes exportar datos en formato Excel desde cada sección usando el botón "Exportar" en las tablas.</p>
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Cómo funciona el sistema de notificaciones?</h3>
              </div>
              <div class="faq-answer">
                <p>El sistema envía notificaciones automáticas para eventos importantes como stock bajo, nuevos pedidos, etc.</p>
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question">
                <h3>¿Puedo personalizar los reportes?</h3>
              </div>
              <div class="faq-answer">
                <p>Sí, en la sección de Dashboard puedes configurar qué métricas mostrar y personalizar los gráficos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  HelpCircle,
  BarChart3,
  Package,
  Users,
  Building2,
  TrendingUp,
  Activity,
  Settings
} from 'lucide-vue-next'

const activeSection = ref('introduction')

const sections = [
  { id: 'introduction', title: 'Introducción', icon: HelpCircle },
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3 },
  { id: 'productos', title: 'Productos', icon: Package },
  { id: 'customers', title: 'Clientes', icon: Users },
  { id: 'settings', title: 'Configuraciones', icon: Settings },
  { id: 'faq', title: 'FAQ', icon: HelpCircle }
]
</script>

<style scoped>
.documentation-page {
  width: 100%;
  margin: 0;
  padding: 0;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.header-text h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-text p {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

/* Navigation */
.doc-nav {
  margin-bottom: 2rem;
  padding: 0 1.5rem;
}

.nav-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.nav-item:hover {
  background: #e2e8f0;
  color: #374151;
}

.nav-item.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Content */
.doc-content {
  padding: 0 1.5rem 2rem;
}

.doc-section {
  max-width: 1000px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.section-header p {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.info-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin: 0 auto 1rem;
}

.info-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.info-card p {
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Feature List */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #f0f4ff;
  color: #667eea;
  border-radius: 8px;
  flex-shrink: 0;
}

.feature-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.feature-content p {
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Steps */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.step-content p {
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.step-content ul {
  color: #64748b;
  margin: 0;
  padding-left: 1.5rem;
}

.step-content li {
  margin-bottom: 0.25rem;
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.feature-card ul {
  color: #64748b;
  margin: 0;
  padding-left: 1.5rem;
}

.feature-card li {
  margin-bottom: 0.5rem;
}

/* Settings Guide */
.settings-guide {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.guide-section {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.guide-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.guide-section p {
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.guide-section ul {
  color: #64748b;
  margin: 0;
  padding-left: 1.5rem;
}

.guide-section li {
  margin-bottom: 0.5rem;
}

.guide-section strong {
  color: #1e293b;
}

/* FAQ */
.faq-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.faq-question {
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.faq-question h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.faq-answer {
  padding: 1.5rem;
}

.faq-answer p {
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Dark mode */
.dark .doc-header {
  border-bottom-color: #334155;
}

.dark .header-text h1 {
  color: #f1f5f9;
}

.dark .header-text p {
  color: #94a3b8;
}

.dark .nav-item {
  background: #334155;
  color: #94a3b8;
}

.dark .nav-item:hover {
  background: #475569;
  color: #f1f5f9;
}

.dark .nav-item.active {
  background: #667eea;
  color: white;
}

.dark .section-header h2 {
  color: #f1f5f9;
}

.dark .section-header p {
  color: #94a3b8;
}

.dark .info-card,
.dark .feature-item,
.dark .step,
.dark .feature-card,
.dark .guide-section,
.dark .faq-item {
  background: #1e293b;
  border-color: #334155;
}

.dark .info-card:hover,
.dark .feature-item:hover {
  border-color: #667eea;
}

.dark .info-card h3,
.dark .feature-content h3,
.dark .step-content h3,
.dark .feature-card h3,
.dark .guide-section h3,
.dark .faq-question h3 {
  color: #f1f5f9;
}

.dark .info-card p,
.dark .feature-content p,
.dark .step-content p,
.dark .feature-card ul,
.dark .guide-section p,
.dark .guide-section ul,
.dark .faq-answer p {
  color: #94a3b8;
}

.dark .step-content ul,
.dark .feature-card ul,
.dark .guide-section ul {
  color: #94a3b8;
}

.dark .guide-section strong {
  color: #f1f5f9;
}

.dark .faq-question {
  background: #334155;
  border-bottom-color: #475569;
}

/* Responsive */
@media (max-width: 768px) {
  .doc-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .nav-container {
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-item {
    justify-content: flex-start;
  }

  .doc-content {
    padding: 0 1rem 2rem;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
  }

  .step {
    flex-direction: column;
    text-align: center;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
