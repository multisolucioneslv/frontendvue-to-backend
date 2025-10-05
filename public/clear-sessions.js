// Script para limpiar todas las sesiones y datos locales
console.log('🧹 Limpiando todas las sesiones y datos locales...')

// Limpiar localStorage
localStorage.clear()
console.log('✅ localStorage limpiado')

// Limpiar sessionStorage
sessionStorage.clear()
console.log('✅ sessionStorage limpiado')

// Limpiar cookies (si es posible)
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
})
console.log('✅ Cookies limpiadas')

// Recargar la página
console.log('🔄 Recargando página...')
window.location.reload()
