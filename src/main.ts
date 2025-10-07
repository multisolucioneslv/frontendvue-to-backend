import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'
import './config/axios' // Importar configuración de axios
import './assets/tailwind.css' // Importar Tailwind CSS
import { useAuthStore } from './stores/auth'

// Importar jQuery y Select2
import $ from 'jquery'
import 'select2/dist/css/select2.css'
import 'select2'

// Importar PrimeVue
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'

// Importar componentes PrimeVue que necesitamos
import InputMask from 'primevue/inputmask'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import AutoComplete from 'primevue/autocomplete'
import Message from 'primevue/message'
import InlineMessage from 'primevue/inlinemessage'

// Hacer jQuery disponible globalmente
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

window.$ = window.jQuery = $

const pinia = createPinia()

const app = createApp(App)

// Usar PrimeVue con configuración específica
app.use(PrimeVue, {
  zIndex: {
    modal: 10000,
    overlay: 10000,
    menu: 10000,
    tooltip: 10000
  }
})

// Registrar componentes globalmente
app.component('InputMask', InputMask)
app.component('Select', Select)
app.component('MultiSelect', MultiSelect)
app.component('AutoComplete', AutoComplete)
app.component('Message', Message)
app.component('InlineMessage', InlineMessage)

// Usar otros plugins
app.use(pinia).use(store).use(router)

// Inicializar autenticación después de configurar Pinia
const authStore = useAuthStore()
authStore.restoreSession().then(() => {
  console.log('🔐 Sesión restaurada al iniciar la aplicación')
}).catch((error) => {
  console.error('❌ Error restaurando sesión:', error)
})

app.mount('#app')
