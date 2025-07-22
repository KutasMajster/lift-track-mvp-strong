import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b5d43da7a52b47a9bf15064481ebe27e',
  appName: 'lift-track-mvp-strong',
  webDir: 'dist',
  server: {
    url: 'https://b5d43da7-a52b-47a9-bf15-064481ebe27e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;