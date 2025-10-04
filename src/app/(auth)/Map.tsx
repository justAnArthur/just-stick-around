"use client"

import { GoogleMap, GoogleMapProps, Marker, useLoadScript } from '@react-google-maps/api'
import { useRef, useState } from "react"
import { getSpotsForCoordinates } from "@/app/(auth)/Map.actions"
import type { SpotWithFileNUsers } from "@/database/schema"
import { useCurrentLocation } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { openSpotDetailsDialog } from "@/app/(auth)/SpotDetailsDialog"

const defaultCenter = ({
  lat: 50.067005,
  lng: 19.991579
})

export default function StickerMap() {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! })

  const [map, setMap] = useState<google.maps.Map | undefined>()

  const [spots, setSpots] = useState<SpotWithFileNUsers[]>()

  async function loadSpots() {
    if (!map)
      return

    const bounds = map.getBounds()

    if (!bounds)
      return

    setSpots(await getSpotsForCoordinates(bounds.toJSON()))
  }

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  function debouncedLoadSpots() {
    if (debounceRef.current)
      clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      loadSpots()
    }, 2000)
  }

  const currentLocation = useCurrentLocation()

  if (!isLoaded)
    return <Skeleton className="w-full h-full"/>

  return (
    <GoogleMap
      {...mapProps}
      onLoad={setMap}
      center={defaultCenter}
      onBoundsChanged={debouncedLoadSpots}
    >
      {spots?.map((spot) => {
        const size = 100
        return (
          <Marker
            key={spot.id}
            title={spot.name}
            position={{ lat: spot.lat, lng: spot.lng }}
            icon={{
              url: spot.usersToSpots?.length > 0 ? '/hackyear.png' : spot.file?.path!,
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size / 2, size / 2)
            }}
            onClick={() => openSpotDetailsDialog(spot)}
          />
        )
      })}

      {currentLocation
        && <Marker
          position={currentLocation}
          title="You are here"
          icon={{
            url: '/globe.svg',
            scaledSize: new google.maps.Size(100, 100),
            anchor: new google.maps.Point(50, 50)
          }}
        />}
    </GoogleMap>
  )
}

const containerStyle = {
  width: '100%',
  height: '100vh'
}

const mapProps: GoogleMapProps = {
  zoom: 13,
  mapContainerStyle: containerStyle,
  options: {
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    scaleControl: false,
    panControl: false
  }
}

