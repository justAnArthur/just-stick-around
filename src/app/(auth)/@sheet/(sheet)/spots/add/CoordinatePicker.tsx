"use client"

import { FC, useState } from "react"
import { GoogleMap, GoogleMapProps, Marker, useLoadScript } from "@react-google-maps/api"
import { useCurrentLocation } from "@/lib/useCurrentLocation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const defaultCenter = ({
  lat: 50.067005,
  lng: 19.991579
})

export const CoordinatePicker: FC<{ onValueChange: (cords: { lat: number, lng: number }) => void }> = (
  { onValueChange }
) => {
  const currentLocation = useCurrentLocation()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  })

  const [marker, setMarker] = useState<{ lat: number, lng: number }>()

  function handleClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng)
      return

    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    setMarker(position)
    onValueChange?.(position)
  }

  function handleUseCurrentLocation() {
    if (!currentLocation)
      return

    setMarker(currentLocation)
    onValueChange?.(currentLocation)
  }

  if (!isLoaded)
    return <Skeleton className="w-full h-[20rem]"/>

  return <>
    <GoogleMap
      {...mapProps}
      center={marker || defaultCenter}
      zoom={marker ? 14 : 7}
      onClick={handleClick}
    >
      {marker && <Marker position={marker}/>}

      {currentLocation
        && <Marker
          position={currentLocation}
          title="You are here"
          icon={{
            url: '/blue-dot.png',
            scaledSize: new google.maps.Size(20, 20),
            anchor: new google.maps.Point(10, 10)
          }}
        />}
    </GoogleMap>

    {currentLocation &&
      <Button size="sm" onClick={handleUseCurrentLocation} className="w-fit mt-">
        Use current location
      </Button>}
  </>
}

const containerStyle = {
  width: '100%',
  height: '20rem',
  overflow: 'hidden',
  borderRadius: '0.375rem'
}

const mapProps: GoogleMapProps = {
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
