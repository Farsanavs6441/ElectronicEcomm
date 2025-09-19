# Deep Link Testing Guide

## Overview
The app now supports deep linking with the custom scheme `myshoplite://` with enhanced navigation handling to ensure direct navigation to specific product pages.

## Supported Deep Links

### Product Details
- **Format**: `myshoplite://product/{productId}`
- **Example**: `myshoplite://product/12`
- **Behavior**: Directly opens the specific product detail page, bypassing splash screen when possible

## Testing Methods

### iOS Simulator
1. Open Terminal
2. Run the command:
   ```bash
   xcrun simctl openurl booted "myshoplite://product/12"
   ```

### Android Emulator
1. Open Terminal
2. Run the command:
   ```bash
   adb shell am start -W -a android.intent.action.VIEW -d "myshoplite://product/12" com.electronicEcomm
   ```

### Android Device (via ADB)
1. Connect your Android device
2. Enable USB debugging
3. Run the command:
   ```bash
   adb shell am start -W -a android.intent.action.VIEW -d "myshoplite://product/12" com.electronicEcomm
   ```

## Available Product IDs for Testing
You can test with any product ID from the API. Common examples:
- `myshoplite://product/1`
- `myshoplite://product/2`
- `myshoplite://product/3`
- etc.

## Debugging
Check the console logs for enhanced deep link handling:
- Look for: "🔗 getInitialURL called, result:"
- Look for: "🎯 Processing deep link:"
- Look for: "📱 Product deep link detected, productId:"
- Look for: "✅ Navigation ready, navigating to ProductDetails"
- Look for: "🧭 Navigation state changed:"
- Look for: "🚀 Navigation container ready"

### Enhanced Navigation Handling
The app now includes:
- Manual navigation handling with NavigationRef
- Fallback navigation with timeout for slow initialization
- Better error handling and debug logging
- Direct navigation to ProductDetails screen bypassing splash when appropriate

## Configuration Files Updated
- ✅ `android/app/src/main/AndroidManifest.xml` - Added intent filter
- ✅ `ios/ElectronicEcomm/Info.plist` - Already configured
- ✅ `src/navigation/AppNavigator.tsx` - Enhanced linking configuration

## Expected Behavior
1. App opens/comes to foreground
2. Navigates directly to the specific product page
3. Shows product details, not the product list
4. Console shows deep link logs

## Troubleshooting
If deep links aren't working:
1. Rebuild the app after manifest changes
2. Check console logs for errors
3. Verify the product ID exists in the API
4. Ensure the app is installed and can be launched normally