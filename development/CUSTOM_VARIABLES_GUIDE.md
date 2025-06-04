# 🎬 **GenStock Video - Custom Variables Guide**

## 🚀 **PHASE 1 COMPLETE: Full Customization System**

Your Spotlight-Mod now has **complete user control** over every aspect of the video gallery behavior through Shopify's theme customizer!

---

## 🎛️ **ACCESSING YOUR SETTINGS**

### **In Shopify Admin:**
1. Go to **Online Store → Themes**
2. Click **Customize** on your Spotlight-Mod theme
3. Look for **"🎬 GenStock Video Settings"** in the left sidebar
4. Configure all your custom variables!

---

## 🎯 **YOUR REQUESTED FEATURES - NOW FULLY CUSTOMIZABLE**

### ✅ **1. Auto-Swap Gallery** (Your Main Request)
**"1st frame of each preview on open product - 1st pic and 2nd video swap places on video load"**

**Settings Available:**
- ✅ **Enable auto-swap gallery** - Turn on/off the swap behavior
- ✅ **Swap trigger event** - Choose when to swap:
  - `When video loads` (your original request)
  - `When video starts playing`
  - `On video hover`
  - `On video click`
- ✅ **Swap animation speed** - Control timing:
  - `Fast (0.3s)` ← Default
  - `Medium (0.5s)`
  - `Slow (0.8s)`
  - `Instant (no animation)`
- ✅ **Show swap indicators** - Display "Moving to Top" messages
- ✅ **Preserve original order** - Remember positions in session

### ✅ **2. Custom Data Integration** 
**"Is all my data @Spotlight-Mod initiated from custom data?"** - YES, fully connected

**Automatic Integration:**
- ✅ `custom.video_duration_` → Duration badges in gallery
- ✅ `custom.video_resolutions` → Resolution badges  
- ✅ `descriptors.subtitle` → Metadata display
- ✅ All metafields sync with variant selection

### ✅ **3. Variant-Preview Connection**
**"Does the preview now connected to chosen variant?"** - YES, bidirectional sync

**Features:**
- ✅ Gallery updates when variant changes
- ✅ Variant updates when gallery changes
- ✅ Real-time price and button updates
- ✅ Metafield synchronization

---

## 🎮 **VIDEO PREVIEW CONTROLS**

### **Hover & Autoplay Settings:**
- **Auto-play videos on hover** - Videos start when hovered
- **Loop videos automatically** - Restart when finished
- **Video controls visibility:**
  - `Always visible` - Controls always shown
  - `Show on hover` ← Default
  - `Never show` - Hide all controls

### **Thumbnail Management:**
- **Maximum thumbnails to display** - 2 to 8 thumbnails (default: 4)

---

## 🎨 **GALLERY LAYOUT & DESIGN**

### **Layout Styles:**
1. **Modern Grid** ← Default
   - Gallery area + thumbnails + controls in grid
   - Best for desktop viewing

2. **Classic Two-Column**
   - Stacked layout: media above, navigation below
   - Traditional e-commerce style

3. **Video-Focused**
   - Maximizes video space
   - Compact thumbnail navigation
   - Great for video-heavy products

4. **Mobile-First Vertical**
   - Optimized for mobile viewing
   - Touch-friendly interactions

### **Design Options:**
- **Video aspect ratio:**
  - `16:9 (Widescreen)` ← Default
  - `4:3 (Standard)`
  - `1:1 (Square)`
  - `Auto (Original ratio)`

- **Gallery border radius** - 0-24px roundness (default: 12px)

---

## 🎯 **ADVANCED FEATURES**

### **Analytics & Performance:**
- **Enable video analytics** - Track play, pause, complete events
- **Preload videos** - Load in background for faster playback
- **Performance monitoring** - Track loading times

### **Fallback Options:**
- **Fallback image priority:**
  - `First image` ← Default
  - `Featured image`
  - `Last image`

### **Developer Options:**
- **Enable debug mode** - Console logging for troubleshooting
- **Performance monitoring** - Gallery loading time optimization

---

## 📱 **RESPONSIVE BEHAVIOR**

