import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   outDir: 'dist', // Build vào thư mục Laravel public
  //   emptyOutDir: true, 
  //   rollupOptions: {
  //     input: './index.html', // Đảm bảo Rollup tìm thấy index.html
  //   },// Xóa nội dung cũ trước khi build
  // },
  // resolve: {
  //   extensions: ['.js', '.jsx'],
  //   alias: {
  //     '@': '/src', // Alias để đơn giản hóa import
  //   }, // Đảm bảo Vite xử lý được cả .jsx
  // },
  // base: '/nexusCRM/', // Đảm bảo asset được load đúng
})
