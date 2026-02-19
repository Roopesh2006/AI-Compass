import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

export function formatContextWindow(tokens: number): string {
  if (tokens === 0) return 'N/A';
  if (tokens >= 1000000) {
    return (tokens / 1000000).toFixed(0) + 'M';
  }
  if (tokens >= 1000) {
    return (tokens / 1000).toFixed(0) + 'K';
  }
  return tokens.toString();
}

export function getFreshnessStatus(lastVerified: string): {
  status: 'fresh' | 'stale' | 'outdated';
  daysAgo: number;
  color: string;
} {
  const verified = new Date(lastVerified);
  const now = new Date();
  const daysAgo = Math.floor((now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysAgo < 14) {
    return { status: 'fresh', daysAgo, color: '#00E5A0' };
  } else if (daysAgo < 45) {
    return { status: 'stale', daysAgo, color: '#FF8C42' };
  } else {
    return { status: 'outdated', daysAgo, color: '#EF4444' };
  }
}

export function generateUTMUrl(baseUrl: string, source: string = 'ai-compass'): string {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}utm_source=${source}&utm_medium=referral&utm_campaign=recommendation`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// SECURITY UTILITIES

/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitize user input by removing dangerous characters
 */
export function sanitizeInput(input: string): string {
  // Remove script tags and event handlers
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+\s+on\w+\s*=\s*["']?[^"'>]*["']?/gi, (match) => match.replace(/\s+on\w+\s*=/gi, ' data-blocked='))
    .replace(/javascript:/gi, 'blocked:')
    .replace(/data:text\/html/gi, 'blocked:')
    .trim();
}

/**
 * Validate URL to prevent open redirect vulnerabilities
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Check if URL is from allowed domain (optional additional security)
 */
export function isAllowedDomain(url: string, allowedDomains: string[] = []): boolean {
  if (allowedDomains.length === 0) return true;
  
  try {
    const parsed = new URL(url);
    return allowedDomains.some(domain => 
      parsed.hostname === domain || 
      parsed.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Truncate string to max length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Validate search query length and content
 */
export function validateSearchQuery(query: string): { valid: boolean; error?: string; sanitized: string } {
  const MAX_LENGTH = 200;
  
  if (query.length > MAX_LENGTH) {
    return { 
      valid: false, 
      error: `Query too long (max ${MAX_LENGTH} characters)`,
      sanitized: truncate(query, MAX_LENGTH)
    };
  }
  
  const sanitized = sanitizeInput(query);
  return { valid: true, sanitized };
}
