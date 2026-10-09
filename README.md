# Bracket.live 🏆

¡Bienvenido al proyecto **Bracket.live**! Este es un sistema de generación y visualización de cuadros de torneos en tiempo real, diseñado especialmente para eventos presenciales y transmisiones en vivo (streaming) de manera gratuita, ágil y con animaciones dinámicas de victoria y derrota.

La aplicación está construida en **React + Vite** y es **100% de ejecución en el frontend** (no requiere bases de datos ni servidores externos, ya que se sincroniza mediante almacenamiento local y la API `BroadcastChannel` del navegador).

---

## 🚀 Cómo ejecutar el proyecto en tu computadora

Sigue estos sencillos pasos para poner en marcha el entorno de desarrollo local:

### 1. Requisitos previos
Asegúrate de tener instalado **Node.js** (versión 18 o superior recomendada). Puedes comprobar si lo tienes instalado ejecutando:
```bash
node -v
```
*Si no lo tienes, puedes descargarlo de [nodejs.org](https://nodejs.org/).*

### 2. Obtener el proyecto
Si estás usando Git, clona el repositorio e ingresa a la carpeta:
```bash
git clone <url-de-tu-repositorio-aquí>
cd bracket-live
```
*(Si te pasaron el proyecto en un archivo comprimido `.zip`, simplemente descomprímelo y abre la terminal en la carpeta descompresionada).*

### 3. Instalar las dependencias
Instala todos los paquetes necesarios (incluyendo Framer Motion para animaciones y Canvas Confetti):
```bash
npm install
```

### 4. Iniciar el servidor de desarrollo
Para correr la aplicación de forma local, ejecuta:
```bash
npm run dev
```

Una vez que el comando termine, verás una interfaz en la terminal con una dirección local (por lo general, es **`http://localhost:5173`**). Abre esa URL en tu navegador.

---

## 🛠️ Tecnologías clave del proyecto

* **React (Vite)**: Framework rápido para la interfaz de usuario.
* **Tailwind CSS**: Estilos rápidos y responsivos con paleta de colores cyberpunk/oscuro.
* **Framer Motion**: Motor de animaciones para las transiciones de brackets y pantallas.
* **Canvas Confetti**: Efectos de celebración para coronar al campeón.
* **BroadcastChannel API**: Permite que la pantalla del Administrador (`/admin`) y la del Directo (`/stream`) se comuniquen al instante sin necesidad de un backend.

---

## 📂 Estructura del proyecto

* `/src/components`: Componentes del torneo, controles de la administración y overlays.
* `/src/context`: El cerebro de datos que maneja las rondas, los marcadores y los estados.
* `/src/hooks`: Conexión de tiempo real local (`useBroadcast`) y guardado automático (`useLocalStorage`).
* `/src/utils/bracketGenerator.js`: Algoritmo matemático que genera y conecta los brackets automáticamente.

---

## 👥 Colaboración y aportes

1. Antes de iniciar un cambio, asegúrate de hacer un `git pull origin main` para tener lo último.
2. Crea una rama para tu característica: `git checkout -b feature/nombre-de-tu-mejora`.
3. Al terminar tus pruebas, realiza tu commit y súbelo para revisión.
