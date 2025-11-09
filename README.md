# Christian Antonee Health 🚀

![Release](https://github.com/moulie415/ChristianAntoneeHealth/actions/workflows/semantic-release.yml/badge.svg)

## Setup

Setup .env file and populate env variables

```bash
cp .env.example .env
```

Make sure you have your `google-services.json` file in `android/app` and  `GoogleService-Info.plist` in `ios/HealthAndMovement` folders

Next install dependencies and then you can run iOS or Android

```bash
npm i
cd ios
pod install
cd ..
npm run ios
npm run android
```
