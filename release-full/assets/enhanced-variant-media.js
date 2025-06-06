/**
 * Enhanced Variant Media Handler 2025
 * Connects product variants to their corresponding videos/media
 * Provides seamless switching and modern interactions
 * Auto-integrates with enhanced-product-meta system
 */

class EnhancedVariantMedia {
  constructor() {
    this.selectors = {
      mediaGallery: '.enhanced-product-media',
      mediaItems: '.enhanced-media__item',
      thumbnails: '.thumbnail__item',
      variantSelectors: 'variant-radios, variant-selects',
      variantInputs: 'input[name="id"], select[name="id"]',
      currentVariant: '.current-variant',
      currentMedia: '.current-media',
      productMeta: '.enhanced-product-meta',
      variantMetaItems: '.variant-spec__item'
    };
    
    this.currentIndex = 0;
    this.mediaCount = 0;
    this.variantMediaMap = new Map();
    this.autoplayEnabled = true;
    
    this.init();
  }
  
  init() {
    this.mediaGallery = document.querySelector(this.selectors.mediaGallery);
    if (!this.mediaGallery) return;
    
    this.setupElements();
    this.buildVariantMediaMap();
    this.bindEvents();
    this.handleInitialState();
    this.setupPerformanceOptimization();
  }
  
  setupElements() {
    this.mediaItems = this.mediaGallery.querySelectorAll(this.selectors.mediaItems);
    this.thumbnails = this.mediaGallery.querySelectorAll(this.selectors.thumbnails);
    this.currentVariantDisplay = this.mediaGallery.querySelector(this.selectors.currentVariant);
    this.currentMediaDisplay = this.mediaGallery.querySelector(this.selectors.currentMedia);
    this.productMeta = document.querySelector(this.selectors.productMeta);
    this.variantMetaItems = this.productMeta?.querySelectorAll(this.selectors.variantMetaItems) || [];
    this.mediaCount = this.mediaItems.length;
  }
  
  buildVariantMediaMap() {
    // Get product data from window object or data attributes
    const productData = window.product || this.getProductDataFromPage();
    if (!productData) return;
    
    // Map each variant to its corresponding media index
    productData.variants.forEach((variant, index) => {
      if (variant.featured_media) {
        // Find media index by media ID
        const mediaIndex = Array.from(this.mediaItems).findIndex(item => 
          item.dataset.mediaId == variant.featured_media.id
        );
        
        if (mediaIndex >= 0) {
          this.variantMediaMap.set(variant.id, mediaIndex);
        } else {
          // Fallback: map to variant index if media not found
          this.variantMediaMap.set(variant.id, Math.min(index, this.mediaCount - 1));
        }
      } else {
        // Fallback: map to variant index
        this.variantMediaMap.set(variant.id, Math.min(index, this.mediaCount - 1));
      }
    });
  }
  
  getProductDataFromPage() {
    // Try to get product data from various sources
    const productScript = document.querySelector('script[type="application/json"][data-product-json]');
    if (productScript) {
      try {
        return JSON.parse(productScript.textContent);
      } catch (e) {
        console.warn('Failed to parse product JSON:', e);
      }
    }
    
    // Fallback: build basic mapping from available elements
    const variantInputs = document.querySelectorAll(this.selectors.variantInputs);
    const variants = [];
    
    variantInputs.forEach((input, index) => {
      if (input.tagName === 'SELECT') {
        Array.from(input.options).forEach(option => {
          if (option.value) {
            variants.push({
              id: parseInt(option.value),
              title: option.textContent.trim()
            });
          }
        });
      } else if (input.type === 'radio') {
        variants.push({
          id: parseInt(input.value),
          title: input.closest('label')?.textContent?.trim() || `Variant ${index + 1}`
        });
      }
    });
    
    return { variants };
  }
  
