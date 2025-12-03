// SEO Utility Functions for All Things Doc
// This file contains functions to dynamically update page SEO based on current tool

import { TOOL_SEO_DATA } from './seo-config';
import { ToolID } from './types';

/**
 * Updates page title and meta tags for SEO optimization
 * @param toolId - The current tool ID
 * @param additionalTitle - Optional additional text to append to title
 */
export function updatePageSEO(toolId?: ToolID, additionalTitle?: string): void {
  if (!toolId || !TOOL_SEO_DATA[toolId]) {
    // Default SEO for homepage
    setDefaultSEO();
    return;
  }

  const seoData = TOOL_SEO_DATA[toolId];
  
  // Update title
  const title = additionalTitle 
    ? `${seoData.title} - ${additionalTitle}`
    : seoData.title;
  document.title = title;

  // Update meta description
  updateMetaTag('description', seoData.description);
  
  // Update Open Graph meta tags
  updateMetaTag('og:title', seoData.title);
  updateMetaTag('og:description', seoData.description);
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:url', window.location.href);
  
  // Update Twitter Card meta tags
  updateMetaTag('twitter:title', seoData.title);
  updateMetaTag('twitter:description', seoData.description);
  
  // Update canonical URL
  updateCanonicalURL();
  
  // Update structured data if needed
  updateStructuredData(toolId);
}

/**
 * Sets default SEO for homepage or when no tool is selected
 */
export function setDefaultSEO(): void {
  const defaultTitle = 'All Things Doc - Free AI-Powered Document Processing Tools Online';
  const defaultDescription = 'Transform your documents with All Things Doc - Free online PDF tools, AI-powered text processing, OCR, translation, and file conversion. No signup required.';
  
  document.title = defaultTitle;
  updateMetaTag('description', defaultDescription);
  updateMetaTag('og:title', defaultTitle);
  updateMetaTag('og:description', defaultDescription);
  updateMetaTag('twitter:title', defaultTitle);
  updateMetaTag('twitter:description', defaultDescription);
  updateCanonicalURL();
}

/**
 * Updates a specific meta tag
 * @param name - The name or property of the meta tag
 * @param content - The content value
 */
function updateMetaTag(name: string, content: string): void {
  // Find existing meta tag
  let metaTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  
  if (metaTag) {
    // Update existing tag
    metaTag.setAttribute('content', content);
  } else {
    // Create new meta tag
    metaTag = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      metaTag.setAttribute('property', name);
    } else {
      metaTag.setAttribute('name', name);
    }
    metaTag.setAttribute('content', content);
    document.head.appendChild(metaTag);
  }
}

/**
 * Updates canonical URL
 */
function updateCanonicalURL(): void {
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  
  if (canonicalLink) {
    canonicalLink.setAttribute('href', window.location.href);
  } else {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', window.location.href);
    document.head.appendChild(canonicalLink);
  }
}

/**
 * Updates structured data based on current tool
 * @param toolId - The current tool ID
 */
function updateStructuredData(toolId?: ToolID): void {
  // Remove existing tool-specific structured data
  const existingScript = document.querySelector('script[data-tool-structured-data]');
  if (existingScript) {
    existingScript.remove();
  }

  if (!toolId || !TOOL_SEO_DATA[toolId]) {
    return;
  }

  const seoData = TOOL_SEO_DATA[toolId];
  
  // Create tool-specific structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': seoData.title,
    'description': seoData.description,
    'url': window.location.href,
    'applicationCategory': 'ProductivityApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'featureList': [seoData.h1, seoData.h2]
  };

  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-tool-structured-data', 'true');
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

/**
 * Generates SEO-friendly URL slug from tool title
 * @param title - The tool title
 * @returns SEO-friendly slug
 */
export function generateSEOSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

/**
 * Gets SEO data for a specific tool
 * @param toolId - The tool ID
 * @returns SEO data or null if not found
 */
export function getToolSEOData(toolId: ToolID) {
  return TOOL_SEO_DATA[toolId] || null;
}

/**
 * Updates page headings (h1, h2) for better SEO
 * @param toolId - The current tool ID
 */
export function updatePageHeadings(toolId?: ToolID): void {
  if (!toolId || !TOOL_SEO_DATA[toolId]) {
    return;
  }

  const seoData = TOOL_SEO_DATA[toolId];
  
  // Update h1 if it exists
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.textContent = seoData.h1;
  }
  
  // Update h2 if it exists
  const h2 = document.querySelector('h2');
  if (h2) {
    h2.textContent = seoData.h2;
  }
}

/**
 * Generates meta keywords for a tool
 * @param toolId - The tool ID
 * @param additionalKeywords - Additional keywords to include
 * @returns Array of keywords
 */
export function generateMetaKeywords(toolId?: ToolID, additionalKeywords: string[] = []): string[] {
  const defaultKeywords = [
    'free online tools',
    'document processing',
    'file conversion',
    'no signup required',
    'all things doc'
  ];

  if (!toolId || !TOOL_SEO_DATA[toolId]) {
    return [...defaultKeywords, ...additionalKeywords];
  }

  const toolKeywords = TOOL_SEO_DATA[toolId].title
    .toLowerCase()
    .split(/[\s\-]+/)
    .filter(word => word.length > 2 && !['the', 'and', 'with', 'free', 'online'].includes(word));

  return [...new Set([...defaultKeywords, ...toolKeywords, ...additionalKeywords])];
}

/**
 * SEO optimization for SPA navigation
 * Call this function when navigating between tools
 */
export function handleSPANavigation(toolId?: ToolID): void {
  // Update SEO
  updatePageSEO(toolId);
  updatePageHeadings(toolId);
  
  // Update URL without page reload
  if (toolId) {
    const seoData = TOOL_SEO_DATA[toolId];
    const slug = generateSEOSlug(seoData.title);
    const newUrl = `/${slug}`;
    
    if (window.location.pathname !== newUrl) {
      window.history.replaceState({}, '', newUrl);
    }
  }
  
  // Send page view event for analytics
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: window.location.pathname,
      page_title: document.title
    });
  }
}