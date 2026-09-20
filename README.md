# Google Doodle

Extensión para Google Chrome (y otros navegadores basados en Chromium, como Edge, Brave u Opera) que te permite **reemplazar el logo de Google por uno personalizado tuyo**, cambiar el color de fondo de la página, activar un modo oscuro y ajustar el tamaño del logo — **todo sin tocar una sola línea de código**. Se hace desde un pequeño panel de ajustes que la propia extensión agrega a la página.

Funciona subiendo tu logo desde el navegador (con un selector de archivos), no editando archivos a mano: descargas la extensión, la cargas en Chrome, subes tus 2 imágenes desde el ícono de ajustes, y listo.

---

## ¿Para qué sirve?

- **Cambia el logo de la portada de Google** (google.com) por el tuyo.
- **Cambia el logo de la cabecera** en la página de resultados de búsqueda (versión compacta).
- **Cambia el logo y el fondo de la pestaña nueva** de Chrome, que además incluye un buscador funcional apuntando a Google.
- **Cambia el color de fondo** de la página de Google.
- **Activa un modo oscuro** simple con un solo clic.
- **Ajusta el tamaño** del logo con un control deslizante.
- Los ajustes se guardan en tu propio navegador (no en la nube, no se comparten con nadie) y se aplican **de inmediato**, sin recargar la página.

Pensada para que cualquier persona pueda usarla con su propia imagen: no hay un logo fijo "de fábrica" que tengas que editar en el código, todo se personaliza desde la interfaz.

---

## Requisitos

- Google Chrome, Microsoft Edge, Brave, Opera, o cualquier navegador basado en Chromium que soporte extensiones Manifest V3 (todas las versiones modernas lo soportan).
- No necesitas cuenta de desarrollador ni publicar nada en la Chrome Web Store: se instala en modo desarrollador, de forma local.

---

## Descarga

**Opción A — Descargar el ZIP (más fácil, no requiere git)**

1. Entra a este repositorio: https://github.com/Sherlock182/Google-Doodle
2. Haz clic en el botón verde **"Code"** → **"Download ZIP"**.
3. Descomprime el archivo ZIP descargado en una carpeta de tu computadora (por ejemplo, en Documentos o Escritorio).

**Opción B — Clonar con git**

```
git clone https://github.com/Sherlock182/Google-Doodle.git
```

> **Importante:** no borres ni muevas esa carpeta después de instalar la extensión. Chrome carga la extensión directamente desde ahí — si mueves o borras la carpeta, la extensión deja de funcionar.

---

## Instalación

1. Abre Chrome y ve a la dirección `chrome://extensions` (cópiala y pégala en la barra de direcciones).
2. Activa **"Modo de desarrollador"** con el interruptor de la esquina superior derecha.
3. Haz clic en el botón **"Cargar descomprimida"**.
4. Selecciona la carpeta donde descomprimiste o clonaste el proyecto (la que contiene el archivo `manifest.json`).
5. La extensión "Google Doodle" debería aparecer activada en la lista.
6. Abre una pestaña nueva de Chrome y elige **"Conservar cambios"** si te lo pide.
7. Entra a `google.com` y haz `Ctrl + F5` para forzar la recarga.

Con esto ya tienes la extensión funcionando con el logo por defecto. El siguiente paso es personalizarlo con el tuyo.

---

## Cómo personalizar tu logo (modo de uso)

1. Entra a `google.com` o abre una pestaña nueva de Chrome.
2. Busca el pequeño ícono de engranaje (⚙) discreto en la **esquina inferior derecha** de la pantalla.
3. Haz clic para abrir el panel de ajustes. Ahí puedes:
   - **Modo oscuro de la página**: interruptor para activar/desactivar un fondo oscuro fijo.
   - **Color de fondo**: elige el color que quieras (se desactiva mientras el modo oscuro está activo).
   - **Logo completo**: el que se usa en la portada de google.com. Sube tu imagen con el selector de archivos.
   - **Logo compacto**: el que se usa en la cabecera de la página de resultados de búsqueda. Sube tu imagen aparte (puede ser una versión más simple del mismo logo).
   - **Tamaño del logo**: control deslizante para hacerlo más grande o más pequeño.
4. Haz clic en **"Guardar"**. Los cambios se aplican de inmediato, sin recargar la página, y quedan guardados en tu navegador para la próxima vez.
5. **"Restablecer todo"** regresa todo a los valores originales: logo por defecto, sin color de fondo personalizado, modo oscuro apagado y tamaño por defecto.

Los ajustes se guardan por navegador (usando `chrome.storage`), no dentro de la carpeta del proyecto. Esto significa que si compartes esta extensión con otra persona, cada quien sube sus propios logos desde el engranaje sin tener que editar ningún archivo ni pisar la personalización de nadie más.

### ¿Qué formato debe tener mi logo?

Para que se vea nítido, en orden de preferencia:

1. **SVG** (ideal): es vectorial, se ve perfecto a cualquier tamaño y pesa poco.
2. **PNG con fondo transparente**: si no tienes SVG, exporta tu logo a buena resolución (al menos el doble del tamaño máximo que planeas usar) para que no se vea borroso al agrandarlo.
3. Evita **JPG** si tu logo necesita fondo transparente, ya que ese formato no lo soporta.

---

## Estructura del proyecto

```
manifest.json ........... configuración de la extensión (Manifest V3)
google-logo.js .......... content script: reemplaza el logo dentro de google.com
settings-panel.js ........ ícono de ajustes + panel de personalización (compartido)
newtab.html / newtab.js .. la pestaña nueva de Chrome con buscador propio
logo.svg / logo-compact.svg .. logos por defecto (se usan hasta que subas los tuyos)
icons/ ................... íconos de la extensión (16/48/128 px)
LEEME.txt ................ guía rápida en español (versión de texto plano)
```

---

## Privacidad

Todo se guarda **localmente en tu navegador** mediante `chrome.storage.local`. La extensión no envía tus logos, tu color de fondo, ni ningún otro dato a servidores externos: no hay backend, no hay analítica, no hay llamadas de red propias.

---

## Problemas comunes

- **No aparece el logo en Google**: revisa que la extensión esté activada en `chrome://extensions` y haz `Ctrl + F5` en la página de Google.
- **No veo el ícono de ajustes**: recarga la página con `Ctrl + F5`; el ícono aparece en la esquina inferior derecha.
- **Usas un dominio de Google distinto** (por ejemplo, `google.cat` o `google.co.jp`) y no funciona ahí: abre un issue en este repositorio indicando el dominio y se puede agregar a la lista de sitios donde actúa la extensión.
- **La extensión muestra un error en `chrome://extensions`**: haz clic en "Errores" para ver el detalle; si la fecha es anterior a tu última recarga, probablemente es un registro viejo — quita la extensión y vuelve a cargarla para limpiar el historial.
