# Deploy - Frontend Admin

## Requisitos previos

- Node.js >= 26.4.0

## Pasos para levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd trabajo_final_tudw_frontend_admin/app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` y configurar la URL del backend:

```
VITE_API_URL=https://medicare.service.test/api/v1
```

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5174`.

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |

## Stack

- Vue 3.5 + TypeScript 6
- Vite 8
- TailwindCSS v4
- Pinia (state management)
- Vue Router
- Axios (HTTP client)
