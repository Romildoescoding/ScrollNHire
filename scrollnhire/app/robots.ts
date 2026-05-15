export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://scrollnhire.vercel.app/sitemap.xml",
  };
}
