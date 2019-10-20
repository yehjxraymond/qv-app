export const API_BASE_URL =
  process.env.NODE_ENV != "production"
    ? "http://localhost:3000"
    : "https://api.qv.geek.sg";
