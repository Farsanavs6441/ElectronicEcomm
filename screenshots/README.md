# Screenshots Guide

## How to Add Screenshots to the Project

This directory contains all the screenshots and GIFs referenced in the main README.md file.

## Required Screenshots

### iOS Screenshots
1. **ios-products-tab.png** - Products tab showing the grid layout
2. **ios-product-details.png** - Product details page with Add to Cart button
3. **ios-favourites-tab.png** - Favourites tab with saved products
4. **ios-search.png** - Search functionality in action
5. **ios-cart-icon.png** - Cart icon with item count
6. **ios-splash-screen.png** - Splash screen on app launch

### Android Screenshots
1. **android-products-tab.png** - Products tab showing the grid layout
2. **android-product-details.png** - Product details page with Add to Cart button
3. **android-favourites-tab.png** - Favourites tab with saved products
4. **android-search.png** - Search functionality in action
5. **android-cart-icon.png** - Cart icon with item count
6. **android-splash-screen.png** - Splash screen on app launch

### Web Screenshots
1. **web-desktop-view.png** - Desktop view with 2-column layout
2. **web-tablet-view.png** - Tablet responsive view
3. **web-mobile-view.png** - Mobile web view

### Animated GIFs
1. **cart-animation.gif** - Add to Cart success animation
2. **deep-link-demo.gif** - Deep linking navigation demo
3. **pull-to-refresh.gif** - Pull to refresh animation

## How to Create Animated GIFs

### Using Screen Recording Tools

#### macOS (for iOS Simulator)
1. Press `Cmd + Shift + 5` to open screenshot toolbar
2. Select "Record Selected Portion"
3. Record the animation
4. Convert to GIF using:
   ```bash
   # Install ffmpeg if not already installed
   brew install ffmpeg

   # Convert video to GIF
   ffmpeg -i recording.mov -vf "fps=10,scale=320:-1" -pix_fmt rgb24 output.gif
   ```

#### Windows/Linux (for Android Emulator)
1. Use OBS Studio or similar screen recorder
2. Record the specific animation
3. Convert to GIF using online tools or ffmpeg

### Optimizing GIFs
```bash
# Optimize GIF file size
gifsicle -O3 --colors 128 input.gif -o output.gif
```

## Screenshot Naming Convention

Use descriptive names following this pattern:
- Platform: `mobile-`, `web-`, `ios-`, `android-`
- Feature: `product-list`, `product-details`, `favorites`, etc.
- Type: `.png` for static, `.gif` for animated

Examples:
- `mobile-product-list.png`
- `web-desktop-view.png`
- `cart-animation.gif`

## Adding Screenshots to README

Once screenshots are captured and placed in this directory, they will automatically be displayed in the main README.md using markdown image syntax:

```markdown
![Alt Text](./screenshots/filename.png)
*Caption describing the screenshot*
```

## Current Screenshot Status

### iOS Screenshots
- [ ] ios-products-tab.png
- [ ] ios-product-details.png
- [ ] ios-favourites-tab.png
- [ ] ios-search.png
- [ ] ios-cart-icon.png
- [ ] ios-splash-screen.png

### Android Screenshots
- [ ] android-products-tab.png
- [ ] android-product-details.png
- [ ] android-favourites-tab.png
- [ ] android-search.png
- [ ] android-cart-icon.png
- [ ] android-splash-screen.png

### Web Screenshots
- [ ] web-desktop-view.png
- [ ] web-tablet-view.png
- [ ] web-mobile-view.png

### Animated GIFs
- [ ] cart-animation.gif
- [ ] deep-link-demo.gif
- [ ] pull-to-refresh.gif

## Tips for Good Screenshots

1. **Clear Content**: Ensure product images are loaded
2. **Clean State**: Show realistic but clean data
3. **Consistent Size**: Keep similar screenshots at same dimensions
4. **Highlight Features**: Show the key functionality clearly
5. **No Personal Data**: Ensure no sensitive information is visible

## Alternative: Placeholder Images

If you want to use placeholder images temporarily:

```bash
# Create placeholder images using ImageMagick
convert -size 375x667 xc:lightgray -pointsize 30 \
  -draw "text 100,350 'Product List Screen'" \
  mobile-product-list.png
```

Or use online placeholder services:
- https://placeholder.com/
- https://via.placeholder.com/