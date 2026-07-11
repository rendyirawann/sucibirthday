// Prefix path aset di public/ dengan base URL Vite
// ('/sucibirthday/' di production, '/' saat dev).
export function asset(path) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
