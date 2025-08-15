# QA E2E con Cypress — OrangeHRM + Chatbot (Estrella Blanca)

Pruebas funcionales automatizadas con Cypress que cubren:

- **OrangeHRM (demo)**: navegación base, sección *My Info*, adjuntos, edición, etc.
- **Chatbot (Estrella Blanca)**: presencia del widget, apertura del launcher y señales de actividad.

Incluye **Page Objects**, utilidades para cerrar *overlays* y un pipeline de **GitHub Actions** listo.

---

## 🧰 Stack

- **Node.js** 18+ / 20+
- **Cypress** 14.x (Mocha + Chai incluidos)
- **GitHub Actions** (CI)
- **Artifacts**: screenshots (videos desactivados en CI para acelerar)

El código tiene comentarios en puntos clave (selectores, *workarounds*, *cross-origin*, *re-renders*).

---

## 📦 Instalación

```bash
git clone https://github.com/<tu-org>/<tu-repo>.git
cd <tu-repo>
npm ci   # o: npm install
```
## 📦 Instalación
Las pruebas leen credenciales/URLs desde el entorno Cypress:

CYPRESS_ORANGEHRM_USER — p. ej. Admin

CYPRESS_ORANGEHRM_PASS — p. ej. admin123

CYPRESS_CHATBOT_URL — por defecto https://estrellablanca.com.mx/

Local (bash):

```bash
export CYPRESS_ORANGEHRM_USER=Admin
export CYPRESS_ORANGEHRM_PASS=admin123
export CYPRESS_CHATBOT_URL=https://estrellablanca.com.mx/
```
Windows PowerShell:

```powershell
$env:CYPRESS_ORANGEHRM_USER="Admin"
$env:CYPRESS_ORANGEHRM_PASS="admin123"
$env:CYPRESS_CHATBOT_URL="https://estrellablanca.com.mx/"
```
En GitHub Actions (Settings → Secrets and variables → Actions → New repository secret):

ORANGEHRM_USER

ORANGEHRM_PASS

CHATBOT_URL
## 🗂️ Estructura
```bash
cypress/
  e2e/
    orangehrm/                  # specs OrangeHRM
    chatbot/
      01_site_nav.cy.js         # validar acceso + título del sitio
      02_widget_presence.cy.js  # validar presencia del widget
      03_open_and_title.cy.js   # abrir launcher + “título” best-effort
      04_send_and_reply.cy.js   # envío/actividad (limitado por cross-origin)
  pages/
    orangehrm/                  # Page Objects OrangeHRM
    chatbot/
      ChatbotPage.js            # Page Object del chatbot (con comentarios)
  support/
    commands/
      overlay.utils.js          # cierre de overlays/anuncios
cypress.config.* / cypress.json # configuración Cypress
.github/workflows/cypress.yml   # pipeline

```

## ▶️ Ejecución local
Runner interactivo:
```bash
npx cypress open
```
Headless (todo):
```bash
npx cypress run
```
Sólo OrangeHRM / sólo Chatbot:
```bash
npx cypress run --spec "cypress/e2e/orangehrm/**/*.cy.js"
npx cypress run --spec "cypress/e2e/chatbot/**/*.cy.js"
```
Scripts útiles en package.json:
```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:web": "cypress run --spec 'cypress/e2e/orangehrm/**/*.cy.js'",
    "cy:run:bot": "cypress run --spec 'cypress/e2e/chatbot/**/*.cy.js'"
  }
}
```


## 🤖 Chatbot: qué validamos y límites

El widget aparece como:

Botón launcher (#open-button) → se puede clicar.

Iframe (#botlers-messaging-button-iframe) → cross-origin: Cypress no puede interactuar dentro del iframe.

Las pruebas hacen:

Presencia del widget (botón o iframe).

Apertura: si hay botón, se clica y se comprueba el icono de “cerrar”.

Actividad: interceptamos llamadas al backend (/bmessaging/connect|history) como señal de vida.

Nota: En CI pueden fallar por IP / geofencing / anti-bot; en local funcionan y puedes verificarlas. El pipeline sube screenshots como evidencia.

Overlay/Anuncio que tapa pantalla
El sitio muestra un overlay (Emarsys) al entrar. overlay.utils.js intenta cerrarlo con varios selectores/fallbacks.

## 🧪 OrangeHRM (demo)

Flujo My Info: adjuntar archivo, comentar, verificar en tabla, editar/comentar, etc.

Uso de within, alias as() y selectores robustos.

Comentarios explican decisiones (evitar contains agresivos, manejar re-renders, inputs type=file, etc.).

## 🏗️ CI (GitHub Actions)

Workflow en .github/workflows/cypress.yml:

Ejecuta pruebas Web + Chatbot.

No falla el job si hay tests rojos (continue-on-error: true).

No guarda videos (acelera CI).

Sube screenshots como evidencia.

Si quieres que el pipeline falle al haber tests rojos, quita continue-on-error: true.

## 🧩 Consejos

Si el overlay cambia de HTML, ajusta selectores en overlay.utils.js.

Si cambia el widget, revisa en ChatbotPage.js:

#open-button (botón)

#botlers-messaging-button-iframe (iframe)

Para reducir flakiness en CI: aumenta timeouts y retries (CYPRESS_retries=2 ya está incluido).
