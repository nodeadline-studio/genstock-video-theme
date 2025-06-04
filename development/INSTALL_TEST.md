# 🧪 SPOTLIGHT-MOD COMPACT EDITION - TEST RELEASE

## 📦 **TEST RELEASE INFO**
- **Version**: v1.0.0-TEST
- **Build Date**: January 30, 2025
- **Target**: Ultra-compact one-screen design
- **Status**: Ready for testing

## 🚀 **QUICK INSTALL GUIDE**

### 1. **Backup Current Theme**
```bash
# Always backup before testing!
# Download your current theme from Shopify Admin > Themes
```

### 2. **Upload to Shopify**
1. Go to **Shopify Admin > Online Store > Themes**
2. Click **"Add theme"** > **"Upload zip file"**
3. Upload the `Spotlight-Mod` folder as zip
4. **DO NOT** activate yet - test first!

### 3. **Preview & Test**
1. Click **"Preview"** on the uploaded theme
2. Navigate to any product page
3. Test on both desktop and mobile

## ✅ **CRITICAL TEST CHECKLIST**

### **Desktop Testing (990px+)**
- [ ] **One Screen Fit**: Entire product page visible without scrolling
- [ ] **Layout**: 60% media gallery, 40% product info
- [ ] **Video Gallery**: Videos play with controls
- [ ] **PayPal Button**: Clickable and functional
- [ ] **Add to Cart**: Working with loading animation
- [ ] **Variant Selection**: Price updates correctly

### **Mobile Testing (≤749px)**
- [ ] **Two Screen Limit**: Max 60vh media + 40vh info
- [ ] **Stack Layout**: Media above, info below
- [ ] **Touch Controls**: All buttons touchable
- [ ] **Thumbnails**: 60x45px size working
- [ ] **PayPal Express**: Functional on mobile
- [ ] **Share Button**: Native share or copy fallback

### **Core Functionality**
- [ ] **Product Loading**: No 404 errors
- [ ] **Cart Integration**: Items add successfully  
- [ ] **Payment Methods**: All payment types working
- [ ] **Price Display**: Accurate pricing shown
- [ ] **Loading States**: Smooth animations
- [ ] **Error Handling**: Graceful error messages

## 🐛 **TEST SCENARIOS**

### **Scenario 1: Product with Multiple Variants**
1. Go to product with 2+ variants
2. Change variant in dropdown
3. Verify price updates
4. Verify button text updates
5. Add to cart and check quantity

### **Scenario 2: PayPal Express Checkout**
1. Click PayPal button (don't complete purchase)
2. Verify PayPal popup opens
3. Cancel and return to site
4. Try standard "Add to Cart"
5. Verify cart updates

### **Scenario 3: Mobile Experience**
1. Open product on mobile device
2. Verify media fits in first 60vh
3. Scroll once to see product info
4. Test thumbnail navigation
5. Test add to cart button

### **Scenario 4: Video Gallery**
1. Product with video + images
2. Click thumbnails to switch
3. Verify video plays with controls
4. Test on both desktop and mobile
5. Check aspect ratio maintains

## 🔧 **CONFIGURATION NEEDED**

### **Metafields Setup** (Optional)
```json
Namespace: custom
Key: video_duration_
Type: list.number_integer
Values: [30, 45, 60] (seconds)

Namespace: custom  
Key: video_resolutions
Type: list.single_line_text_field
Values: ["1920x1080 HD", "4K Ultra HD"]
```

### **Test Products Setup**
1. Create test product with:
   - 2-3 variants
   - 1 image + 1-2 videos
   - Price variants ($10, $15, $20)
   - Stock availability

## 📊 **EXPECTED RESULTS**

### **Performance Targets**
- **Page Load**: < 2 seconds
- **First Contentful Paint**: < 1.5 seconds  
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1

### **Layout Verification**
- **Desktop Height**: ≤ 100vh total
- **Mobile Height**: ≤ 100vh total (60vh + 40vh)
- **Gallery Size**: 60x45px thumbnails
- **Typography**: Readable on all devices

## ❌ **KNOWN LIMITATIONS**

1. **Social Sharing**: Simplified to native share only
2. **Trust Badges**: Reduced to 3 essential items  
3. **Product Meta**: Compact specs display only
4. **SEO Data**: Minimal structured data

## 🆘 **TROUBLESHOOTING**

### **PayPal Not Working**
1. Check Shopify Payments settings
2. Verify PayPal is enabled in admin
3. Test with different product
4. Check browser console for errors

### **Layout Breaking**
1. Clear browser cache
2. Check for CSS conflicts
3. Verify responsive breakpoints
4. Test in incognito mode

### **Videos Not Playing**
1. Verify video files are valid MP4
2. Check file size limits
3. Test with different video
4. Verify media permissions

## 📞 **SUPPORT**

### **Getting Help**
- Check browser console for errors
- Test in multiple browsers
- Verify Shopify settings
- Document any issues found

### **Issue Reporting**
When reporting issues, include:
- Browser and version
- Device type (desktop/mobile)
- Specific steps to reproduce
- Screenshots if applicable
- Console error messages

---

## 🎯 **SUCCESS CRITERIA**

✅ **PASS**: All checklist items working  
✅ **PASS**: One screen desktop, max 2 screens mobile  
✅ **PASS**: PayPal and cart fully functional  
✅ **PASS**: No console errors or 404s  

**Ready for production when all criteria met!** 