import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow normal search engines
      {
        userAgent: "*",
        allow: "/",
      },
      // Block AI crawlers / scrapers
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "Google-Extended",
          "anthropic-ai",
          "ClaudeBot",
          "Bytespider",
          "FacebookBot",
          "cohere-ai",
        ],
        disallow: "/",
      },
    ],
  };
}
