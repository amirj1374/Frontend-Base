// Empty module used to shim Node-only builtins (e.g. `stream`, `fs`) that some
// browser-bundled libraries (SheetJS / xlsx) reference but never actually use in
// the browser. Aliasing those builtins here removes Vite's noisy
// "Module … has been externalized for browser compatibility" warnings without
// pulling in heavy polyfills. The browser code paths never touch these members.
export default {};
