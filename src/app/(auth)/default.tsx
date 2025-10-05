"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("./StickersMap"), { ssr: false })

export default function MapPage() {
  return <Map/>
}
