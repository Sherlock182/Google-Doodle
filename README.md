# Replace Google Logo UserScript

## 📌 Description

This UserScript allows you to **replace the Google logo** with a custom image, both on the homepage and the search results page. It's useful for personalization or fun tweaks in your browser using a userscript manager like **Tampermonkey** or **Violentmonkey**.

---

## 🚀 How to Use (English)

1. Install a UserScript manager extension in your browser:
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)

2. Download or copy the file Google-Doodle.js` (or rename it, but keep the `.js` extension).

3. Open your UserScript manager and **create a new script**.

4. Paste the contents of the Google-Doodle.js file into the editor and save.

5. Visit [https://www.google.com](https://www.google.com).  
   You should now see the default Google logo replaced with your chosen image.

---

## 🎨 How to Customize the Logo

- **Change the image**:  
  In the script, replace the default image URL:
  ```
  https://i.imgur.com/D9SIhvS.jpeg
  ```
  with the URL of your own image.

- **Adjust the size**:  
  Edit the following lines in the script to change the width and height:
  ```javascript
  img.width = YOUR_WIDTH;
  img.height = YOUR_HEIGHT;
  ```

- **Save and refresh** Google to see your new logo in action.

---

## 🇪🇸 Instrucciones en Español

### 📝 ¿Qué hace este script?

Este UserScript reemplaza el logo de Google por una **imagen personalizada**, tanto en la página principal como en los resultados de búsqueda.

---

### 🔧 Cómo usarlo

1. Instala una extensión para gestionar UserScripts:
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)

2. Descarga o copia el archivo Google-Doodle.js (o el nombre que elijas, terminando en `.js`).

3. Abre el gestor de UserScripts y **crea un nuevo script**.

4. Pega el contenido del archivo en el editor y guarda.

5. Visita [https://www.google.com](https://www.google.com) y verás el logo de Google reemplazado por tu imagen.

---

### 🎨 Cómo personalizar el logo

- **Cambia la imagen**:  
  En el script, reemplaza el enlace:
  ```
  https://i.imgur.com/D9SIhvS.jpeg
  ```
  por el enlace de tu imagen personalizada.

- **Modifica el tamaño**:  
  Cambia estos valores en el script para ajustar ancho y alto:
  ```javascript
  img.width = TU_ANCHO;
  img.height = TU_ALTO;
  ```

- Guarda y recarga Google para ver tu nuevo logo.

---

## ✅ License

This project is shared for educational and personal customization purposes.  
Not affiliated with Google Inc.
