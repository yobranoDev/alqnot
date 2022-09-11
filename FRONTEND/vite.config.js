import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
const path = require('path');


export default defineConfig({
// Paths
resolve: {
  alias: [
    { find: '@src-utils', replacement: path.resolve(__dirname, './src/utils/') },
    { find: '@src-views', replacement: path.resolve(__dirname, './src/views/') },
    { find: '@src-contexts', replacement: path.resolve(__dirname, './src/contexts/') },
    { find: '@src-styles', replacement: path.resolve(__dirname, './src/styles/') },
    { find: '@src-components', replacement: path.resolve(__dirname, './src/components/') },
  ],
},


  plugins: [react()]
})
