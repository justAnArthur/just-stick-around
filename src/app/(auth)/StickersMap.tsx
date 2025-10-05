"use client"

import { GoogleMap, GoogleMapProps, Marker, useLoadScript } from '@react-google-maps/api'
import { useRef, useState } from "react"
import { getSpotsForCoordinates } from "@/app/(auth)/actions"
import type { SpotWithFileNUsers } from "@/database/schema"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocationContext } from "@/app/(auth)/LocationProvider"
import { useRouter } from "next/navigation"

const defaultCenter = ({
  lat: 50.067005,
  lng: 19.991579
})

export let mapInstance: google.maps.Map

export default function StickersMap() {
  const router = useRouter()

  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! })
  const [map, setMap] = useState<google.maps.Map | undefined>()
  const currentLocation = useLocationContext()

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

  if (!isLoaded)
    return <Skeleton className="w-full h-full"/>

  return (
    <GoogleMap
      {...mapProps}
      onLoad={map => {
        setMap(map)
        mapInstance = map
      }}
      mapContainerClassName={spots === undefined ? "animate-pulse" : ""}
      center={defaultCenter}
      onBoundsChanged={debouncedLoadSpots}
    >
      {spots?.map((spot) => {
        const size = spot.usersToSpots?.length > 0 ? 200 : 120
        return (
          <Marker
            key={spot.id}
            title={spot.name}
            position={{ lat: spot.lat, lng: spot.lng }}
            icon={{
              url: spot.usersToSpots?.length > 0 ? spot.file?.path! : '/placeholder.png',
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size / 2, size / 2)
            }}
            onClick={() => router.push(`/spots/${spot.id}`)}
          />
        )
      })}

      {currentLocation
        && <Marker
          position={currentLocation}
          title="You are here"
          icon={{
            url: '/current-position.png',
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
          }}
        />}
    </GoogleMap>
  )
}

const containerStyle = {
  width: '100%',
  height: '100vh'
}

const mapStyle =

  [
    {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#444444"
        },
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#e0dfe0"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#a8a9a8"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#5b5b5a"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]

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
    panControl: false,
    styles: mapStyle
  }
}
