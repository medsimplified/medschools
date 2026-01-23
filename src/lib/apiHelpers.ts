/**
 * API Response Helpers with Caching
 * Use these to create optimized API responses
 */

import { NextResponse } from 'next/server';

export interface ApiResponseOptions {
  cache?: 'no-cache' | 'public' | 'private';
  maxAge?: number; // in seconds
  staleWhileRevalidate?: number; // in seconds
}

/**
 * Create a successful API response with optional caching headers
 */
export function apiSuccess<T>(
  data: T,
  options: ApiResponseOptions = {}
): NextResponse {
  const { cache = 'no-cache', maxAge = 0, staleWhileRevalidate = 0 } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (cache !== 'no-cache' && maxAge > 0) {
    const cacheControl = [
      cache,
      `max-age=${maxAge}`,
      staleWhileRevalidate > 0 ? `stale-while-revalidate=${staleWhileRevalidate}` : '',
    ]
      .filter(Boolean)
      .join(', ');
    
    headers['Cache-Control'] = cacheControl;
  } else {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }

  return NextResponse.json(data, { headers });
}

/**
 * Create an error API response
 */
export function apiError(
  message: string,
  status: number = 500,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}

/**
 * Common cache configurations
 */
export const CacheConfig = {
  // No caching - for user-specific or sensitive data
  NoCache: {
    cache: 'no-cache' as const,
  },
  
  // Short cache - for frequently updated data (1 minute)
  Short: {
    cache: 'public' as const,
    maxAge: 60,
    staleWhileRevalidate: 120,
  },
  
  // Medium cache - for moderately stable data (5 minutes)
  Medium: {
    cache: 'public' as const,
    maxAge: 300,
    staleWhileRevalidate: 600,
  },
  
  // Long cache - for stable data (1 hour)
  Long: {
    cache: 'public' as const,
    maxAge: 3600,
    staleWhileRevalidate: 7200,
  },
  
  // Static cache - for rarely changing data (1 day)
  Static: {
    cache: 'public' as const,
    maxAge: 86400,
    staleWhileRevalidate: 172800,
  },
};

/**
 * Example usage:
 * 
 * // No caching (default)
 * return apiSuccess({ data: userData });
 * 
 * // With short cache
 * return apiSuccess({ courses }, CacheConfig.Short);
 * 
 * // With custom cache
 * return apiSuccess({ data }, { cache: 'public', maxAge: 600 });
 * 
 * // Error response
 * return apiError('Not found', 404);
 */
