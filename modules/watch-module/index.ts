// Reexport the native module. On web, it will be resolved to WatchModule.web.ts
// and on native platforms to WatchModule.ts
export { default } from './src/WatchModule';
export * from './src/WatchModule.types';
