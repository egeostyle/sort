/**
 * Pecera Social - Shortcuts & Mobile Guide Generator
 * Prepares interactive setup guides, configuration templates, and testing utilities
 * for iOS Shortcuts (Yenka's iPhone) and Android (George's Android).
 */

import { firebaseSync } from './firebase-sync.js';

export class ShortcutsGuide {
  constructor() {}

  /**
   * Generates the iOS Shortcut JSON / step-by-step definition
   */
  getIosShortcutDetails(senderName = 'Yenka') {
    const apiInfo = firebaseSync.getRestApiInfo(senderName);
    
    return {
      title: `Sumergir en Pecera (${senderName})`,
      iconName: 'fish',
      sender: senderName,
      endpoint: apiInfo.endpoint,
      payloadTemplate: {
        fields: {
          url: { stringValue: "REEMPLAZAR_POR_URL_COMPARTIDA" },
          sender: { stringValue: senderName },
          title: { stringValue: `Reel / Video de ${senderName}` },
          platform: { stringValue: "instagram" },
          mediaType: { stringValue: "video" },
          categoryId: { stringValue: "cat-general" },
          createdAt: { stringValue: "ISO_TIMESTAMP_ACTUAL" }
        }
      },
      steps: [
        {
          num: 1,
          text: 'Abre la app **Atajos (Shortcuts)** en el iPhone de Yenka y toca el botón **"+"** (arriba a la derecha) para crear un nuevo atajo.'
        },
        {
          num: 2,
          text: 'Nombra el atajo: **"Sumergir en Pecera"** y toca el ícono para asignarle color magenta/cian o la foto de ustedes.'
        },
        {
          num: 3,
          text: 'Toca la **"i"** de información (abajo) y activa la opción: **"Mostrar en la hoja para compartir"** (Share Sheet). En tipos de entrada selecciona solo: **URLs** y **Texto**.'
        },
        {
          num: 4,
          text: 'Añade la acción: **"Obtener contenido de la URL"** (Get Contents of URL).'
        },
        {
          num: 5,
          text: `En la acción de URL, pega el endpoint que aparece arriba.`
        },
        {
          num: 6,
          text: 'Cambia el método a **POST** → Cabecera: `Content-Type: application/json` → Cuerpo de la petición (JSON) con el enlace y remitente "Yenka".'
        },
        {
          num: 7,
          text: 'Añade la acción final: **"Mostrar notificación"** → *"🎟️ ¡Boleto de Yenka sumergido en la Pecera! 🐟"*.'
        }
      ]
    };
  }

  /**
   * Generates HTTP Shortcuts configuration file for Android
   */
  getAndroidShortcutDetails(senderName = 'George') {
    const apiInfo = firebaseSync.getRestApiInfo(senderName);

    return {
      title: `Sumergir en Pecera (${senderName})`,
      sender: senderName,
      endpoint: apiInfo.endpoint,
      pwaShareTargetUrl: './index.html?url=',
      stepsPWA: [
        {
          num: 1,
          text: 'Abre la webapp de la Pecera en Google Chrome o tu navegador en tu Android.'
        },
        {
          num: 2,
          text: 'Toca los 3 puntos del navegador → **"Instalar aplicación"** o **"Agregar a pantalla principal"**.'
        },
        {
          num: 3,
          text: '¡Listo! Cuando estés en Instagram o TikTok y toques **Compartir**, verás en la lista de apps el ícono de **Pecera Social** (con la foto de George & Yenka). Al tocarlo, el video se sumerge automáticamente.'
        }
      ],
      stepsHttpShortcuts: [
        {
          num: 1,
          text: 'Instala la app gratuita y ligera **HTTP Shortcuts** desde Google Play Store.'
        },
        {
          num: 2,
          text: 'Crea un nuevo atajo tipo **HTTP Request** → URL: `' + apiInfo.endpoint + '` → Método: **POST**.'
        },
        {
          num: 3,
          text: 'En el menú del atajo activa **"Share into Shortcut"** (Compartir hacia el atajo) para que aparezca en el menú nativo de compartir sin salir de Instagram.'
        }
      ]
    };
  }

  /**
   * Quick test function to simulate an external ticket submission
   */
  async simulateExternalShare(sender = 'Yenka', url = 'https://www.instagram.com/reel/C3SampleReel') {
    const isYenka = sender.toLowerCase().includes('yenka');
    const platform = url.includes('tiktok') ? 'tiktok' : 'instagram';
    
    const sampleTitles = isYenka ? [
      '¡Mira este reel increíble que encontré! ✨',
      'Video divertido para el sorteo 💖',
      'Lugar que tenemos que visitar juntos 🌴',
      'Receta / Tip imperdible 🌸'
    ] : [
      'Reel viral recomendado por George 🔥',
      'Video top para la pecera 🕶️',
      'Plan genial para el fin de semana 🚀',
      'Meme buenísimo que vi en Instagram 😂'
    ];

    const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

    return {
      id: 'tkt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      url: url,
      platform: platform,
      title: randomTitle,
      author: isYenka ? '@yenka_reels' : '@george_picks',
      thumbnail: 'assets/icon-192.png',
      mediaType: 'reel',
      categoryId: 'cat-viral',
      sender: isYenka ? 'Yenka' : 'George',
      createdAt: new Date().toISOString()
    };
  }
}

export const shortcutsGuide = new ShortcutsGuide();
