import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
        loser: resolve(__dirname, 'loser.html'),
        winner: resolve(__dirname, 'winner.html'),
      }
    }
  }
})