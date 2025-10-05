"use client"

import { useEffect, useState } from "react"

export function useCurrentLocation(onError?: (error: GeolocationPositionError) => void) {
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null)

  useEffect(() => {
    if (!navigator.geolocation)
      return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
      },
      onError,
      { enableHighAccuracy: true }
    )
  }, [])

  return position
}