  bindEvents() {
    // Thumbnail clicks
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.switchToMedia(index);
      });
    });
    
    // Variant changes
    document.addEventListener('change', (e) => {
      if (e.target.matches(this.selectors.variantInputs)) {
        this.handleVariantChange(e.target);
      }
    });
    
    // Listen for variant change events from Shopify's variant scripts
    document.addEventListener('variant:change', (e) => {
      if (e.detail?.variant) {
        this.handleVariantChangeEvent(e.detail.variant);
      }
    });
    
    // Keyboard navigation
    this.mediaGallery.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
    
    // Video autoplay management
    this.bindVideoAutoplayControls();
  }
  
  bindVideoAutoplayControls() {
    const videos = this.mediaGallery.querySelectorAll('.autoplay-video');
    
    videos.forEach(video => {
      if (video.tagName === 'VIDEO') {
        // Set up video element
        video.muted = true;
        video.loop = true;
        video.controls = false;
        video.playsInline = true;
        
        // Auto-start first video
        const mediaItem = video.closest('.enhanced-media__item');
        if (mediaItem?.classList.contains('active')) {
          this.playVideoSafely(video);
        }
        
        // Video control button handling
        const wrapper = video.closest('.enhanced-video__wrapper');
        const controlBtn = wrapper?.querySelector('.video-control-btn');
        
        if (controlBtn) {
          controlBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleVideoPlayback(video, wrapper);
          });
        }
        
        // Update play/pause icons
        video.addEventListener('play', () => this.updateVideoControls(wrapper, false));
        video.addEventListener('pause', () => this.updateVideoControls(wrapper, true));
        
        // Handle loading states
        video.addEventListener('loadstart', () => wrapper?.classList.add('loading'));
        video.addEventListener('canplay', () => wrapper?.classList.remove('loading'));
        video.addEventListener('error', () => wrapper?.classList.remove('loading'));
        
        // Auto-pause other videos when this one plays
        video.addEventListener('play', () => {
          this.pauseOtherVideos(video);
        });
      }
    });
  }
  
  playVideoSafely(video) {
    if (!video || video.tagName !== 'VIDEO' || !this.autoplayEnabled) return;
    
    const wrapper = video.closest('.enhanced-video__wrapper');
    wrapper?.classList.add('loading');
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          wrapper?.classList.remove('loading');
        })
        .catch(error => {
          console.log('Video autoplay prevented:', error);
          wrapper?.classList.remove('loading');
          wrapper?.classList.add('paused');
        });
    }
  }
  
  toggleVideoPlayback(video, wrapper) {
    if (video.paused) {
      this.playVideoSafely(video);
    } else {
      video.pause();
    }
  }
  
  updateVideoControls(wrapper, isPaused) {
    if (!wrapper) return;
    
    const playPath = wrapper.querySelector('.play-path');
    const pausePath = wrapper.querySelector('.pause-path');
    
    if (isPaused) {
      wrapper.classList.add('paused');
      if (playPath) playPath.style.display = 'block';
      if (pausePath) pausePath.style.display = 'none';
    } else {
      wrapper.classList.remove('paused');
      if (playPath) playPath.style.display = 'none';
      if (pausePath) pausePath.style.display = 'block';
    }
  }
  
  handleVariantChange(input) {
    const variantId = parseInt(input.value);
    const mediaIndex = this.variantMediaMap.get(variantId);
    
    if (mediaIndex !== undefined && mediaIndex !== this.currentIndex) {
      this.switchToMedia(mediaIndex);
    }
    
    // Update variant display
    this.updateVariantDisplay(input);
    
    // Update product meta
    this.updateProductMeta(variantId);
  }
  
  handleVariantChangeEvent(variant) {
    const mediaIndex = this.variantMediaMap.get(variant.id);
    
    if (mediaIndex !== undefined && mediaIndex !== this.currentIndex) {
      this.switchToMedia(mediaIndex);
    }
    
    // Update variant display
    if (this.currentVariantDisplay) {
      this.currentVariantDisplay.textContent = variant.title || variant.name;
    }
    
    // Update product meta
    this.updateProductMeta(variant.id);
  }
  
  updateProductMeta(variantId) {
    if (!this.productMeta || this.variantMetaItems.length === 0) return;
    
    // Remove active from all meta items
    this.variantMetaItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active to current variant meta
    const activeMetaItem = Array.from(this.variantMetaItems).find(item => 
      item.dataset.variantId == variantId
    );
    
    if (activeMetaItem) {
      activeMetaItem.classList.add('active');
    }
  }
  
  switchToMedia(index, options = {}) {
    if (index === this.currentIndex && !options.force) return;
    if (index < 0 || index >= this.mediaCount) return;
    
    const { animate = true, updateUrl = false } = options;
    
    // Pause all videos first
    this.pauseAllVideos();
    
    // Remove active states
    this.mediaItems[this.currentIndex]?.classList.remove('active');
    this.thumbnails[this.currentIndex]?.classList.remove('active');
    
    // Add active states
    this.mediaItems[index]?.classList.add('active');
    this.thumbnails[index]?.classList.add('active');
    
    // Update displays
    if (this.currentMediaDisplay) {
      this.currentMediaDisplay.textContent = index + 1;
    }
    
    // Animation
    if (animate) {
      this.animateMediaTransition(index);
    }
    
    // Update current index
    this.currentIndex = index;
    
    // Auto-start video if it's the new active media
    const activeVideo = this.mediaItems[index]?.querySelector('.autoplay-video[tagName="VIDEO"]');
    if (activeVideo && this.autoplayEnabled) {
      setTimeout(() => this.playVideoSafely(activeVideo), 100);
    }
    
    // Scroll thumbnail into view
    this.scrollThumbnailIntoView(index);
    
    // Dispatch custom event
    this.dispatchMediaChangeEvent(index);
  }
  
  animateMediaTransition(index) {
    const newItem = this.mediaItems[index];
    if (!newItem) return;
    
    // Add transition class for smooth animation
    newItem.style.opacity = '0';
    newItem.style.transform = 'translateX(20px)';
    
    requestAnimationFrame(() => {
      newItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      newItem.style.opacity = '1';
      newItem.style.transform = 'translateX(0)';
      
      setTimeout(() => {
        newItem.style.transition = '';
      }, 300);
    });
  }
  
  scrollThumbnailIntoView(index) {
    const thumbnail = this.thumbnails[index];
    if (!thumbnail) return;
    
    const container = thumbnail.closest('.thumbnails__container');
    if (!container) return;
    
    const thumbRect = thumbnail.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    if (thumbRect.left < containerRect.left || thumbRect.right > containerRect.right) {
      thumbnail.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }
  
  pauseAllVideos() {
    const videos = this.mediaGallery.querySelectorAll('.autoplay-video');
    videos.forEach(video => {
      if (video.tagName === 'VIDEO' && !video.paused) {
        video.pause();
      }
    });
  }
  
  pauseOtherVideos(currentVideo) {
    const videos = this.mediaGallery.querySelectorAll('.autoplay-video');
    videos.forEach(video => {
      if (video !== currentVideo && video.tagName === 'VIDEO' && !video.paused) {
        video.pause();
      }
    });
  }
  
  handleKeyboard(e) {
    if (!this.mediaGallery.contains(document.activeElement)) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.switchToMedia(this.currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.switchToMedia(this.currentIndex + 1);
        break;
      case ' ':
        e.preventDefault();
        const activeVideo = this.mediaItems[this.currentIndex]?.querySelector('.autoplay-video');
        const wrapper = activeVideo?.closest('.enhanced-video__wrapper');
        if (activeVideo && wrapper) {
          this.toggleVideoPlayback(activeVideo, wrapper);
        }
        break;
    }
  }
  
  updateVariantDisplay(input) {
    if (!this.currentVariantDisplay) return;
    
    let variantText = '';
    
    if (input.tagName === 'SELECT') {
      variantText = input.options[input.selectedIndex]?.textContent || '';
    } else {
      variantText = input.closest('label')?.textContent?.trim() || '';
    }
    
    this.currentVariantDisplay.textContent = variantText;
  }
  
  setupPerformanceOptimization() {
    // Handle intersection observer for performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.autoplayEnabled = true;
          const activeVideo = this.mediaItems[this.currentIndex]?.querySelector('.autoplay-video[tagName="VIDEO"]');
          if (activeVideo && activeVideo.paused) {
            this.playVideoSafely(activeVideo);
          }
        } else {
          this.autoplayEnabled = false;
          this.pauseAllVideos();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(this.mediaGallery);
  }
  
  handleInitialState() {
    // Set initial variant display
    const selectedVariantInput = document.querySelector(this.selectors.variantInputs + ':checked, ' + this.selectors.variantInputs + '[selected]');
    if (selectedVariantInput) {
      this.updateVariantDisplay(selectedVariantInput);
      this.handleVariantChange(selectedVariantInput);
    }
  }
  
  dispatchMediaChangeEvent(index) {
    const event = new CustomEvent('media:change', {
      detail: {
        index,
        mediaId: this.mediaItems[index]?.dataset.mediaId,
        mediaType: this.mediaItems[index]?.querySelector('.autoplay-video') ? 'video' : 'image',
        variantIndex: this.mediaItems[index]?.dataset.variantIndex
      }
    });
    
    document.dispatchEvent(event);
  }
  
  // Public API methods
  goToMedia(index) {
    this.switchToMedia(index, { force: true });
  }
  
  nextMedia() {
    const nextIndex = (this.currentIndex + 1) % this.mediaCount;
    this.switchToMedia(nextIndex);
  }
  
  prevMedia() {
    const prevIndex = (this.currentIndex - 1 + this.mediaCount) % this.mediaCount;
    this.switchToMedia(prevIndex);
  }
  
  getCurrentMediaIndex() {
    return this.currentIndex;
  }
  
  getMediaCount() {
    return this.mediaCount;
  }
  
  enableAutoplay() {
    this.autoplayEnabled = true;
  }
  
  disableAutoplay() {
    this.autoplayEnabled = false;
    this.pauseAllVideos();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.enhancedVariantMedia = new EnhancedVariantMedia();
  });
} else {
  window.enhancedVariantMedia = new EnhancedVariantMedia();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedVariantMedia;
} 