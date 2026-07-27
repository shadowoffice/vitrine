// Vitest runs in Node.js, outside React's `react-server` export condition.
// This empty module preserves production's `server-only` guard while allowing
// isolated tests to import server modules.
export {};
