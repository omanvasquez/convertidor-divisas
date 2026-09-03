# CONTEXTO DEL PROYECTO: Monitor de Divisas PWA

## 1. Visión General
Aplicación Web Progresiva (PWA) minimalista para consultar tasas de cambio y realizar conversiones bidireccionales de divisas en Venezuela. Diseñada para ser rápida, ligera y orientada a la conversión instantánea sin fricción.

**Regla de oro:** No usar frameworks pesados (Nada de Flutter, React o Angular). El desarrollo es 100% nativo con HTML5, CSS3 y Vanilla JavaScript. El despliegue se realizará en Firebase Hosting.

## 2. Arquitectura de la Interfaz (UI/UX)
El diseño es de una sola pantalla con dos bloques principales:
*   **Panel de Tasas (Grid Superior):** 3 botones/tarjetas (Tasa USDT, Tasa BCV, Tasa Euro). Estos elementos actúan como selectores de estado. Solo uno puede estar activo (resaltado) a la vez.
*   **Calculadora Bidireccional (Bloque Inferior):** Dos campos de entrada numéricos (`input type="number"`). El superior para la Divisa (dinámico según lo que se seleccione arriba) y el inferior para Bolívares (VES).
*   **Fechas de Actualización:** Textos pequeños debajo de la calculadora indicando la fecha y hora exacta del corte de la tasa.

## 3. Lógica de Interacción
*   **Matemática en Tiempo Real:** Escribir en el campo de Divisa multiplica automáticamente para llenar el campo VES. Escribir en el campo VES divide automáticamente para llenar el campo Divisa. Esto ocurre mediante eventos `input` (sin botones de "calcular").
*   **Cambio de Contexto:** Al hacer clic en una tasa distinta en el panel superior, la etiqueta de la calculadora cambia (ej. de "$ Dólares" a "€ Euros") y, si hay un valor ingresado, se recalcula inmediatamente con la nueva tasa.

## 4. Stack Tecnológico y Red
*   **Frontend:** HTML, CSS (Grid/Flexbox, variables CSS para modo claro/oscuro si se requiere) y JS puro.
*   **PWA:** Requiere un `manifest.json` válido para instalación y un `sw.js` (Service Worker) básico para cachear los *assets* estáticos y permitir la carga de la interfaz sin conexión.
*   **API:** Consumo de un endpoint público y gratuito (ej. pyDolarVenezuela, Cotizave) que consolide BCV y Binance P2P. Prohibido hacer web scraping directo al BCV por políticas de CORS.

## 5. Reglas Estrictas de Desarrollo (Directivas para Agentes IA)
1.  **Inmutabilidad Funcional:** Si la lógica matemática o el flujo bidireccional ya están funcionando, **NO DEBEN SER MODIFICADOS** al agregar nuevas características (como estilos o service workers) a menos que se solicite explícitamente.
2.  **Cero "Feature Creep":** No inventar menús, pantallas de configuración, gráficos históricos ni animaciones complejas. Mantener la estructura del proyecto cruda y directa.
3.  **Manejo de Errores Silencioso:** Si el `fetch` de la API falla, los campos numéricos deben seguir funcionando con la última tasa guardada en memoria o mostrar un mensaje claro de "Error de red" sin romper el layout.
