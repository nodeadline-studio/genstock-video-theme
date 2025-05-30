class ProductCardVideo {
  constructor() {
    this.productCards = document.querySelectorAll('.product-card-wrapper');
    // Track the currently active video container
    this.activeVideoContainer = null;
    // Keep track of hover state for each card
    this.hoveredCards = new WeakMap();
    // Track loading states to prevent race conditions
    this.loadingStates = new WeakMap();
    // Debounce timers for hover events
    this.hoverTimers = new WeakMap();
    // Variables for touch gesture detection
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.touchTimeout = null;
    this.isScrolling = false;
    this.touchThreshold = 10; // Pixels threshold to determine scrolling vs tapping
    
    // Configuration
    this.config = {
      hoverDelay: 150, // Delay before starting video load
      leaveDelay: 100, // Delay before stopping video
      transitionDuration: 200, // CSS transition duration
      loadTimeout: 5000 // Max time to wait for video load
    };
    
    if (this.productCards.length) {
      this.init();
    }
  }

  init() {
    this.productCards.forEach(card => {
      const mediaContainer = card.querySelector('.card__media');
      if (!mediaContainer) return;

      // Check if this product has video as second media
      const productId = card.querySelector('a[href^="/products/"]')?.href.split('/products/')[1]?.split('?')[0];
      if (!productId) return;

      // Initialize states for this card
      this.hoveredCards.set(card, false);
      this.loadingStates.set(card, false);

      // Create a video element that will replace the second image on hover
      this.setupCardVideo(card, mediaContainer, productId);
    });
  }

  setupCardVideo(card, mediaContainer, productId) {
    // Create and append hidden video element
    const videoContainer = document.createElement('div');
    videoContainer.className = 'card__video-container';
    mediaContainer.appendChild(videoContainer);

    // Add hover event listeners for desktop with debouncing
    card.addEventListener('mouseenter', () => {
      this.handleMouseEnter(card, videoContainer, productId);
    });
    
    card.addEventListener('mouseleave', () => {
      this.handleMouseLeave(card, videoContainer);
    });
    
    // For touch devices - improved touch handling
    card.addEventListener('touchstart', (e) => {
      this.handleTouchStart(e, card, videoContainer, productId);
    }, { passive: true });
    
    // Track touch movement to detect scrolling
    card.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, { passive: true });
    
    // Clean up on touch end
    card.addEventListener('touchend', () => {
      this.handleTouchEnd();
    }, { passive: true });
    
    // Handle touch cancellation
    card.addEventListener('touchcancel', () => {
      this.handleTouchEnd();
    }, { passive: true });
  }

  handleMouseEnter(card, videoContainer, productId) {
    // Clear any existing timer for this card
    const existingTimer = this.hoverTimers.get(card);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Mark this card as being hovered immediately
    this.hoveredCards.set(card, true);

    // Set debounced timer
    const timer = setTimeout(() => {
      // Double-check that card is still being hovered
      if (this.hoveredCards.get(card)) {
        this.activateVideo(card, videoContainer, productId);
      }
    }, this.config.hoverDelay);

    this.hoverTimers.set(card, timer);
  }

  handleMouseLeave(card, videoContainer) {
    // Clear hover timer if it exists
    const existingTimer = this.hoverTimers.get(card);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.hoverTimers.delete(card);
    }

    // Mark card as no longer being hovered
    this.hoveredCards.set(card, false);

    // Set a small delay before deactivating to handle quick re-hovers
    setTimeout(() => {
      // Only deactivate if card is still not being hovered
      if (!this.hoveredCards.get(card)) {
        this.deactivateVideo(card, videoContainer);
      }
    }, this.config.leaveDelay);
  }

  handleTouchStart(e, card, videoContainer, productId) {
    // Record starting touch position for gesture detection
    this.touchStartY = e.touches[0].clientY;
    this.touchStartX = e.touches[0].clientX;
    this.isScrolling = false;
    
    // Clear any existing timeout
    if (this.touchTimeout) {
      clearTimeout(this.touchTimeout);
    }
    
    // Set a short timeout to determine if this is a tap or scroll
    this.touchTimeout = setTimeout(() => {
      // Only activate if not scrolling and not already playing
      if (!this.isScrolling && !videoContainer.classList.contains('playing')) {
        e.preventDefault();
        
        // Mark this card as being hovered
        this.hoveredCards.set(card, true);
        this.activateVideo(card, videoContainer, productId);
      }
    }, 100); // Short delay to detect scrolling intention
  }

  handleTouchMove(e) {
    if (this.touchTimeout) {
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = Math.abs(touchY - this.touchStartY);
      const deltaX = Math.abs(touchX - this.touchStartX);
      
      // If significant vertical or horizontal movement detected, mark as scrolling
      if (deltaY > this.touchThreshold || deltaX > this.touchThreshold) {
        this.isScrolling = true;
        clearTimeout(this.touchTimeout);
        this.touchTimeout = null;
      }
    }
  }

  handleTouchEnd() {
    if (this.touchTimeout) {
      clearTimeout(this.touchTimeout);
      this.touchTimeout = null;
    }
  }

  activateVideo(card, videoContainer, productId) {
    // Prevent multiple activations for the same card
    if (this.loadingStates.get(card)) {
      return;
    }

    // Deactivate any other playing videos first
    if (this.activeVideoContainer && this.activeVideoContainer !== videoContainer) {
      const previousCard = this.findParentCard(this.activeVideoContainer);
      if (previousCard) {
        this.deactivateVideo(previousCard, this.activeVideoContainer);
      }
    }
    
    // Set this as the active video
    this.activeVideoContainer = videoContainer;
    
    // Handle the hover
    this.handleCardHover(card, videoContainer, productId);
  }

  deactivateVideo(card, videoContainer) {
    // Clear loading state
    this.loadingStates.set(card, false);

    // Clear any hover timers
    const existingTimer = this.hoverTimers.get(card);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.hoverTimers.delete(card);
    }

    if (!videoContainer) return;
    
    // Remove playing class to fade it out
    videoContainer.classList.remove('playing');
    
    // Show the image - important to do this before hiding video
    const parentContainer = videoContainer.parentElement;
    if (parentContainer) {
      const imgContainer = parentContainer.querySelector('.media--hover-effect');
      if (imgContainer) {
        imgContainer.style.opacity = '1';
      }
    }
    
    // Stop any playing video, but leave it visible during fade out
    const video = videoContainer.querySelector('video');
    if (video) {
      try {
        video.pause();
        video.currentTime = 0; // Reset to beginning
      } catch (e) { /* ignore */ }
    }
    
    // Reset iframe for external videos
    const iframe = videoContainer.querySelector('iframe');
    if (iframe) {
      iframe.src = '';
    }

    // Clear active container if this was it
    if (this.activeVideoContainer === videoContainer) {
      this.activeVideoContainer = null;
    }

    // Clean up video content after transition
    setTimeout(() => {
      if (!this.hoveredCards.get(card)) {
        videoContainer.innerHTML = '';
      }
    }, this.config.transitionDuration + 50);
  }
  
  // Helper to find the parent card
  findParentCard(element) {
    let current = element;
    while (current) {
      if (current.classList && current.classList.contains('product-card-wrapper')) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  async handleCardHover(card, videoContainer, productId) {
    // Set loading state
    this.loadingStates.set(card, true);

    // Before loading a new video, check if we're still the active container
    // and the card is still being hovered
    if (this.activeVideoContainer !== videoContainer || !this.hoveredCards.get(card)) {
      this.loadingStates.set(card, false);
      return;
    }
    
    // If video is already loaded, just play it without resetting time
    // This prevents jump cuts during quick hovers
    const existingVideo = videoContainer.querySelector('video');
    if (existingVideo && existingVideo.readyState >= 3) {
      this.loadingStates.set(card, false);
      this.playVideo(videoContainer);
      return;
    }
    
    const existingIframe = videoContainer.querySelector('iframe');
    if (existingIframe && existingIframe.src) {
      this.loadingStates.set(card, false);
      this.playVideo(videoContainer);
      return;
    }
    
    // Show loading spinner
    videoContainer.innerHTML = '<div class="video-loading-spinner"></div>';

    try {
      // Add timeout for loading
      const loadPromise = this.loadVideoData(productId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Load timeout')), this.config.loadTimeout)
      );

      const html = await Promise.race([loadPromise, timeoutPromise]);
      
      // Check if we're still the active video before proceeding
      // and the card is still being hovered
      if (this.activeVideoContainer !== videoContainer || !this.hoveredCards.get(card)) {
        this.loadingStates.set(card, false);
        return;
      }
      
      // Clean up HTML response (remove any whitespace/line breaks between tags)
      const cleanHtml = html.replace(/>\s+</g, '><').trim();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanHtml;
      
      // Check if no video
      if (tempDiv.querySelector('.no-video')) {
        this.loadingStates.set(card, false);
        return;
      }
      
      const videoElement = tempDiv.querySelector('[data-video-type]');
      
      if (videoElement) {
        const videoType = videoElement.dataset.videoType || 'hosted';
        
        if (videoType === 'hosted') {
          const videoUrl = this.extractVideoUrl(videoElement);
          
          if (videoUrl) {
            // Final check that we're still active before creating video
            // and the card is still being hovered
            if (this.activeVideoContainer === videoContainer && this.hoveredCards.get(card)) {
              this.createAndPlayVideo(videoContainer, videoUrl, videoType);
            }
          }
        } else {
          // For external videos
          const videoUrl = videoElement.dataset.videoUrl;
          if (videoUrl) {
            // Final check that we're still active before creating video
            // and the card is still being hovered
            if (this.activeVideoContainer === videoContainer && this.hoveredCards.get(card)) {
              this.createAndPlayVideo(videoContainer, videoUrl, videoType);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading product video:', error);
      // Clear loading spinner on error
      if (this.activeVideoContainer === videoContainer) {
        videoContainer.innerHTML = '';
      }
    } finally {
      this.loadingStates.set(card, false);
    }
  }

  async loadVideoData(productId) {
    const response = await fetch(`/products/${productId}?view=video-data`);
    return await response.text();
  }

  extractVideoUrl(videoElement) {
    // Try to find supported format
    let videoUrl = null;
    
    // First check if there are source elements inside the container
    const sourceElements = videoElement.querySelectorAll('[data-source-mp4], [data-source-webm], [data-source-ogg]');
    
    if (sourceElements.length > 0) {
      // Prefer MP4 first, then WebM, then Ogg
      const mp4Source = videoElement.querySelector('[data-source-mp4]');
      const webmSource = videoElement.querySelector('[data-source-webm]');
      const oggSource = videoElement.querySelector('[data-source-ogg]');
      
      videoUrl = mp4Source?.dataset.sourceMp4 || 
                webmSource?.dataset.sourceWebm || 
                oggSource?.dataset.sourceOgg || 
                sourceElements[0].dataset.videoUrl;
    } else {
      // Fall back to the direct URL if no source elements
      videoUrl = videoElement.dataset.videoUrl;
    }

    if (videoUrl && videoUrl.startsWith('//')) {
      videoUrl = 'https:' + videoUrl;
    }

    return videoUrl;
  }

  createAndPlayVideo(container, videoUrl, videoType) {
    console.log('Creating video with URL:', videoUrl, 'Type:', videoType);
    
    // Clear loading indicator
    container.innerHTML = '';
    
    if (videoType === 'hosted') {
      this.createHostedVideo(container, videoUrl);
    } else {
      this.createExternalVideo(container, videoUrl);
    }
  }

  createHostedVideo(container, videoUrl) {
    // Create video element for hosted videos
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    
    // Add error handling
    video.onerror = (e) => {
      console.error('Video error:', e);
      console.error('Failed video source:', videoUrl);
    };
    
    // Don't show video until it's loaded
    video.style.opacity = '0';
    
    // Add load event to play when ready
    video.addEventListener('loadeddata', () => {
      // Check if container is still active before showing
      const parentCard = this.findParentCard(container);
      if (parentCard && this.hoveredCards.get(parentCard)) {
        // Video is loaded, start playing and make visible
        video.style.opacity = '1';
        video.play().then(() => {
          // Only hide the image once the video is actually playing
          this.showVideo(container);
        }).catch(e => {
          console.error('Error playing video:', e);
        });
      }
    });
    
    // Add source element instead of using src attribute
    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = this.getVideoMimeType(videoUrl);
    video.appendChild(source);
    
    container.appendChild(video);
  }

  createExternalVideo(container, videoUrl) {
    // Create iframe for external videos (YouTube/Vimeo)
    const iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.frameBorder = "0";
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    
    // For iframes, we need to add a load event
    iframe.addEventListener('load', () => {
      // Check if container is still active before showing
      const parentCard = this.findParentCard(container);
      if (parentCard && this.hoveredCards.get(parentCard)) {
        // Add a small delay to ensure the iframe content is visible
        setTimeout(() => {
          this.showVideo(container);
        }, 100);
      }
    });
    
    container.appendChild(iframe);
  }
  
  getVideoMimeType(url) {
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      case 'ogg': return 'video/ogg';
      case 'm3u8': return 'application/x-mpegURL';
      default: return 'video/mp4';
    }
  }

  playVideo(container) {
    const video = container.querySelector('video');
    
    // If we have a video that's already loaded
    if (video && video.readyState >= 3) { // HAVE_FUTURE_DATA or better
      video.play().then(() => {
        this.showVideo(container);
      }).catch(e => {
        console.error('Error playing existing video:', e);
      });
    } 
    // If we have an iframe that's already loaded
    else if (container.querySelector('iframe')) {
      this.showVideo(container);
    }
    // Otherwise container is empty or video isn't loaded yet
    // In this case, we do nothing as loading will trigger showVideo
  }

  // Show the video container and hide the image
  showVideo(container) {
    // Double-check that this container should still be active
    const parentCard = this.findParentCard(container);
    if (!parentCard || !this.hoveredCards.get(parentCard)) {
      return;
    }

    // Add playing class to fade it in with CSS transition
    container.classList.add('playing');
    
    // Now we can fade out the image
    const imgContainer = container.parentElement.querySelector('.media--hover-effect');
    if (imgContainer) {
      imgContainer.style.opacity = '0';
    }
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProductCardVideo();
  });
} else {
  new ProductCardVideo();
} 