### **Desktop (990px+):**
- Layout style controls grid arrangement
- Hover effects and smooth animations
- Advanced video controls

### **Mobile (≤768px):**
- Automatically switches to mobile-optimized layout
- Touch-friendly thumbnail navigation
- Simplified controls for better UX

---

## 🔧 **IMPLEMENTATION EXAMPLES**

### **Example 1: Video-Heavy Store**
```
Layout Style: Video-Focused
Aspect Ratio: 16:9 Widescreen
Auto-swap: Enabled, On video load
Video Controls: Show on hover
Analytics: Enabled
```

### **Example 2: Mobile-First Store**
```
Layout Style: Mobile-First Vertical
Aspect Ratio: Auto (Original ratio)
Auto-swap: Enabled, On video play
Video Controls: Always visible
Thumbnail Count: 3
```

### **Example 3: Traditional E-commerce**
```
Layout Style: Classic Two-Column
Aspect Ratio: 4:3 Standard
Auto-swap: Disabled
Video Controls: Always visible
Border Radius: 0px (square corners)
```

---

## 🎥 **HOW YOUR AUTO-SWAP WORKS**

### **The Magic Behind Your Request:**
1. **User visits product page** → First image shows
2. **Video starts loading** → Auto-swap triggers
3. **Smooth animation** → Positions swap with indicators
4. **Video moves to top** → First image moves down
5. **Session memory** → Remembers preference

### **Customizable Triggers:**
- **`onload`** (Default) - Swaps when video file loads
- **`onplay`** - Swaps when user plays video
- **`onhover`** - Swaps when user hovers video
- **`onclick`** - Swaps when user clicks video

---

## 📊 **ANALYTICS TRACKING**

### **Events Tracked (when enabled):**
- `video_play` - Video playback started
- `video_pause` - Video paused by user
- `video_complete` - Video watched to completion
- `thumbnail_click` - Thumbnail navigation used

### **Integration:**
- Compatible with Google Analytics
- Works with Google Tag Manager
- Custom event tracking for optimization

---

## 🔍 **DEBUGGING & TROUBLESHOOTING**

### **Debug Mode Features:**
- Console logging of gallery initialization
- Auto-swap event tracking
- Performance metrics display
- Settings validation

### **Console Commands for Testing:**
```javascript
// Check gallery settings
console.log(document.querySelector('.custom-media-gallery').dataset);

// Test auto-swap manually
document.querySelector('video').dispatchEvent(new Event('loadstart'));

// Check performance
console.log('Gallery load time:', performance.now() + 'ms');
```

---

## 🚀 **NEXT STEPS**

### **Testing Your Settings:**
1. **Go to a product page** with videos
2. **Open theme customizer** 
3. **Adjust settings** in "GenStock Video Settings"
4. **See changes instantly** in preview
5. **Save when satisfied**

### **Recommended Settings for Testing:**
```
✅ Enable auto-swap gallery: ON
✅ Swap trigger event: When video loads
✅ Animation speed: Fast (0.3s)
✅ Show swap indicators: ON
✅ Layout style: Modern Grid
✅ Debug mode: ON (for testing)
```

---

## 🎯 **SUMMARY: YOUR REQUESTS FULFILLED**

| **Your Original Request** | **Implementation Status** | **Customization Level** |
|---------------------------|----------------------------|--------------------------|
| Auto-swap gallery (1st pic ↔ 2nd video) | ✅ **COMPLETE** | **Fully customizable** |
| Custom data integration | ✅ **COMPLETE** | **Automatic** |
| Description widget connection | ✅ **COMPLETE** | **Built-in** |
| Variant-preview sync | ✅ **COMPLETE** | **Advanced** |
| Custom variables system | ✅ **COMPLETE** | **20+ settings** |
| Preview rules configuration | ✅ **COMPLETE** | **4 trigger options** |
| Theme redesign options | ✅ **COMPLETE** | **4 layout styles** |

---

**🎉 ALL YOUR REQUESTS ARE NOW LIVE AND FULLY CUSTOMIZABLE!**

**Next:** Test your settings in the Shopify theme customizer and enjoy complete control over your video gallery experience! 