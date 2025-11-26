/**
 * Utility to get a header/hero image from a brand's website
 * Tries multiple strategies: Open Graph images, common paths, and fallback services
 */

/**
 * Get a header image URL from a domain
 * Tries multiple strategies in order:
 * 1. Microlink.io API (extracts og:image) - async fetch
 * 2. Common Open Graph image paths
 */
export async function getBrandHeaderImage(domain: string): Promise<string | null> {
  if (!domain) return null;

  // Clean the domain
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]; // Remove path if present

  const fullUrl = `https://${cleanDomain}`;

  // Strategy 1: Try Microlink.io API (free tier, extracts og:image)
  // This API can extract Open Graph images from websites
  try {
    const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(fullUrl)}&screenshot=false&meta=true`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(microlinkUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      // Microlink returns the image URL in data.data.image.url
      if (data.data?.image?.url) {
        return data.data.image.url;
      }
      // Sometimes it's in data.image.url
      if (data.image?.url) {
        return data.image.url;
      }
    }
  } catch (error) {
    // Silently fail and try fallback
    console.log('Microlink API unavailable, using fallback...');
  }

  // Strategy 2: Return common Open Graph image path
  // The browser will try to load it, and if it doesn't exist, the onError handler will catch it
  return getOGImageUrl(domain);
}

/**
 * Get a header image URL with fallback strategies
 * Returns a URL that can be used in an img tag
 */
export function getBrandHeaderImageUrl(domain: string): string {
  if (!domain) return '';

  // Clean the domain
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  const fullUrl = `https://${cleanDomain}`;

  // Try Microlink.io API (async, but we'll return the API URL)
  // The component can handle loading this
  return `https://api.microlink.io/?url=${encodeURIComponent(fullUrl)}&screenshot=false&meta=true`;
}

/**
 * Get Open Graph image URL directly (synchronous)
 * This constructs common OG image paths
 */
export function getOGImageUrl(domain: string): string | null {
  if (!domain) return null;

  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  const baseUrl = `https://${cleanDomain}`;
  
  // Return the most common Open Graph image path
  // The img tag will handle 404s gracefully
  return `${baseUrl}/og-image.png`;
}

