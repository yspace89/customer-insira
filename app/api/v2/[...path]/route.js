// app/api/v2/[...path]/route.js
import { NextResponse } from 'next/server';

async function handleRequest(request, { params }) {
  try {
    const resolvedParams = await params;
    const pathArray = resolvedParams.path || [];
    const path = pathArray.join('/');
    
    const searchParams = new URL(request.url).searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';
    
    const targetUrl = `https://api-staging.kotahati.id/api/v2/${path}${queryString}`;
    
    // Clone headers from original request
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Exclude Host to prevent Nginx/Apache routing issues at staging server
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'origin' && key.toLowerCase() !== 'referer') {
        headers.set(key, value);
      }
    });
    
    // Force headers to localhost:3000 to bypass tenant domain check
    headers.set('Origin', 'http://localhost:3000');
    headers.set('Referer', 'http://localhost:3000/');
    
    const method = request.method;
    let body = undefined;
    
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.clone().text();
    }
    
    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'manual',
    });
    
    // Read response body as array buffer
    const responseBody = await res.arrayBuffer();
    
    // Copy response headers
    const resHeaders = new Headers();
    res.headers.forEach((value, key) => {
      // Exclude content-encoding to prevent compression issues
      if (key.toLowerCase() !== 'content-encoding') {
        resHeaders.set(key, value);
      }
    });
    
    return new Response(responseBody, {
      status: res.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { message: 'Internal Proxy Error', error: error.message },
      { status: 500 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
