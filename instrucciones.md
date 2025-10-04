# Instrucciones
Vamos a contruir un sistema multiple de servicios
- Sistema por default
  - requiere las tablas principales como:
    - usuarios
Todos los sistemas despues del definido como default tendran adicionalmente de la tabla usuarios, las tablas necesarias para cada uno de ellos.
- Servicio para Clinica dental
  - requiere tabla de:
    - paciente (datos basicos del paciente)
    - historial del paciente
      - incluira las recetas que se agregaron en las consultas
    - historial de recetas
    - ingresos por consultas
    - gastos de implementos medicos
    - tipos de servicios
      - limpieza
      - extraciones
       - lista de tipos de extracciones
      - endodoncias
      - otros servicios que despues se puedan agregar
- Servicio para Clinica medica (un solo medico)
  - requiere tabla de:
    - pacientes
    - historial del paciente
      - incluira las recetas que se agregaron en las consultas
    - historial de recetas
    - ingresos por consultas
    - gastos de implementos medicos
- Servicio para Hopital (varios medicos)
  - requiere tabla de:
    - medicos
    - enfermeras
    - otras areas
    - Inventario
    - pacientes
    - historial del paciente
      - incluira las recetas que se agregaron en las consultas
    - historial de recetas
    - ingresos por consultas
    - gastos de implementos medicos
    - gastos de local y pago a personal, etc
- Servicio de cotizaciones para empresas
  - requiere tabla de:
    - clientes
    - productos
    - porveedores
    - marcas
    - cotizaciones
    - Roles de la empresa
- Servicio de Ventas
  - requiere tabla de:
    - clientes
    - productos
    - porveedores
    - marcas
    - cotizaciones
    - ventas
    - facturacion
    - garantias
    - monedas
    - Roles de la empresa
- Servicio de firma de abogados
  - requiere tabla de:
    - abogados
    - clientes
    - Roles del abogado
    - historial del cliente
      - trabajos realizados
      - trabajos pendientes
      - trabajos terminados
    - servicios
      - Penal
      - Civil
      - Familiar, etc
    - plantillas de documentos
    - casos
      - pendientes
      - resueltos, etc
    - documentacion de abogados
      - codigo penal y otra documentacion necesaria
    y cualquier otra informacion necesaria y faltante.


Analiza toda la lista y ofreceme un plan de trabajo para irlo implementando paso a paso
en el proyecto que estamos trabajando del frontendvue y Laravel12APIRest

Como implementar en la vista de configuraciones el seleccionar que tipo de sistema mostrar al cliente
y si selecciona un sistema x, que vea las rutas, vistas, modelos y controladores que necesita para trabajar correctamente y no usar el resto de herramientas disponibles, asi que pienso, deberia haber una ruta para el administrador, que en este caso soy yo con el usuario jscothserver entrar al area donde se seleccione que tipo de sistema mostrar o implementar

Analiza y dame un reporte de tareas a hacer