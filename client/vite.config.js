import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // This allows us to access VITE_OPENAI_API_KEY inside this config.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // The Proxy Rule:
        // Requests to "http://localhost:5173/api/openai/..."
        // are forwarded to "https://api.openai.com/v1/..."
        '/api/openai': {
          target: 'https://api.openai.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/openai/, ''),
          headers: {
            // INJECT THE KEY HERE (Securely on the "server" side)
            'Authorization': `Bearer ${env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      }
    }
  };
});