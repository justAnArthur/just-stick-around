import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Just Stick Around",
    short_name: "Just Stick Around",
    description:
      "Web application (cross-platform) to discover and explore new places and sticking them into your digital profile as stickers on luggage.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      }
    ]
  }
}
