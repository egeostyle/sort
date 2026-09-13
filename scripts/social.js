/**
 * Pecera Social - Social Media Parser & Resolver
 * High-performance URL analysis, oEmbed resolvers, platform badges & fallback card generators.
 */

export const PLATFORMS = {
  INSTAGRAM: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    iconSvg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
  },
  TIKTOK: {
    id: 'tiktok',
    name: 'TikTok',
    color: '#25F4EE',
    gradient: 'linear-gradient(135deg, #010101 0%, #161823 100%)',
    iconSvg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.75 1.35-.04 2.55-.86 2.97-2.13.23-.62.3-1.28.29-1.94.03-4.88.02-9.76.02-14.64z"/></svg>`
  },
  FACEBOOK: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877f2 0%, #0d47a1 100%)',
    iconSvg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  },
  YOUTUBE: {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    gradient: 'linear-gradient(135deg, #ff0000 0%, #b71c1c 100%)',
    iconSvg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
  },
  GENERIC: {
    id: 'generic',
    name: 'Web',
    color: '#00E5FF',
    gradient: 'linear-gradient(135deg, #10335e 0%, #081a33 100%)',
    iconSvg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  }
};

/**
 * Parses any incoming URL to determine platform, author and resource IDs
 */
export function detectPlatform(urlString) {
  try {
    const url = new URL(urlString.trim());
    const host = url.hostname.toLowerCase();
    const path = url.pathname;

    // Instagram
    if (host.includes('instagram.com') || host.includes('instagr.am')) {
      let mediaType = 'post';
      let title = 'Publicación de Instagram';
      let author = '@instagram_creator';

      if (path.includes('/reel/')) {
        mediaType = 'reel';
        title = 'Reel de Instagram';
      } else if (path.includes('/stories/')) {
        mediaType = 'story';
        title = 'Historia de Instagram';
      }

      // Try extract handle if path is /username/p/id
      const parts = path.split('/').filter(Boolean);
      if (parts.length >= 2 && !['p', 'reel', 'stories'].includes(parts[0])) {
        author = '@' + parts[0];
      }

      return {
        platform: PLATFORMS.INSTAGRAM,
        mediaType,
        author,
        title,
        parsedId: parts[parts.length - 1] || 'post'
      };
    }

    // TikTok
    if (host.includes('tiktok.com')) {
      const parts = path.split('/').filter(Boolean);
      let author = '@tiktok_user';
      if (parts[0] && parts[0].startsWith('@')) {
        author = parts[0];
      }
      return {
        platform: PLATFORMS.TIKTOK,
        mediaType: 'video',
        author,
        title: 'Video de TikTok',
        parsedId: parts[parts.length - 1] || 'video'
      };
    }

    // Facebook
    if (host.includes('facebook.com') || host.includes('fb.watch')) {
      return {
        platform: PLATFORMS.FACEBOOK,
        mediaType: path.includes('reel') ? 'reel' : 'post',
        author: 'Facebook Creator',
        title: 'Publicación de Facebook',
        parsedId: 'fb_post'
      };
    }

    // YouTube
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      let videoId = '';
      if (host.includes('youtu.be')) {
        videoId = path.replace('/', '');
      } else if (path.includes('/shorts/')) {
        videoId = path.split('/shorts/')[1]?.split('/')[0];
      } else {
        videoId = url.searchParams.get('v') || '';
      }
      return {
        platform: PLATFORMS.YOUTUBE,
        mediaType: path.includes('shorts') ? 'short' : 'video',
        author: 'YouTube Channel',
        title: 'Video de YouTube',
        parsedId: videoId
      };
    }

    // Generic
    return {
      platform: PLATFORMS.GENERIC,
      mediaType: 'link',
      author: url.hostname,
      title: 'Enlace Web Guardado',
      parsedId: 'link'
    };
  } catch (err) {
    return null;
  }
}

/**
 * Generates an SVG Data URI placeholder for when network/CORS prevents image loading
 */
export function generatePlaceholderSvg(platform, title, author) {
  const gradient = platform.gradient || PLATFORMS.GENERIC.gradient;
  const name = platform.name || 'Social';
  const displayAuthor = author ? author : '@social_post';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a192f"/>
        <stop offset="100%" stop-color="#020914"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${platform.color}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <circle cx="200" cy="180" r="160" fill="url(#glow)"/>
    <g transform="translate(170, 130) scale(2.5)">
      <circle cx="12" cy="12" r="12" fill="${platform.color}" fill-opacity="0.2"/>
    </g>
    <text x="200" y="240" font-family="-apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">${name}</text>
    <text x="200" y="270" font-family="-apple-system, sans-serif" font-size="14" fill="#94adc8" text-anchor="middle">${displayAuthor}</text>
    <circle cx="200" cy="160" r="26" fill="${platform.color}"/>
    <polygon points="194,147 212,160 194,173" fill="#ffffff"/>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/**
 * Resolves metadata using cascading strategies:
 * 1. Native open oEmbed (TikTok, YouTube)
 * 2. Public CORS fallback (Noembed)
 * 3. High-fidelity synthetic card generator
 */
export async function resolveSocialMetadata(rawUrl) {
  const detected = detectPlatform(rawUrl);
  if (!detected) {
    throw new Error('URL inválida o no soportada');
  }

  const { platform, mediaType, author, title, parsedId } = detected;

  // Initialize result with high-fidelity defaults
  const result = {
    url: rawUrl,
    platform: platform.id,
    platformName: platform.name,
    color: platform.color,
    author: author,
    title: title,
    mediaType: mediaType,
    thumbnail: generatePlaceholderSvg(platform, title, author)
  };

  // Strategy A: YouTube direct thumbnail
  if (platform.id === 'youtube' && parsedId) {
    result.thumbnail = `https://img.youtube.com/vi/${parsedId}/hqdefault.jpg`;
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(rawUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) result.title = data.title;
        if (data.author_name) result.author = data.author_name;
      }
    } catch (e) {
      // Fallback works automatically
    }
    return result;
  }

  // Strategy B: TikTok oEmbed
  if (platform.id === 'tiktok') {
    try {
      const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(rawUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) result.title = data.title;
        if (data.author_name) result.author = '@' + data.author_name;
        if (data.thumbnail_url) result.thumbnail = data.thumbnail_url;
        return result;
      }
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Strategy C: Noembed service (Supports IG/FB public links when accessible)
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(rawUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.title) result.title = data.title;
      if (data.author_name) result.author = data.author_name;
      if (data.thumbnail_url) result.thumbnail = data.thumbnail_url;
      return result;
    }
  } catch (e) {
    // If blocked by CORS or network, fallback gracefully
  }

  return result;
}
