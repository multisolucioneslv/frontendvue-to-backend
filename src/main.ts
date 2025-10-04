import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'
import './config/axios' // Importar configuración de axios
import './assets/tailwind.css' // Importar Tailwind CSS

const pinia = createPinia()

createApp(App).use(pinia).use(store).use(router).mount('#app')
