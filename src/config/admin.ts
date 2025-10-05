// Configuración de administradores
export const ADMIN_CONFIG = {
  // Email del usuario administrador principal
  ADMIN_EMAIL: 'jscothserver@gmail.com',
  
  // Otros emails de administradores (si los hay)
  ADMIN_EMAILS: [
    'jscothserver@gmail.com'
  ],
  
  // Función para verificar si un email es de administrador
  isAdminEmail: (email: string): boolean => {
    return ADMIN_CONFIG.ADMIN_EMAILS.includes(email)
  }
}

export default ADMIN_CONFIG
