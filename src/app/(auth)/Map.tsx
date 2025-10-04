"use client"

import { GoogleMap, GoogleMapProps, Marker, useLoadScript } from '@react-google-maps/api'
import { useEffect, useState } from "react"
import { getSpotsForCoordinates } from "@/app/(auth)/Map.actions"
import type { SpotWithFile } from "@/database/schema"

const defaultCenter = ({
  lat: 50.067005,
  lng: 19.991579
})

export default function StickerMap() {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! })

  const [map, setMap] = useState<google.maps.Map | undefined>()

  const [spots, setSpots] = useState<SpotWithFile[]>()

  function loadSpots() {
    if (!map)
      return

    const bounds = map.getBounds()

    if (!bounds)
      return

    getSpotsForCoordinates(bounds.toJSON()).then(setSpots)
  }

  useEffect(() => {
    loadSpots()
  }, [])

  if (!isLoaded)
    return <div>Loading Map...</div>

  return (
    <GoogleMap
      {...mapProps}
      onLoad={setMap}
      center={defaultCenter}
      onBoundsChanged={() => loadSpots()}
    >
      {spots?.map((spot) => {
        const size = 100
        return (
          <Marker
            key={spot.id}
            title={spot.name}
            position={{ lat: spot.lat, lng: spot.lng }}
            icon={{
              url: spot.file?.path,
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size / 2, size / 2)
            }}
          />
        )
      })}
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

