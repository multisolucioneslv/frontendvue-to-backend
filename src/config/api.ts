/*
 * ============================================================================
 * API CONFIGURATION - SISTEMA MULTI-SERVICIO
 * ============================================================================
 * 
 * ⚠️  IMPORTANTE: URL del backend actualizada
 * 
 * Esta configuración apunta al backend Laravel que está corriendo en Laragon.
 * Si cambias el dominio o puerto del backend, actualiza la URL_BASE aquí.
 * 
 * 🔧 URL ACTUAL: https://laravel12apirest.test/api
 * 📝 NOTA: Esta URL coincide con la configuración de Laragon
 * 
 * ============================================================================
 */

export const API_CONFIG = {
  // CORREGIDO: URL actualizada para usar localhost en desarrollo
  URL_BASE: 'http://localhost:8000/api'
}

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  USER: '/user',

  // Resources
  PRODUCTOS: '/productos',
  CUSTOMERS: '/customers',
  COTIZACIONES: '/cotizaciones',
  SUCURSALES: '/sucursales',
  CATEGORIES: '/categories',
  USERS: '/users',
  PHONES: '/phones',
  TELEGRAMS: '/telegrams',
  SEXS: '/sexs',

  // System Management
  SYSTEM_TYPES: '/admin/system-types',
  SYSTEM_TYPE_BY_ID: '/admin/system-types/:id',
  CURRENT_SYSTEM: '/user/current-system',
  CHANGE_SYSTEM: '/user/change-system',

  // System Modules
  SYSTEM_MODULES: '/admin/system-modules/system/:systemTypeId',
  SYSTEM_MODULE_BY_ID: '/admin/system-modules/:id',
  TOGGLE_MODULE: '/admin/system-modules/:id/toggle',

  // User System Access
  USER_SYSTEM_ACCESS: '/admin/user-system-access',
  USER_ACCESS_BY_ID: '/admin/user-system-access/:id',
  GRANT_ACCESS: '/admin/user-system-access/grant',
  USER_ACCESSES: '/admin/user-system-access/user/:userId',
  TOGGLE_ACCESS: '/admin/user-system-access/:id/toggle',

  // System Configuration
  SYSTEM_CONFIGURATIONS: '/admin/system-configurations',
  SYSTEM_CONFIG_BY_ID: '/admin/system-configurations/:id',
  CONFIG_BY_SYSTEM: '/admin/system-configurations/system/:systemTypeId',
  PUBLIC_CONFIGS: '/admin/system-configurations/public/:systemTypeId',
  UPDATE_CONFIG_BY_KEY: '/admin/system-configurations/update-by-key'
}