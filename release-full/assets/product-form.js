/**
 * Enhanced Product Form v0.7
 * - Dual purchase buttons (Buy Now + Add to Cart)
 * - Perfect variant synchronization
 * - Enhanced sharing functionality
 * - Quantity controls
 */

class EnhancedProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('form');
    this.variantSelect = this.querySelector('[data-variant-select]');
    this.buyNowButton = this.querySelector('.btn-buy-now');
    this.addToCartButton = this.querySelector('.btn-add-to-cart');
    this.quantityInput = this.querySelector('.quantity-input');
    this.quantityDecrease = this.querySelector('.quantity-decrease');
    this.quantityIncrease = this.querySelector('.quantity-increase');
    this.priceContainer = this.querySelector('[id^="price-"]');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupQuantityControls();
    this.setupSocialSharing();
    this.setupVariantSynchronization();
      }

  setupEventListeners() {
    // Buy Now button
    if (this.buyNowButton) {
      this.buyNowButton.addEventListener('click', this.handleBuyNow.bind(this));
    }

    // Add to Cart form submission
    if (this.form) {
      this.form.addEventListener('submit', this.handleAddToCart.bind(this));
    }

    // Variant selection
    if (this.variantSelect) {
      this.variantSelect.addEventListener('change', this.handleVariantChange.bind(this));
    }

    // Listen for variant changes from media gallery
    document.addEventListener('variantChange', this.handleExternalVariantChange.bind(this));
  }

  setupQuantityControls() {
    if (this.quantityDecrease) {
      this.quantityDecrease.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value);
        if (currentValue > 1) {
          this.quantityInput.value = currentValue - 1;
        }
      });
        }

    if (this.quantityIncrease) {
      this.quantityIncrease.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value);
        const maxValue = parseInt(this.quantityInput.max) || 999;
        if (currentValue < maxValue) {
          this.quantityInput.value = currentValue + 1;
        }
      });
    }

    // Validate quantity input
    if (this.quantityInput) {
      this.quantityInput.addEventListener('change', () => {
        const value = parseInt(this.quantityInput.value);
        const min = parseInt(this.quantityInput.min) || 1;
        const max = parseInt(this.quantityInput.max) || 999;
        
        if (value < min) this.quantityInput.value = min;
        if (value > max) this.quantityInput.value = max;
      });
    }
  }

  setupSocialSharing() {
    const shareButtons = this.querySelectorAll('[data-share]');
    shareButtons.forEach(button => {
      button.addEventListener('click', this.handleShare.bind(this));
    });
  }

  setupVariantSynchronization() {
    // Expose variant update function globally
    window.updateVariantFromMedia = this.updateVariantFromMedia.bind(this);
  }

  async handleBuyNow(event) {
    event.preventDefault();
    
    if (this.buyNowButton.disabled) return;
    
    this.setLoading(this.buyNowButton, true);
    
    try {
      // Get form data
      const formData = new FormData(this.form);
      
      // Add to cart first
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.get('id'),
          quantity: parseInt(formData.get('quantity')) || 1
        })
      });
      
      if (response.ok) {
        // Redirect to checkout
        window.location.href = '/checkout';
            } else {
        throw new Error('Failed to add item to cart');
            }
    } catch (error) {
      console.error('Buy Now error:', error);
      this.showError('Unable to proceed to checkout. Please try again.');
    } finally {
      this.setLoading(this.buyNowButton, false);
    }
  }

  async handleAddToCart(event) {
    event.preventDefault();
    
    if (this.addToCartButton.disabled) return;
    
    this.setLoading(this.addToCartButton, true);
    
    try {
      const formData = new FormData(this.form);
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.get('id'),
          quantity: parseInt(formData.get('quantity')) || 1
        })
      });
      
      if (response.ok) {
        const cartData = await response.json();
        this.showSuccess('Added to cart successfully!');
        
        // Update cart count if exists
        this.updateCartCount();
        
        // Trigger cart drawer if exists
        document.dispatchEvent(new CustomEvent('cart:open'));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      this.showError(error.message || 'Unable to add to cart. Please try again.');
    } finally {
      this.setLoading(this.addToCartButton, false);
    }
  }

  handleVariantChange(event) {
    const selectedOption = event.target.selectedOptions[0];
    const variantId = selectedOption.value;
    const price = selectedOption.dataset.price;
    const comparePrice = selectedOption.dataset.comparePrice;
    const mediaId = selectedOption.dataset.mediaId;
    const available = !selectedOption.disabled;
    
    // Update hidden input
    const hiddenInput = this.form.querySelector('input[name="id"]');
    if (hiddenInput) {
      hiddenInput.value = variantId;
    }
    
    // Update price display
    this.updatePriceDisplay(price, comparePrice);
    
    // Update button states
    this.updateButtonStates(available);
    
    // Update media gallery
    if (mediaId && window.updateMediaGallery) {
      window.updateMediaGallery(variantId);
    }
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('variantChange', {
      detail: { variantId, price, comparePrice, mediaId, available }
    }));
  }

  handleExternalVariantChange(event) {
    const { variantId } = event.detail;
    if (this.variantSelect) {
      this.variantSelect.value = variantId;
      this.variantSelect.dispatchEvent(new Event('change'));
    }
  }

  updateVariantFromMedia(variantIds) {
    if (this.variantSelect && variantIds) {
      const variantArray = variantIds.split(',');
      const firstVariantId = variantArray[0];
      
      if (firstVariantId) {
        this.variantSelect.value = firstVariantId;
        this.variantSelect.dispatchEvent(new Event('change'));
      }
    }
  }

  updatePriceDisplay(price, comparePrice) {
    if (!this.priceContainer) return;
    
    const currentPriceElement = this.priceContainer.querySelector('.current-price');
    const comparePriceElement = this.priceContainer.querySelector('.compare-price');
    const savingsBadge = this.priceContainer.querySelector('.savings-badge');
    
    if (currentPriceElement && price) {
      currentPriceElement.textContent = this.formatMoney(price);
    }
    
    if (comparePriceElement) {
      if (comparePrice && parseInt(comparePrice) > parseInt(price)) {
        comparePriceElement.textContent = this.formatMoney(comparePrice);
        comparePriceElement.style.display = 'inline';

        if (savingsBadge) {
          const savings = parseInt(comparePrice) - parseInt(price);
          savingsBadge.textContent = `Save ${this.formatMoney(savings)}`;
          savingsBadge.style.display = 'inline';
        }
      } else {
        comparePriceElement.style.display = 'none';
        if (savingsBadge) savingsBadge.style.display = 'none';
      }
    }
  }

  updateButtonStates(available) {
    const buttons = [this.buyNowButton, this.addToCartButton];
    
    buttons.forEach(button => {
      if (!button) return;
      
      if (available) {
        button.disabled = false;
        const buttonText = button.querySelector('.btn-text');
        if (buttonText) {
          if (button === this.buyNowButton) {
            buttonText.textContent = 'Buy Now';
          } else {
            buttonText.textContent = 'Add to Cart';
          }
        }
      } else {
        button.disabled = true;
        const buttonText = button.querySelector('.btn-text');
        if (buttonText) {
          if (button === this.buyNowButton) {
            buttonText.textContent = 'Sold Out';
        } else {
            buttonText.textContent = 'Unavailable';
          }
        }
      }
    });
  }

  handleShare(event) {
    const shareType = event.target.dataset.share;
    const url = window.location.href;
    const title = document.title;
    
    switch (shareType) {
      case 'facebook':
        this.shareOnFacebook(url, title);
        break;
      case 'twitter':
        this.shareOnTwitter(url, title);
        break;
      case 'copy':
        this.copyToClipboard(url);
        break;
    }
  }

  shareOnFacebook(url, title) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    this.openShareWindow(shareUrl);
  }

  shareOnTwitter(url, title) {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    this.openShareWindow(shareUrl);
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showSuccess('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      this.showError('Failed to copy link');
    }
  }

  openShareWindow(url) {
    window.open(url, 'share', 'width=600,height=400,location=no,menubar=no,toolbar=no');
  }

  setLoading(button, loading) {
    if (!button) return;
    
    if (loading) {
      button.classList.add('loading');
      this.form.classList.add('loading');
    } else {
      button.classList.remove('loading');
      this.form.classList.remove('loading');
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  updateCartCount() {
    // Update cart count if element exists
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const countElements = document.querySelectorAll('[data-cart-count]');
        countElements.forEach(element => {
          element.textContent = cart.item_count;
        });
      })
      .catch(console.error);
  }

  formatMoney(cents) {
    // Simple money formatting - customize based on store settings
    const amount = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Register custom element
  if (!customElements.get('enhanced-product-form')) {
    customElements.define('enhanced-product-form', EnhancedProductForm);
        }
  
  // Initialize existing forms
  const productForms = document.querySelectorAll('.enhanced-product-form');
  productForms.forEach(form => {
    if (!form.enhanced) {
      new EnhancedProductForm.prototype.constructor.call(form);
      form.enhanced = true;
    }
  });
  
  // Global functions for backward compatibility
  window.updateVariantFromMedia = function(variantId) {
    document.dispatchEvent(new CustomEvent('variantChange', {
      detail: { variantId }
    }));
  };
});

