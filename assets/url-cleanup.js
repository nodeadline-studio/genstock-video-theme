/**
 * URL Cleanup Script for GenStockVideo
 * Redirects problematic tracking URLs to clean versions
 */

(function() {
  'use strict';
  
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;
  
  // Check if URL contains problematic tracking parameters or patterns
  const trackingParams = [
    'wpm@', 'web-pixel-shopify-custom-pixel', 'sandbox/modern',
    'pr_prod_strat=', 'pr_rec_id=', 'pr_rec_pid=', 'pr_ref_pid=', 'pr_seq=',
    'utm_source=', 'utm_medium=', 'utm_campaign=', 'utm_content=', 'utm_term=',
    'fbclid=', 'gclid=', 'mc_cid=', 'mc_eid=', '_ga=', '_gl=', 'ref=', 'referrer='
  ];
  
  const hasTrackingIssues = trackingParams.some(param => currentUrl.includes(param));
  
  // Check for problematic path patterns that cause 404s
  const hasProblematicPath = 
    /^\/\d+$/.test(currentPath) ||                    // Numeric paths like /1, /419
    currentPath.includes('${') ||                     // Variable patterns like /${t}
    currentPath.includes('*') ||                      // Wildcard patterns
    currentPath.includes('(') ||                      // Regex patterns
    currentPath.includes(')') ||                      // Regex patterns
    currentPath.startsWith('/v1/') ||                 // API paths
    currentPath.startsWith('/cdn') ||                 // CDN paths
    currentPath.startsWith('/wpm') ||                 // WPM paths
    /^\/[a-z]$/.test(currentPath) ||                 // Single letter paths like /b
    /^\/4\d{2}$/.test(currentPath);                  // Error code paths like /419
  
  // Handle problematic paths first
  if (hasProblematicPath) {
    // Redirect problematic paths to homepage
    window.location.replace(window.location.origin + '/');
    return;
  }
  
  if (hasTrackingIssues) {
    // Extract clean product/collection path
    let cleanPath = currentPath;
    
    // Remove tracking path segments
    cleanPath = cleanPath.replace(/\/wpm@[^\/]+\/custom\/web-pixel-shopify-custom-pixel@[^\/]+\/sandbox\/modern/g, '');
    cleanPath = cleanPath.replace(/\/wpm@[^\/]+/g, '');
    cleanPath = cleanPath.replace(/\/custom\/web-pixel-shopify-custom-pixel@[^\/]+/g, '');
    cleanPath = cleanPath.replace(/\/sandbox\/modern/g, '');
    
    // Clean up double slashes
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    // Ensure path starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    // Extract clean search parameters (keep only essential ones)
    const urlParams = new URLSearchParams(window.location.search);
    const cleanParams = new URLSearchParams();
    
    // Keep only essential parameters - be very strict
    const allowedParams = ['variant', 'page', 'q'];
    
    // Only keep sort_by if it's a useful one
    if (urlParams.has('sort_by')) {
      const sortBy = urlParams.get('sort_by');
      if (['best-selling', 'price-ascending', 'price-descending'].includes(sortBy)) {
        cleanParams.set('sort_by', sortBy);
      }
    }
    
    // Add other allowed params
    allowedParams.forEach(param => {
      if (urlParams.has(param)) {
        cleanParams.set(param, urlParams.get(param));
      }
    });
    
    // Build clean URL
    let cleanUrl = window.location.origin + cleanPath;
    if (cleanParams.toString()) {
      cleanUrl += '?' + cleanParams.toString();
    }
    
    // Only redirect if the URL actually changed
    if (cleanUrl !== currentUrl) {
      // Use replace to avoid creating history entries
      window.location.replace(cleanUrl);
    }
  }
  
  // Add canonical link enforcement
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink && canonicalLink.href !== window.location.href) {
    // If canonical differs significantly from current URL, consider redirecting
    const canonical = new URL(canonicalLink.href);
    const current = new URL(window.location.href);
    
    // Check if paths match but parameters differ
    if (canonical.pathname === current.pathname && canonical.search !== current.search) {
      const canonicalParams = new URLSearchParams(canonical.search);
      const currentParams = new URLSearchParams(current.search);
      
      // If canonical has fewer parameters, it's likely the clean version
      if (canonicalParams.toString().length < currentParams.toString().length) {
        // Only redirect if we have tracking parameters
        if (hasTrackingIssues) {
          window.location.replace(canonicalLink.href);
        }
      }
    }
  }
})(); 