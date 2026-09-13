# 🐟 Pecera Social - Sorteo Interactivo de Publicaciones

> Webapp lúdica, responsiva y de alto rendimiento diseñada con estética acuática moderna para almacenar enlaces de redes sociales (Instagram, TikTok, Facebook, YouTube, etc.) en forma de tickets sumergidos en una pecera interactiva y realizar sorteos aleatorios por categorías.

---

## 🚀 Características Principales

- **🎮 Experiencia Lúdica Inmersiva**: Pecera 3D/Glassmorphic interactiva con físicas visuales de flotación, ondulación de agua, burbujas dinámicas y animación cinemática de agitación (`shake`) al sortear.
- **🏷️ Gestión Multicategoría**: Cada categoría posee un color distintivo que tiñe los tickets sumergidos en la pecera.
- **📱 Extracción Inteligente de Redes**: Soporte nativo para enlaces de Instagram (Posts y Reels), TikTok, Facebook y YouTube con detección de plataforma y generador de tarjetas de previsualización.
- **💾 Persistencia Continua (`localStorage`)**: Los boletos se mantienen guardados permanentemente entre sesiones y días. Incluye sistema de exportación e importación JSON para respaldos.
- **🎵 Audio Procedural (Web Audio API)**: Efectos sonoros de burbujas, chapoteo de agua, agitación y fanfarria triunfal sin requerir archivos de audio externos (0 latencia, 0 peticiones de red).
- **🎉 Revelación Cinemática del Ganador**: Emergencia del ticket de la pecera con confeti a 60 FPS, enlace directo para abrir la publicación original y botón de reinicio instantáneo.

---

## 🏛️ Arquitectura del Proyecto

El proyecto está diseñado como una **Single Page Application (SPA) modular basada en estándares web puros (HTML5, CSS3 moderno, Vanilla ES Modules)**, ideal para ser alojada en **GitHub Pages** sin necesidad de pipelines de compilación complejos:

```
pecera-social-sorteo/
├── index.html              # Layout semántico, accesibilidad y modales nativos (<dialog>)
├── styles/
│   ├── main.css            # Reset moderno, ambientación oceánica y layout responsivo
│   ├── fishbowl.css        # Pecera de cristal, refracción, agua, oleaje y físicas de tickets
│   └── components.css      # Tarjetas de redes, tickets, selector de sorteo y tarjeta ganadora
├── scripts/
│   ├── app.js              # Controlador central y orquestación de la UI
│   ├── store.js            # Gestión de estado reactivo y persistencia local
│   ├── social.js           # Parser de URLs y motor de resolución de metadatos
│   ├── fishbowl.js         # Renderizado de tickets flotantes y animación de sorteo
│   ├── sound.js            # Sintetizador procedural de efectos sonoros acuáticos
│   └── confetti.js         # Motor de confeti en HTML5 Canvas para celebración
└── README.md               # Documentación arquitectónica
```

---

## 🌐 Consideraciones Técnicas y Límites en GitHub Pages

Al desplegar una aplicación puramente en el cliente mediante **GitHub Pages**, se deben tener presentes los siguientes límites técnicos del ecosistema web:

### 1. Restricciones de CORS en Redes Sociales (Meta & TikTok)
- **Instagram y Facebook**: Meta retiró el acceso público anónimo a sus endpoints de oEmbed en octubre de 2020. Cualquier petición `fetch()` directa desde el navegador hacia `instagram.com` o `facebook.com` es bloqueada por la política de mismo origen (CORS) y muros de autenticación.
- **TikTok**: Ofrece un endpoint público de oEmbed (`https://www.tiktok.com/oembed`), pero en ciertos navegadores o extensiones de bloqueo puede verse restringido.
- **Solución implementada**:
  La aplicación implementa una **estrategia de resolución en cascada (Graceful Degradation)**:
  1. *Estrategia A*: Extracción directa vía oEmbed público (TikTok, YouTube).
  2. *Estrategia B*: Proxy abierto de metadatos (Noembed).
  3. *Estrategia C (Fallback Robusto)*: Si la red o el navegador bloquea la consulta, se genera una tarjeta de previsualización sintética de alta fidelidad con la estética de la red social, ícono oficial, tipo de medio (Reel, Video, Post), autor inferido de la URL y enlace funcional de un solo toque.

### 2. Capacidad de Almacenamiento en `localStorage`
- `localStorage` ofrece aproximadamente 5MB por dominio. Dado que cada ticket almacena solo metadatos de texto y URLs (aprox. 300 bytes por ticket), la pecera puede almacenar de forma fiable **más de 15,000 enlaces** sin ningún problema de cuota.
- Se incluye función de **Exportar/Importar JSON** para permitir migrar enlaces entre dispositivos.

---

## 📦 Cómo Probar y Desplegar en GitHub

### Ejecución Local
Al usar ES Modules nativos, puedes abrir el proyecto con cualquier servidor estático local:

```bash
# Con Python 3
cd /Users/george/.gemini/antigravity/scratch/pecera-social-sorteo
python3 -m http.server 8080

# Con Node.js (npx serve)
npx serve .
```
Luego abre `http://localhost:8080` en tu navegador.

### Despliegue en GitHub Pages
1. Inicializa el repositorio Git en la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - pecera social sorteo"
   ```
2. Crea un repositorio en tu cuenta de GitHub (ej. `pecera-social`).
3. Conecta y sube el código:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/pecera-social.git
   git branch -M main
   git push -u origin main
   ```
4. En GitHub, ve a **Settings > Pages > Build and deployment**, selecciona la rama `main` y guarda.
5. Tu webapp estará disponible en vivo en `https://TU_USUARIO.github.io/pecera-social/`.

---

## 🎨 Personalización y Extensiones Futuras
- **Proxy Privado en Cloudflare Workers**: Si en el futuro deseas extraer automáticamente portadas de Instagram sin límites, puedes desplegar un Cloudflare Worker gratuito de 10 líneas que actúe como relay con tu Meta App Token.
- **Sorteo con Ruleta o Animación 3D**: La estructura modular de `fishbowl.js` permite intercambiar el renderizador de tickets por un lienzo Three.js o WebGL en caso de querer modelos tridimensionales con mayor complejidad física.