// Additional product page enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Enhanced keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.target.matches('.quantity-input')) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const increase = e.target.parentNode.querySelector('.quantity-increase');
        if (increase) increase.click();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const decrease = e.target.parentNode.querySelector('.quantity-decrease');
        if (decrease) decrease.click();
      }
    }
  });
  
  // Auto-save cart state
  let cartSaveTimeout;
  document.addEventListener('input', function(e) {
    if (e.target.matches('.quantity-input')) {
      clearTimeout(cartSaveTimeout);
      cartSaveTimeout = setTimeout(() => {
        // Save cart state to localStorage for persistence
        try {
          const cartState = {
            quantity: e.target.value,
            timestamp: Date.now()
          };
          localStorage.setItem('cartState', JSON.stringify(cartState));
        } catch (error) {
          console.warn('Failed to save cart state:', error);
        }
      }, 1000);
    }
  });
  
  // Restore cart state on page load
  try {
    const savedState = localStorage.getItem('cartState');
    if (savedState) {
      const cartState = JSON.parse(savedState);
      const quantityInput = document.querySelector('.quantity-input');
      
      // Only restore if saved within last hour
      if (quantityInput && Date.now() - cartState.timestamp < 3600000) {
        quantityInput.value = cartState.quantity;
      }
    }
  } catch (error) {
    console.warn('Failed to restore cart state:', error);
}
});
