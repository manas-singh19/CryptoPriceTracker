# CryptoPriceTracker Project Documentation

## File Structure Summary
```
CryptoPriceTracker03/
├── App.js - Main application component
├── Gemfile - Ruby dependencies for iOS projects
├── README.md - Default project README
├── __tests__/ - Test directory
│   └── App.test.tsx - Jest test for main component
├── android/ - Android-specific native code
│   ├── ... (Android project structure)
├── app.json - React Native project configuration
├── babel.config.js - Babel configuration for JavaScript
├── index.js - Entry point for the app
├── ios/ - iOS-specific native code
│   ├── ... (iOS project structure)
├── jest.config.js - Jest testing framework configuration
├── metro.config.js - Metro bundler configuration
├── package-lock.json - npm package lock file
├── package.json - Project metadata and dependencies
├── src/ - Source code directory
│   ├── MainScreen.js - Main application screen
│   ├── components/ - Reusable UI components
│   │   ├── ConnectionStatus.js
│   │   ├── ErrorBoundary.js
│   │   ├── PriceCard.js
│   │   └── PriceChart.js
│   ├── hooks/ - Custom React hooks
│   │   └── useAnimatedUpdate.js
│   └── services/ - API/services
│       └── WebSocketService.js
└── tsconfig.json - TypeScript configuration
```

## Detailed Component Documentation

### Core Application Files
1. **App.js**: 
   - Main entry component for the application
   - Typically contains the root navigation structure
   - Uses MainScreen component as the primary display

2. **MainScreen.js**:
   - Core screen component
   - Coordinates between various UI components
   - Manages overall screen layout and structure

3. **ConnectionStatus.js**:
   - Component showing network connectivity status
   - Visual indicator for WebSocket connection state

4. **ErrorBoundary.js**:
   - React error boundary component
   - Handles and displays UI errors gracefully

5. **PriceCard.js**:
   - Card component displaying individual cryptocurrency data
   - Contains price information, market changes, etc.

6. **PriceChart.js**:
   - Interactive chart component for price history visualization
   - Shows price trends over time

### Services
**WebSocketService.js**:
- Manages real-time cryptocurrency data via WebSocket
- Implements connection handling, error recovery, and data parsing

### Hooks
**useAnimatedUpdate.js**:
- Custom React hook for smooth UI transitions
- Handles animated updates of price data
- Implements performance optimizations for frequent updates

### Configuration Files
- **babel.config.js**: Configuration for JavaScript/TypeScript transpilation
- **metro.config.js**: Bundler settings for development and production
- **tsconfig.json**: TypeScript compiler options and project settings
- **jest.config.js**: Testing framework configuration

### Native Code Directories
- **android/**: Android platform-specific code and configuration
- **ios/**: iOS platform-specific code and configuration
- **Podfile**: CocoaPods dependencies for iOS projects

### Testing
- **__tests__/App.test.tsx**: Unit test for the main application component
- **jest.config.js**: Jest configuration for testing framework

### Development Tools
- **Gemfile**: Required gems for iOS development
- Package Files:
  - **package.json**: npm package metadata and scripts
  - **package-lock.json**: Version-locked dependencies

## How to Run the App Locally

### Prerequisites
1. Node.js LTS version installed
2. npm/yarn package manager
3. React Native CLI: `npm install -g react-native-cli`
4. For iOS:
   - Xcode (latest version)
   - CocoaPods: `sudo gem install cocoapods`
5. For Android:
   - Android Studio with Android SDK configured
   - Emulator or physical device

### Installation Steps
1. Clone the repository
2. Navigate to project directory:
   ```shell
   cd CryptoPriceTracker03
   ```

3. Install dependencies:
   ```shell
   npm install
   # or
   yarn install
   ```

### Running on Android
```shell
# Start Metro Bundler
npx react-native start

# In a new terminal window
npx react-native run-android
```

### Running on iOS
```shell
# Install CocoaPods dependencies
cd ios && pod install && cd ..

# Start Metro Bundler
npx react-native start

# Run on iOS simulator
npx react-native run-ios
```

### Alternative One-Command Run
```shell
# Android
npm run android
# iOS
npm run ios
```

### Common Issues
- **iOS Podfile issues**: Run `cd ios && pod update` then retry
- **Metro Bundler errors**: Delete `node_modules` and rerun install
- **Android build errors**: Try Gradle clean: `cd android && ./gradlew clean`

