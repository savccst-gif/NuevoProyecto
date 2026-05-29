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

## 📱 Compatibilidad Móvil y Mejoras Recientes

Recientemente se implementó una serie de optimizaciones críticas para garantizar un funcionamiento fluido en dispositivos móviles y una experiencia de usuario de nivel premium:

- **Robustecimiento de Accesibilidad de Voz**: Se añadieron protecciones de seguridad alrededor de `window.speechSynthesis` en los asistentes de voz para evitar crasheos fatales (pantallas en blanco) en dispositivos y navegadores móviles que no soportan o restringen esta API.
- **Acceso Explicado en Red Local**: El servidor de desarrollo de Vite se configuró con `host: true` para enlazar el servicio a la red local. Esto permite probar y validar la web directamente desde tu teléfono móvil conectado al mismo Wi-Fi usando la dirección IP local de tu computador.
- **Rediseño del Carro de Certificados**:
  - Se removieron los selectores de cantidad (`+/-`) para cada trámite, dado que las solicitudes de certificados oficiales requieren datos específicos e individuales por cada documento.
  - El carro se unificó como un panel flotante único en la esquina superior derecha (`fixed top-20 right-4`), desplegándose directamente bajo el botón de navegación principal.
  - Se incorporaron pestañas internas para separar las **Solicitudes Pendientes** del historial persistente de **Descargas / Citas** en la sesión.
  - Se agregó soporte para descargar certificados individuales o masivos (botón "Descargar todos los certificados"), así como para visualizar los comprobantes de citas presenciales agendadas.
- **Redirección Inteligente en Spark Assistant**: Se actualizó el acceso rápido del asistente Spark de "Añadir Certificado" a "Buscar Trámite", el cual redirige lógicamente al usuario a la pestaña de trámites y oculta el panel de ayuda para facilitar una experiencia de navegación limpia y enfocada.

## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura MVC adaptada para React, organizando los archivos en directorios dedicados:

- `/src/config`: Parámetros de configuración inicial (Firebase app, Google Provider).
- `/src/views/components`: Componentes reutilizables de la interfaz de usuario (Vistas como `LoginButton` o `Navbar`).
- `/src/context`: Gestión de estado global y controladores de flujo (Controladores como `AuthContext` o `AppContexts`).
- `/src/services`: Interacciones con APIs externas y lógica de negocio (Modelos como `authService.js`).

## 🔐 Autenticación Segura con Firebase (ClaveÚnica)

El proyecto cuenta con un sistema de autenticación de ciudadanos premium que integra **Firebase Authentication** utilizando el proveedor de **Google**, disfrazado bajo la estética oficial chilena de **ClaveÚnica**. 

Esto proporciona:
1. **Identidad Real y Legítima**: Extrae el nombre real del usuario, correo electrónico verificado y foto de perfil oficial directo de los servidores de Google.
2. **Arquitectura MVC Limpia**:
   - **Configuración** (`/src/config/firebase.js`): Instancia el SDK de Firebase y el proveedor de Google Auth, con un sistema de respaldo offline que emula de forma segura el inicio de sesión si no se proveen API Keys.
   - **Servicios/Modelo** (`/src/services/authService.js`): Dispara la autenticación mediante ventana emergente (`signInWithPopup`) y gestiona la salida de usuario.
   - **Controlador/Contexto** (`/src/context/AuthContext.jsx`): Distribuye el estado de sesión activa usando `onAuthStateChanged` y `localStorage` para persistencia.
   - **Vistas** (`LoginButton.jsx` y `LoginModal.jsx`): El botón visual con la cinta tricolor institucional de la identidad de Gobierno de Chile e ícono oficial.
3. **Bypass de Desarrollo**: Cuenta con un formulario tradicional con RUT e ingreso temporal como alternativa en la base del modal de acceso.

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
