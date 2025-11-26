/**
 * Utility to extract brand colors from domain/company name
 * Uses multiple strategies: favicon analysis, domain-based color generation, and API fallbacks
 */

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

/**
 * Generate a deterministic color from a string (domain/company name)
 * This creates consistent colors for the same input
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a vibrant color
  const hue = hash % 360;
  const saturation = 60 + (hash % 20); // 60-80%
  const lightness = 45 + (hash % 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Convert HSL to HEX
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Extract colors from an image (favicon/logo)
 */
async function extractColorsFromImage(imageUrl: string): Promise<string[] | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Simple color extraction: get most common colors
          const colorMap = new Map<string, number>();
          
          for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Skip very light/dark colors (likely backgrounds)
            const brightness = (r + g + b) / 3;
            if (brightness < 30 || brightness > 225) continue;
            
            // Quantize colors to reduce noise
            const qr = Math.round(r / 32) * 32;
            const qg = Math.round(g / 32) * 32;
            const qb = Math.round(b / 32) * 32;
            const key = `${qr},${qg},${qb}`;
            
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
          }
          
          // Get top colors
          const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([color]) => {
              const [r, g, b] = color.split(',').map(Number);
              return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            });
          
          resolve(sortedColors.length > 0 ? sortedColors : null);
        } catch (error) {
          console.error('Error extracting colors from image:', error);
          resolve(null);
        }
      };
      
      img.onerror = () => resolve(null);
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
}

/**
 * Get brand colors from domain or company name
 */
export async function getBrandColors(
  domain?: string,
  companyName?: string,
  logoUrl?: string
): Promise<BrandColors> {
  const identifier = domain || companyName || 'default';
  
  // Try to extract from logo/favicon first
  if (logoUrl) {
    const extractedColors = await extractColorsFromImage(logoUrl);
    if (extractedColors && extractedColors.length > 0) {
      return {
        primary: extractedColors[0],
        secondary: extractedColors[1] || extractedColors[0],
        accent: extractedColors[2] || extractedColors[0],
        background: '#ffffff',
        text: '#09090b',
      };
    }
  }
  
  // Try favicon if we have a domain
  if (domain) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
    const extractedColors = await extractColorsFromImage(faviconUrl);
    if (extractedColors && extractedColors.length > 0) {
      return {
        primary: extractedColors[0],
        secondary: extractedColors[1] || extractedColors[0],
        accent: extractedColors[2] || extractedColors[0],
        background: '#ffffff',
        text: '#09090b',
      };
    }
  }
  
  // Fallback: Generate deterministic colors from domain/name
  const primary = stringToColor(identifier);
  const secondary = stringToColor(identifier + 'secondary');
  const accent = stringToColor(identifier + 'accent');
  
  return {
    primary,
    secondary,
    accent,
    background: '#ffffff',
    text: '#09090b',
  };
}

/**
 * Convert any color format to HEX
 */
export function colorToHex(color: string): string {
  // If already hex, return as is
  if (color.startsWith('#')) {
    return color;
  }
  
  // If HSL, convert
  if (color.startsWith('hsl')) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      return hslToHex(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]));
    }
  }
  
  // If RGB, convert
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0]);
      const g = parseInt(matches[1]);
      const b = parseInt(matches[2]);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
  
  return color; // Fallback
}

