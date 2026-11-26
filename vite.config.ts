import aitDevtools from '@apps-in-toss/devtools/unplugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `--mode toss` builds the Toss mini app bundle (npm run dev:toss / build:toss).
// The devtools plugin mocks the Toss SDK in a normal browser and adds nothing to production bundles.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'toss' ? [aitDevtools.vite(), react()] : [react()],
}))
