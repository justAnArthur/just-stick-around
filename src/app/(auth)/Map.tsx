import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useState } from "react"
import { spots } from "@/app/(auth)/spots"

const containerStyle = {
  width: '100%',
  height: '100vh'
}

const defaultCenter = ({
  lat: 50.067005,
  lng: 19.991579
})

export default function StickerMap() {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! })

  const [map, setMap] = useState<google.maps.Map | undefined>()

  const spots = map && map.getBounds() &&
    getSpotsForCoordinates(map.getBounds()!)

  if (!isLoaded)
    return <div>Loading Map...</div>

  return (
    <GoogleMap
      onLoad={setMap}
      mapContainerStyle={containerStyle} center={defaultCenter} zoom={13}
      options={{
        fullscreenControl: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        scaleControl: false,
        panControl: false
      }}
      onBoundsChanged={() => {
        // todo
      }}
    >
      {spots?.map((spot) => {
        const size = 100
        return (
          <Marker
            key={spot.id}
            position={{ lat: spot.lat, lng: spot.lng }}
            icon={{
              url: spot.stickerUrl,
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size / 2, size / 2)
            }}
            title={spot.name}
          />
        )
      })}
    </GoogleMap>
  )
}

function getSpotsForCoordinates(bounds: google.maps.LatLngBounds) {
  /*todo filtering*/
  return spots
}
