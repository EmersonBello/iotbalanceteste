export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // 🔧 importante para React Router
  },
});
