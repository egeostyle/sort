/**
 * Pecera Social - Social Media Parser & Resolver
 * High-performance URL analysis, robust metadata extraction & premium branded visual cards.
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
 * Escapes unsafe characters for SVG text
 */
function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Extracts and sanitizes social media URLs by removing tracking tags,
 * locale parameters, share wrappers and extraneous query strings.
 */
export function extractAndCleanUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const trimmed = rawInput.trim();

  // Extract URL pattern from input string (handling any preface text like "Mira este video https://...")
  const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/i;
  const match = trimmed.match(urlRegex);
  if (!match) return null;

  let urlStr = match[1];
  if (urlStr.toLowerCase().startsWith('www.')) {
    urlStr = 'https://' + urlStr;
  }

  // Strip trailing punctuation like periods or parentheses from text sharing
  urlStr = urlStr.replace(/[.,;!?)]+$/, '');

  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // 1. FACEBOOK
    if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) {
      if (host.includes('fb.watch')) {
        const code = pathname.replace(/^\/+/, '').split('/')[0];
        return {
          cleanUrl: code ? `https://fb.watch/${code}/` : urlStr,
          rawUrl: urlStr,
          platform: 'facebook'
        };
      }

      // /reel/ID or /reels/ID
      const reelMatch = pathname.match(/\/reels?\/([^/?#]+)/i);
      if (reelMatch) {
        return {
          cleanUrl: `https://www.facebook.com/reel/${reelMatch[1]}`,
          rawUrl: urlStr,
          platform: 'facebook'
        };
      }

      // /share/r/ID (reels), /share/v/ID (video) or /share/p/ID (posts)
      const shareMatch = pathname.match(/\/share\/([rvp])\/([^/?#]+)/i);
      if (shareMatch) {
        const id = shareMatch[2];
        return {
          cleanUrl: `https://www.facebook.com/reel/${id}`,
          rawUrl: urlStr,
          platform: 'facebook'
        };
      }

      // /watch/?v=ID
      if (pathname.includes('/watch')) {
        const v = parsed.searchParams.get('v');
        if (v) {
          return {
            cleanUrl: `https://www.facebook.com/watch/?v=${v}`,
            rawUrl: urlStr,
            platform: 'facebook'
          };
        }
      }

      // /[user]/videos/[id] or /[user]/posts/[id] or /[user]/reels/[id]
      const userMediaMatch = pathname.match(/^\/([^/]+)\/(videos|posts|reels)\/([^/?#]+)/i);
      if (userMediaMatch) {
        const user = userMediaMatch[1];
        const kind = userMediaMatch[2].toLowerCase();
        const id = userMediaMatch[3];
        return {
          cleanUrl: `https://www.facebook.com/${user}/${kind}/${id}/`,
          rawUrl: urlStr,
          platform: 'facebook'
        };
      }

      // Generic Facebook fallback without tracking params
      return {
        cleanUrl: `https://www.facebook.com${pathname.replace(/\/+$/, '')}`,
        rawUrl: urlStr,
        platform: 'facebook'
      };
    }

    // 2. INSTAGRAM
    if (host.includes('instagram.com') || host.includes('instagr.am')) {
      const reelMatch = pathname.match(/\/reels?\/([^/?#]+)/i);
      if (reelMatch) {
        return {
          cleanUrl: `https://www.instagram.com/reel/${reelMatch[1]}/`,
          rawUrl: urlStr,
          platform: 'instagram'
        };
      }

      const pMatch = pathname.match(/\/p\/([^/?#]+)/i);
      if (pMatch) {
        return {
          cleanUrl: `https://www.instagram.com/p/${pMatch[1]}/`,
          rawUrl: urlStr,
          platform: 'instagram'
        };
      }

      const shareMatch = pathname.match(/\/share\/(?:reel|p)\/([^/?#]+)/i);
      if (shareMatch) {
        return {
          cleanUrl: `https://www.instagram.com/reel/${shareMatch[1]}/`,
          rawUrl: urlStr,
          platform: 'instagram'
        };
      }

      return {
        cleanUrl: `https://www.instagram.com${pathname}`,
        rawUrl: urlStr,
        platform: 'instagram'
      };
    }

    // 3. TIKTOK
    if (host.includes('tiktok.com')) {
      if (host.includes('vm.tiktok.com') || host.includes('vt.tiktok.com')) {
        const code = pathname.replace(/^\/+/, '').split('/')[0];
        return {
          cleanUrl: `https://${host}/${code}/`,
          rawUrl: urlStr,
          platform: 'tiktok'
        };
      }

      const videoMatch = pathname.match(/(@[^/]+)\/video\/(\d+)/i);
      if (videoMatch) {
        return {
          cleanUrl: `https://www.tiktok.com/${videoMatch[1]}/video/${videoMatch[2]}`,
          rawUrl: urlStr,
          platform: 'tiktok'
        };
      }

      return {
        cleanUrl: `https://www.tiktok.com${pathname}`,
        rawUrl: urlStr,
        platform: 'tiktok'
      };
    }

    // 4. YOUTUBE
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      if (host.includes('youtu.be')) {
        const id = pathname.replace(/^\/+/, '').split('/')[0];
        return {
          cleanUrl: `https://youtu.be/${id}`,
          rawUrl: urlStr,
          platform: 'youtube'
        };
      }
      if (pathname.includes('/shorts/')) {
        const id = pathname.split('/shorts/')[1]?.split('/')[0];
        return {
          cleanUrl: `https://www.youtube.com/shorts/${id}`,
          rawUrl: urlStr,
          platform: 'youtube'
        };
      }
      const v = parsed.searchParams.get('v');
      if (v) {
        return {
          cleanUrl: `https://www.youtube.com/watch?v=${v}`,
          rawUrl: urlStr,
          platform: 'youtube'
        };
      }
    }

    // 5. GENERIC: Strip marketing/tracking parameters
    const generic = new URL(urlStr);
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', 'ref', 'source', 'locale', 'mibextid',
      'igsh', 'igshid', '_r', '_t', 'is_from_webapp', 'sender_device'
    ];
    trackingParams.forEach(p => generic.searchParams.delete(p));

    return {
      cleanUrl: generic.toString(),
      rawUrl: urlStr,
      platform: 'generic'
    };
  } catch (err) {
    return {
      cleanUrl: urlStr,
      rawUrl: urlStr,
      platform: 'generic'
    };
  }
}

/**
 * Parses any incoming URL to determine platform, author, mediaType, code and meaningful title
 */
export function detectPlatform(urlString) {
  try {
    const cleanExtraction = extractAndCleanUrl(urlString);
    const cleanUrl = cleanExtraction ? cleanExtraction.cleanUrl : urlString.trim();
    const url = new URL(cleanUrl);
    const host = url.hostname.toLowerCase();
    const path = url.pathname;
    const parts = path.split('/').filter(Boolean);

    // ==========================================
    // 1. INSTAGRAM
    // ==========================================
    if (host.includes('instagram.com') || host.includes('instagr.am')) {
      let mediaType = 'post';
      let title = 'Publicación de Instagram';
      let author = '@instagram_creator';
      let parsedId = 'post';

      // Check for user-specific path: /[user]/reel/[code] or /[user]/p/[code]
      if (parts.length >= 3 && ['reel', 'reels', 'p'].includes(parts[1])) {
        author = '@' + parts[0];
        const kind = parts[1].startsWith('reel') ? 'reel' : 'post';
        mediaType = kind;
        parsedId = parts[2];
        const kindLabel = kind === 'reel' ? 'Reel' : 'Publicación';
        title = `${kindLabel} de ${parts[0]} (${parsedId})`;
        return { platform: PLATFORMS.INSTAGRAM, mediaType, author, title, parsedId };
      }

      // Check for /share/reel/[code]
      const shareMatch = path.match(/\/share\/reel\/([^/?#]+)/i);
      if (shareMatch) {
        parsedId = shareMatch[1];
        return {
          platform: PLATFORMS.INSTAGRAM,
          mediaType: 'reel',
          author: '@instagram_creator',
          title: `Reel de Instagram (${parsedId})`,
          parsedId
        };
      }

      // Check for /reel/[code] or /reels/[code]
      const reelMatch = path.match(/\/reels?\/([^/?#]+)/i);
      if (reelMatch) {
        parsedId = reelMatch[1];
        return {
          platform: PLATFORMS.INSTAGRAM,
          mediaType: 'reel',
          author: '@instagram_creator',
          title: `Reel de Instagram (${parsedId})`,
          parsedId
        };
      }

      // Check for /p/[code]
      const pMatch = path.match(/\/p\/([^/?#]+)/i);
      if (pMatch) {
        parsedId = pMatch[1];
        return {
          platform: PLATFORMS.INSTAGRAM,
          mediaType: 'post',
          author: '@instagram_creator',
          title: `Publicación de Instagram (${parsedId})`,
          parsedId
        };
      }

      // Check for stories
      if (path.includes('/stories/')) {
        const storyUser = parts[1] || 'creator';
        return {
          platform: PLATFORMS.INSTAGRAM,
          mediaType: 'story',
          author: '@' + storyUser,
          title: `Historia de @${storyUser}`,
          parsedId: parts[2] || 'story'
        };
      }

      // Fallback path extraction
      if (parts.length > 0 && !['explore', 'direct'].includes(parts[0])) {
        author = '@' + parts[0];
        title = `Publicación de ${parts[0]}`;
        parsedId = parts[parts.length - 1];
      }

      return {
        platform: PLATFORMS.INSTAGRAM,
        mediaType,
        author,
        title,
        parsedId
      };
    }

    // ==========================================
    // 2. FACEBOOK
    // ==========================================
    if (host.includes('facebook.com') || host.includes('fb.watch')) {
      let mediaType = 'post';
      let author = 'Facebook Creator';
      let title = 'Publicación de Facebook';
      let parsedId = 'fb_post';

      // fb.watch shortlinks: fb.watch/XYZ/
      if (host.includes('fb.watch')) {
        const code = path.replace(/^\/+/, '').split('/')[0] || 'reel';
        return {
          platform: PLATFORMS.FACEBOOK,
          mediaType: 'reel',
          author: 'Facebook Watch',
          title: `Reel de Facebook (${code})`,
          parsedId: code
        };
      }

      // /share/r/ID (reel), /share/v/ID (video), /share/p/ID (post)
      const shareMatch = path.match(/\/share\/([rvp])\/([^/?#]+)/i);
      if (shareMatch) {
        const typeChar = shareMatch[1].toLowerCase();
        parsedId = shareMatch[2];
        if (typeChar === 'r') {
          mediaType = 'reel';
          title = `Reel de Facebook #${parsedId}`;
        } else if (typeChar === 'v') {
          mediaType = 'video';
          title = `Video de Facebook #${parsedId}`;
        } else {
          mediaType = 'post';
          title = `Publicación de Facebook #${parsedId}`;
        }
        return { platform: PLATFORMS.FACEBOOK, mediaType, author: 'Facebook Creator', title, parsedId };
      }

      // /reel/ID or /reels/ID
      const reelMatch = path.match(/\/reels?\/([^/?#]+)/i);
      if (reelMatch) {
        parsedId = reelMatch[1];
        return {
          platform: PLATFORMS.FACEBOOK,
          mediaType: 'reel',
          author: 'Facebook Creator',
          title: `Reel de Facebook (${parsedId})`,
          parsedId
        };
      }

      // /watch/?v=ID
      if (path.includes('/watch')) {
        const v = url.searchParams.get('v') || '';
        parsedId = v || 'watch';
        return {
          platform: PLATFORMS.FACEBOOK,
          mediaType: 'video',
          author: 'Facebook Watch',
          title: v ? `Video de Facebook (${v})` : 'Video de Facebook',
          parsedId
        };
      }

      // /[page]/videos/[id] or /[page]/posts/[id] or /[page]/reels/[id]
      const userMediaMatch = path.match(/^\/([^/]+)\/(videos|posts|reels)\/([^/?#]+)/i);
      if (userMediaMatch) {
        const user = decodeURIComponent(userMediaMatch[1]);
        const kind = userMediaMatch[2].toLowerCase();
        parsedId = userMediaMatch[3];
        const kindLabel = kind === 'reels' ? 'Reel' : (kind === 'videos' ? 'Video' : 'Post');
        mediaType = kind === 'reels' ? 'reel' : (kind === 'videos' ? 'video' : 'post');
        return {
          platform: PLATFORMS.FACEBOOK,
          mediaType,
          author: `@${user}`,
          title: `${kindLabel} de ${user} (#${parsedId})`,
          parsedId
        };
      }

      // Generic Facebook page path
      if (parts.length > 0 && !['home.php', 'login', 'watch'].includes(parts[0])) {
        author = '@' + parts[0];
        title = `Publicación de ${parts[0]}`;
        parsedId = parts[parts.length - 1];
      }

      return {
        platform: PLATFORMS.FACEBOOK,
        mediaType,
        author,
        title,
        parsedId
      };
    }

    // ==========================================
    // 3. TIKTOK
    // ==========================================
    if (host.includes('tiktok.com')) {
      let author = '@tiktok_user';
      let title = 'Video de TikTok';
      let parsedId = 'video';

      if (parts[0] && parts[0].startsWith('@')) {
        author = parts[0];
      }
      if (parts.length > 0) {
        parsedId = parts[parts.length - 1];
        title = `Video de ${author}`;
      }

      return {
        platform: PLATFORMS.TIKTOK,
        mediaType: 'video',
        author,
        title,
        parsedId
      };
    }

    // ==========================================
    // 4. YOUTUBE
    // ==========================================
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
        author: 'YouTube',
        title: 'Video de YouTube',
        parsedId: videoId
      };
    }

    // ==========================================
    // 5. GENERIC WEB
    // ==========================================
    return {
      platform: PLATFORMS.GENERIC,
      mediaType: 'link',
      author: host.replace(/^www\./, ''),
      title: `Enlace Web (${host})`,
      parsedId: 'link'
    };
  } catch (err) {
    return null;
  }
}

/**
 * Generates a high-fidelity, vibrant SVG social preview card.
 * Used for instant display and robust offline / hotlinking-proof fallback.
 */
export function generatePlaceholderSvg(platform, title, author, mediaType, code) {
  const p = (platform?.id || 'generic').toLowerCase();
  const safeAuthor = escapeXml(author || `@${platform?.name?.toLowerCase() || 'social'}`);
  const safeCode = escapeXml(code ? (code.startsWith('#') ? code : '#' + code) : '');
  const badgeType = escapeXml((mediaType || 'post').toUpperCase());

  let bgDefs = '';
  let iconSvg = '';
  let accentColor = '#00E5FF';
  let watermarkText = platform?.name?.toUpperCase() || 'SOCIAL';

  if (p === 'instagram') {
    accentColor = '#E1306C';
    watermarkText = 'INSTAGRAM';
    bgDefs = `
      <radialGradient id="igGlow" cx="15%" cy="10%" r="95%">
        <stop offset="0%" stop-color="#FFDC80"/>
        <stop offset="18%" stop-color="#FCAF45"/>
        <stop offset="38%" stop-color="#F77737"/>
        <stop offset="55%" stop-color="#F56040"/>
        <stop offset="72%" stop-color="#FD1D1D"/>
        <stop offset="85%" stop-color="#E1306C"/>
        <stop offset="92%" stop-color="#C13584"/>
        <stop offset="100%" stop-color="#833AB4"/>
      </radialGradient>
      <linearGradient id="cardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.06"/>
      </linearGradient>
    `;
    iconSvg = `
      <g transform="translate(145, 120) scale(4.5)" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4.2"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="#ffffff" stroke="none"/>
      </g>
    `;
  } else if (p === 'facebook') {
    accentColor = '#1877F2';
    watermarkText = 'FACEBOOK';
    bgDefs = `
      <linearGradient id="fbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1877F2"/>
        <stop offset="45%" stop-color="#0E5AC8"/>
        <stop offset="100%" stop-color="#062F76"/>
      </linearGradient>
      <linearGradient id="cardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.08"/>
      </linearGradient>
      <radialGradient id="fbLight" cx="30%" cy="20%" r="70%">
        <stop offset="0%" stop-color="#4B9AFF" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#062F76" stop-opacity="0"/>
      </radialGradient>
    `;
    iconSvg = `
      <g transform="translate(140, 115)">
        <circle cx="60" cy="60" r="56" fill="#ffffff"/>
        <path d="M68.5 62.5H78L79.5 50H68.5V42C68.5 38.5 70 35 75.5 35H80V24.5C80 24.5 76 24 72 24C63.5 24 58 29.2 58 38.5V50H48V62.5H58V96H68.5V62.5Z" fill="#1877F2"/>
      </g>
    `;
  } else if (p === 'tiktok') {
    accentColor = '#25F4EE';
    watermarkText = 'TIKTOK';
    bgDefs = `
      <linearGradient id="ttBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F1117"/>
        <stop offset="100%" stop-color="#010101"/>
      </linearGradient>
      <radialGradient id="ttCyan" cx="20%" cy="30%" r="55%">
        <stop offset="0%" stop-color="#25F4EE" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="ttRed" cx="80%" cy="70%" r="55%">
        <stop offset="0%" stop-color="#FE2C55" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
      </linearGradient>
    `;
    iconSvg = `
      <g transform="translate(140, 110) scale(4.8)">
        <path d="M12.5 0c1.3 0 2.6 0 3.9 0 .1 1.5.6 3.1 1.7 4.2 1.1 1.1 2.7 1.6 4.2 1.8v4c-1.4 0-2.9-.3-4.2-1-.6-.3-1.1-.6-1.6-.9 0 2.9 0 5.8 0 8.7-.1 1.4-.5 2.8-1.3 3.9-1.3 1.9-3.6 3.2-5.9 3.2-1.4.1-2.9-.3-4.1-1-2-1.2-3.4-3.4-3.6-5.7 0-.5 0-1 0-1.5.2-1.9 1.1-3.7 2.6-5 1.7-1.4 4-2.1 6.1-1.7v4.4c-1-.3-2.1-.2-3 .4-.6.4-1.1 1-1.4 1.7-.2.5-.2 1.1-.1 1.6.2 1.6 1.8 2.9 3.5 2.8 1.4 0 2.6-.9 3-2.1.2-.6.3-1.3.3-1.9 0-4.9 0-9.8 0-14.7z" fill="#25F4EE" transform="translate(-1, -1)"/>
        <path d="M12.5 0c1.3 0 2.6 0 3.9 0 .1 1.5.6 3.1 1.7 4.2 1.1 1.1 2.7 1.6 4.2 1.8v4c-1.4 0-2.9-.3-4.2-1-.6-.3-1.1-.6-1.6-.9 0 2.9 0 5.8 0 8.7-.1 1.4-.5 2.8-1.3 3.9-1.3 1.9-3.6 3.2-5.9 3.2-1.4.1-2.9-.3-4.1-1-2-1.2-3.4-3.4-3.6-5.7 0-.5 0-1 0-1.5.2-1.9 1.1-3.7 2.6-5 1.7-1.4 4-2.1 6.1-1.7v4.4c-1-.3-2.1-.2-3 .4-.6.4-1.1 1-1.4 1.7-.2.5-.2 1.1-.1 1.6.2 1.6 1.8 2.9 3.5 2.8 1.4 0 2.6-.9 3-2.1.2-.6.3-1.3.3-1.9 0-4.9 0-9.8 0-14.7z" fill="#FE2C55" transform="translate(1, 1)"/>
        <path d="M12.5 0c1.3 0 2.6 0 3.9 0 .1 1.5.6 3.1 1.7 4.2 1.1 1.1 2.7 1.6 4.2 1.8v4c-1.4 0-2.9-.3-4.2-1-.6-.3-1.1-.6-1.6-.9 0 2.9 0 5.8 0 8.7-.1 1.4-.5 2.8-1.3 3.9-1.3 1.9-3.6 3.2-5.9 3.2-1.4.1-2.9-.3-4.1-1-2-1.2-3.4-3.4-3.6-5.7 0-.5 0-1 0-1.5.2-1.9 1.1-3.7 2.6-5 1.7-1.4 4-2.1 6.1-1.7v4.4c-1-.3-2.1-.2-3 .4-.6.4-1.1 1-1.4 1.7-.2.5-.2 1.1-.1 1.6.2 1.6 1.8 2.9 3.5 2.8 1.4 0 2.6-.9 3-2.1.2-.6.3-1.3.3-1.9 0-4.9 0-9.8 0-14.7z" fill="#FFFFFF"/>
      </g>
    `;
  } else if (p === 'youtube') {
    accentColor = '#FF0000';
    watermarkText = 'YOUTUBE';
    bgDefs = `
      <linearGradient id="ytBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E50914"/>
        <stop offset="60%" stop-color="#990000"/>
        <stop offset="100%" stop-color="#3A0000"/>
      </linearGradient>
      <linearGradient id="cardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.06"/>
      </linearGradient>
    `;
    iconSvg = `
      <g transform="translate(135, 125)">
        <rect width="130" height="90" rx="24" fill="#ffffff"/>
        <polygon points="52,30 88,45 52,60" fill="#FF0000"/>
      </g>
    `;
  } else {
    accentColor = '#00E5FF';
    watermarkText = 'WEB';
    bgDefs = `
      <linearGradient id="webBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0288D1"/>
        <stop offset="50%" stop-color="#01579B"/>
        <stop offset="100%" stop-color="#001833"/>
      </linearGradient>
      <linearGradient id="cardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
      </linearGradient>
    `;
    iconSvg = `
      <g transform="translate(145, 120) scale(4.5)" fill="none" stroke="#ffffff" stroke-width="1.8">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </g>
    `;
  }

  const bgFill = p === 'instagram' ? 'url(#igGlow)' : (p === 'facebook' ? 'url(#fbGrad)' : (p === 'tiktok' ? 'url(#ttBg)' : (p === 'youtube' ? 'url(#ytBg)' : 'url(#webBg)')));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      ${bgDefs}
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.4"/>
      </filter>
    </defs>

    <!-- Main Background -->
    <rect width="400" height="400" fill="${bgFill}"/>
    ${p === 'facebook' ? '<rect width="400" height="400" fill="url(#fbLight)"/>' : ''}
    ${p === 'tiktok' ? '<rect width="400" height="400" fill="url(#ttCyan)"/><rect width="400" height="400" fill="url(#ttRed)"/>' : ''}

    <!-- Decorative Geometric Rings -->
    <circle cx="200" cy="180" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
    <circle cx="200" cy="180" r="120" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1.5" stroke-dasharray="6,6"/>

    <!-- Frosted Glass Card Container -->
    <rect x="24" y="24" width="352" height="352" rx="28" fill="url(#cardGlass)" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.2" filter="url(#shadow)"/>

    <!-- Top Badge Row -->
    <g transform="translate(42, 44)">
      <rect x="0" y="0" width="76" height="28" rx="14" fill="#000000" fill-opacity="0.55"/>
      <text x="38" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">${badgeType}</text>
    </g>

    <!-- Watermark Brand on Top Right -->
    <g transform="translate(358, 64)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#ffffff" fill-opacity="0.6" text-anchor="end" letter-spacing="1.5">${watermarkText}</text>
    </g>

    <!-- Center Icon -->
    <g filter="url(#shadow)">
      ${iconSvg}
    </g>

    <!-- Bottom Content Card Overlay -->
    <rect x="36" y="270" width="328" height="94" rx="20" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1"/>
    
    <!-- Author / User Handle -->
    <text x="56" y="306" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" fill="#ffffff" filter="url(#shadow)">${safeAuthor}</text>
    
    <!-- Code or Subtitle -->
    <text x="56" y="330" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="${accentColor}" letter-spacing="0.5">${safeCode || badgeType}</text>
    
    <!-- Action / Play Emblem on Bottom Right -->
    <g transform="translate(322, 305)">
      <circle cx="12" cy="12" r="16" fill="${accentColor}" fill-opacity="0.25"/>
      <circle cx="12" cy="12" r="11" fill="${accentColor}"/>
      <polygon points="9,7 18,12 9,17" fill="#ffffff"/>
    </g>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/**
 * Checks whether an extracted title is a generic gatekeeper string rather than actual content
 */
function isGarbageTitle(title, parsedId) {
  if (!title) return true;
  const t = title.trim().toLowerCase();
  if (t.length <= 2) return true;
  if (parsedId && (t === parsedId.toLowerCase() || t === ('#' + parsedId).toLowerCase())) return true;
  const badPhrases = [
    'log in or sign up to view',
    'log in to view',
    'iniciar sesión',
    'iniciar sesión o registrarte',
    'login • instagram',
    'post isn\'t available',
    'facebook',
    'instagram',
    'tiktok',
    'untitled',
    'security check',
    'just a moment'
  ];
  return badPhrases.some(b => t === b || t.startsWith(b));
}

/**
 * Checks whether an extracted thumbnail is a login icon or placeholder
 */
function isGarbageThumbnail(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  if (u.includes('rsrc.php') || u.includes('static.xx.fbcdn.net') || u.includes('static.cdninstagram.com')) {
    return true;
  }
  return false;
}

const METADATA_CACHE_KEY = 'sorteitos_metadata_cache_v1';

function getCachedMetadata(url) {
  try {
    const raw = localStorage.getItem(METADATA_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const item = cache[url];
    // Cache is valid for 7 days
    if (item && item.timestamp && (Date.now() - item.timestamp < 7 * 24 * 3600 * 1000)) {
      return item.data;
    }
  } catch (e) {}
  return null;
}

function setCachedMetadata(url, data) {
  try {
    const raw = localStorage.getItem(METADATA_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[url] = { timestamp: Date.now(), data };
    const keys = Object.keys(cache);
    if (keys.length > 150) {
      delete cache[keys[0]];
    }
    localStorage.setItem(METADATA_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

export const DEFAULT_WORKER_URL = 'https://sorteos-preview.geoestereo.workers.dev/';

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Resolves metadata using cascading strategies:
 * 1. Local memory/localStorage cache (instant, 0 network)
 * 2. Native open oEmbed (TikTok, YouTube)
 * 3. Scraper APIs (Microlink with optional API key & proxying)
 * 4. High-fidelity synthetic card generator & smart URL parser
 */
export async function resolveSocialMetadata(rawUrl) {
  const cleanExtraction = extractAndCleanUrl(rawUrl);
  const cleanUrl = cleanExtraction ? cleanExtraction.cleanUrl : (rawUrl || '').trim();
  const detected = detectPlatform(cleanUrl);
  if (!detected) {
    throw new Error('URL inválida o no soportada');
  }

  // Strategy 0: Cache lookup
  const cached = getCachedMetadata(cleanUrl);
  if (cached) {
    return { ...cached, url: cleanUrl };
  }

  const { platform, mediaType, author, title, parsedId } = detected;
  const brandedSvg = generatePlaceholderSvg(platform, title, author, mediaType, parsedId);

  // Initialize result with high-fidelity defaults using clean URL
  const result = {
    url: cleanUrl,
    platform: platform.id,
    platformName: platform.name,
    color: platform.color,
    author: author,
    title: title,
    mediaType: mediaType,
    thumbnail: brandedSvg,
    fallbackSvg: brandedSvg
  };

  // Strategy A: YouTube direct thumbnail + title
  if (platform.id === 'youtube' && parsedId) {
    result.thumbnail = `https://img.youtube.com/vi/${parsedId}/hqdefault.jpg`;
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title && !isGarbageTitle(data.title, parsedId)) result.title = data.title;
        if (data.author_name) result.author = data.author_name;
      }
    } catch (e) {
      // Fallback works automatically
    }
    setCachedMetadata(cleanUrl, result);
    return result;
  }

  // Strategy B: TikTok oEmbed (returns real caption and thumbnail!)
  if (platform.id === 'tiktok') {
    try {
      const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title && !isGarbageTitle(data.title, parsedId)) result.title = data.title;
        if (data.author_name) result.author = '@' + data.author_name;
        if (data.thumbnail_url && !isGarbageThumbnail(data.thumbnail_url)) {
          result.thumbnail = data.thumbnail_url;
        }
        setCachedMetadata(cleanUrl, result);
        return result;
      }
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Strategy C: Cloudflare Worker (Primary dedicated scraper with 100,000 free requests/day)
  try {
    let workerBase = DEFAULT_WORKER_URL;
    try {
      workerBase = localStorage.getItem('sorteitos_worker_url') || DEFAULT_WORKER_URL;
    } catch (e) {}

    if (workerBase && workerBase.trim()) {
      const workerUrl = `${workerBase.trim().replace(/\/$/, '')}/?url=${encodeURIComponent(cleanUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(workerUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'success') {
          let hasUpdated = false;
          if (json.title && !isGarbageTitle(json.title, parsedId)) {
            result.title = decodeHtmlEntities(json.title);
            hasUpdated = true;
          }
          if (json.author && !isGarbageTitle(json.author, parsedId)) {
            result.author = decodeHtmlEntities(json.author);
            hasUpdated = true;
          }
          if (json.image && !isGarbageThumbnail(json.image)) {
            let thumb = json.image;
            if (thumb.includes('cdninstagram.com') || thumb.includes('fbcdn.net')) {
              result.thumbnail = `https://images.weserv.nl/?url=${encodeURIComponent(thumb)}`;
            } else {
              result.thumbnail = thumb;
            }
            hasUpdated = true;
          }
          if (hasUpdated) {
            setCachedMetadata(cleanUrl, result);
            return result;
          }
        }
      }
    }
  } catch (e) {
    // Continue to Microlink fallback
  }

  // Strategy D: Microlink API (Secondary fallback with optional user API key)
  try {
    let userApiKey = '';
    try {
      userApiKey = localStorage.getItem('sorteitos_microlink_key') || '';
    } catch (e) {}

    let microlinkEndpoint = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`;
    if (userApiKey && userApiKey.trim()) {
      microlinkEndpoint += `&apiKey=${encodeURIComponent(userApiKey.trim())}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(microlinkEndpoint, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const d = json.data;
        if (d.title && !isGarbageTitle(d.title, parsedId)) {
          result.title = d.title;
        }
        if (d.author && !isGarbageTitle(d.author, parsedId)) {
          result.author = d.author.startsWith('@') ? d.author : `@${d.author}`;
        }
        if (d.image?.url && !isGarbageThumbnail(d.image.url)) {
          let thumbUrl = d.image.url;
          // Proxy through weserv for CDN permanence and CORS protection
          if (thumbUrl.includes('cdninstagram.com') || thumbUrl.includes('fbcdn.net')) {
            result.thumbnail = `https://images.weserv.nl/?url=${encodeURIComponent(thumbUrl)}`;
          } else {
            result.thumbnail = thumbUrl;
          }
        }
        setCachedMetadata(cleanUrl, result);
        return result;
      }
    }
  } catch (e) {
    // Microlink timed out or was blocked; continue
  }

  // Strategy D: Noembed service (fallback)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.title && !isGarbageTitle(data.title, parsedId)) result.title = data.title;
      if (data.author_name) result.author = data.author_name;
      if (data.thumbnail_url && !isGarbageThumbnail(data.thumbnail_url)) {
        result.thumbnail = data.thumbnail_url;
      }
    }
  } catch (e) {
    // Fallback gracefully to smart reconstructed metadata and branded card
  }

  setCachedMetadata(cleanUrl, result);
  return result;
}

/**
 * Validates and heals thumbnails from saved tickets (e.g. replacing legacy dark placeholders or login icons)
 */
export function getValidThumbnail(thumb, platform, title, author, mediaType, id) {
  const fallbackSvg = generatePlaceholderSvg(platform, title, author, mediaType, id);
  if (!thumb) return fallbackSvg;
  if (typeof thumb !== 'string') return fallbackSvg;
  
  // Detect old legacy dark SVG
  if (thumb.includes('%23glow') || thumb.includes('#glow')) {
    return fallbackSvg;
  }
  // Detect login favicon / static CDN wall
  if (thumb.includes('rsrc.php') || thumb.includes('static.xx.fbcdn.net') || thumb.includes('static.cdninstagram.com')) {
    return fallbackSvg;
  }
  return thumb;
}
