"use client"

import dynamic from "next/dynamic"
import { AddPlaceDialog } from "@/app/(auth)/AddPlaceDialog"

const Map = dynamic(() => import("./Map"), {
  ssr: false
})

export default function MapPage() {
  return <>
    <Map/>
  </>
}
