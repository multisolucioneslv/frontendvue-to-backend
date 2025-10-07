/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Declaraciones globales para jQuery y Select2
declare global {
  interface Window {
    $: typeof import('jquery')
    jQuery: typeof import('jquery')
  }
}
