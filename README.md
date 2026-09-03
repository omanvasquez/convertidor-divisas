<div align="center">

# 💵 Monitor de Divisas PWA

**Calculadora y monitor de tasas de cambio para Venezuela en tiempo real.**  
*Rápida, minimalista, sin frameworks pesados y con soporte completo para uso sin conexión (PWA).*

[![Live Demo](https://img.shields.io/badge/Demo_Online-convertidor--bcv.web.app-0284c7?style=for-the-badge&logo=google-chrome&logoColor=white)](https://convertidor-bcv.web.app)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Firebase](https://img.shields.io/badge/Firebase_Hosting-FFA611?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License MIT](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🚀 Demo en Vivo

Puedes probar la aplicación en producción aquí:  
👉 **[convertidor-bcv.web.app](https://convertidor-bcv.web.app)**

---

## ✨ Características Principales

- **⚡ Conversión Bidireccional Instantánea:** Escribe en la divisa extranjera y se calcula el equivalente en Bolívares (VES) al instante, o escribe en Bolívares y obtén la divisa de inmediato. Sin recargas ni botones de "Calcular".
- **📊 Monitoreo de 3 Tasas Clave:**
  - **Tasa BCV:** Dólar oficial publicado por el Banco Central de Venezuela.
  - **Tasa USDT:** Referencia del mercado paralelo / cripto (Binance P2P).
  - **Tasa Euro:** Cotización oficial del Euro del BCV.
- **🔄 Cambio de Contexto Fluido:** Selecciona cualquier tasa en el panel superior y el conversor recalcula automáticamente el valor actual con la nueva cotización.
- **📲 PWA Instalable:** Agrégala a la pantalla de inicio de tu teléfono (Android o iOS) o ejecútala como app de escritorio independiente.
- **📶 Soporte Offline (Service Worker):** Gracias al almacenamiento en caché estático, la aplicación abre instantáneamente y continúa funcionando incluso si pierdes conexión a internet.
- **🌓 Modo Oscuro y Claro:** Detección automática según la preferencia de tu sistema operativo y botón manual con memoria (`localStorage`).
- **🪶 100% Vanilla (Cero Dependencias):** Sin React, Vue, Angular ni librerías CSS pesadas. Pesa apenas unos pocos kilobytes y carga de inmediato en conexiones móviles lentas.
- **🛡️ Manejo Resiliente de Errores:** Si la API externa experimenta fallos de conectividad, la aplicación conserva en memoria las últimas tasas sincronizadas sin interrumpir la experiencia.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript | Sin frameworks; Grid/Flexbox moderno, variables CSS nativas |
| **PWA** | Web App Manifest + Service Worker | Instalabilidad (`manifest.json`) y cacheo offline (`sw.js`) |
| **API** | [DolarApi Venezuela](https://ve.dolarapi.com) | Fuente pública y confiable de tasas con soporte CORS |
| **Despliegue** | Firebase Hosting | Distribución global rápida a través de CDN |

---

## 📂 Estructura del Repositorio

```text
convertidor-divisas/
├── index.html              # Interfaz principal, diseño responsive y temas
├── app.js                  # Lógica matemática bidireccional, consumo de API y PWA
├── sw.js                   # Service Worker para funcionamiento offline
├── manifest.json           # Configuración PWA (nombre, colores, iconos)
├── firebase.json           # Configuración de hosting, caché y rewrites
├── .firebaserc             # Proyecto vinculado en Firebase
├── .gitignore              # Archivos excluidos del control de versiones
├── CONTEXTO-PWA-DIVISAS.md # Especificaciones y reglas de desarrollo
├── icon-32.png             # Favicon
├── icon-192.png            # Icono para dispositivos móviles
├── icon-512.png            # Icono de alta resolución
└── icon-512-maskable.png   # Icono adaptable (Android adaptive icons)
```

---

## 💻 Instalación y Uso Local

Para probar o modificar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone git@github.com:omanvasquez/convertidor-divisas.git
   cd convertidor-divisas
   ```

2. **Levantar un servidor local estático:**  
   Al ser una PWA que requiere Service Worker, debe servirse bajo protocolo HTTP/HTTPS (no abrir directamente como archivo `file://`):

   - **Con Python 3:**
     ```bash
     python3 -m http.server 8080
     ```
   - **Con Node.js (`npx`):**
     ```bash
     npx serve .
     ```
   - **Con VS Code:** Usa la extensión *Live Server*.

3. **Abrir en el navegador:**
   Visita `http://localhost:8080` (o el puerto que indique tu servidor).

---

## ☁️ Despliegue en Firebase Hosting

Si tienes configurado el [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
# Iniciar sesión en Firebase (si no lo has hecho)
firebase login

# Desplegar a producción
firebase deploy
```

---

## 👨‍💻 Autor

Desarrollado con dedicación por **Oman Vásquez**:

- 🌐 Portafolio: [oman-vasquez.web.app](https://oman-vasquez.web.app)
- 🐙 GitHub: [@omanvasquez](https://github.com/omanvasquez)

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia [MIT](LICENSE).
