# Portal del Registro Civil

Un portal web moderno, accesible y centrado en el usuario para los servicios del Registro Civil. Este proyecto está diseñado con un enfoque de "humanización" de la interfaz, buscando reducir la carga cognitiva de los ciudadanos y facilitar el acceso a los trámites.

## 🚀 Tecnologías Principales

- **React**: Biblioteca principal para la construcción de interfaces de usuario.
- **Vite**: Entorno de desarrollo rápido y empaquetador de la aplicación.
- **Tailwind CSS**: Framework de CSS utilitario para un diseño moderno y responsivo.
- **Arquitectura MVC**: Estructura de proyecto modularizada (Modelo-Vista-Controlador) para un código limpio y mantenible.

## ✨ Características Clave

- **Búsqueda en Lenguaje Natural**: Una barra de búsqueda inteligente que reemplaza la navegación compleja, permitiendo a los ciudadanos encontrar servicios de forma intuitiva.
- **Sistema de Seguimiento de Trámites**: Una línea de tiempo visual e informativa que muestra el progreso en tiempo real de las solicitudes de documentos híbridos (en línea a presencial).
- **Panel de Accesibilidad Avanzado**:
  - **Ajuste de Tamaño de Texto**: Escalado dinámico de fuentes que se aplica a todos los componentes de la interfaz.
  - **Asistente de Lectura**: Función de lectura en pantalla compatible tanto con escritorio como con dispositivos móviles mediante eventos táctiles.
  - **Modo de Alto Contraste**: Para mejorar la visibilidad y facilitar la lectura.
- **Carrito de Trámites (CartContext)**: Sistema global para sincronizar el estado de los servicios seleccionados entre diferentes partes de la interfaz, como el encabezado y el pie de página persistente.
- **Diseño Responsivo y Estético**: Interfaz premium con colores curados, tipografías modernas y micro-animaciones para mejorar la experiencia de usuario.

## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura MVC adaptada para React, organizando los archivos en directorios dedicados:

- `/src/components`: Componentes reutilizables de la interfaz de usuario (Vistas).
- `/src/context` o `/src/state`: Gestión de estado global, como el `CartContext`.
- `/src/hooks`: Lógica de negocio y controladores (Controladores).
- `/src/models` o `/src/services`: Interacciones con datos y APIs (Modelos).

## 🛠️ Instalación y Uso

Para ejecutar el proyecto localmente:

1. Clona el repositorio o descarga los archivos.
2. Abre una terminal en el directorio del proyecto (e.g. `NuevoProyecto`).
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre la URL local (usualmente `http://localhost:5173`) en tu navegador para ver la aplicación en funcionamiento.

## 📝 Construcción para Producción

Para generar una versión optimizada para producción, ejecuta:

```bash
npm run build
```

Esto creará una carpeta `dist` con los archivos estáticos listos para ser desplegados.
