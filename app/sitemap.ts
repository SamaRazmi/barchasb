export default async function sitemap() {
  return [
    {
      url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      lastModified: new Date(),
    },
  ];
}
