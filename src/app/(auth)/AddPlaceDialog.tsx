"use client"

import { FC, FormEvent, ReactNode, useEffect, useState } from "react"
import { useCamera, useCurrentLocation } from "@/lib/utils"
import { getAvailableSpots } from "@/app/(auth)/AddPlaceDialog.actions"
import { Spot } from "@/database/schema"

const openListeners = [] as (() => void)[]

export function openAddPlaceDialog() {
  openListeners.forEach(listener => listener())
}

export const AddPlaceDialog: FC = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const listener = () => setOpen(true)

    openListeners.push(listener)

    return () => {
      const index = openListeners.indexOf(listener)
      if (index > -1)
        openListeners.splice(index, 1)
    }
  }, [])

  if (!open)
    return null

  return (
    <div className="grid place-content-center fixed z-50 inset-x-0 bottom-0 bg-white p-4">
      <AddPlaceCheckWrapper>
        <AddPlaceForm/>
      </AddPlaceCheckWrapper>
    </div>
  )
}

export const AddPlaceCheckWrapper: FC<{ children: ReactNode }> = (
  { children }
) => {
  const currentLocation = useCurrentLocation()

  const [availableSpots, setAvailableSpots] = useState<Spot[]>()

  useEffect(() => {
    if (!currentLocation)
      return

    getAvailableSpots(currentLocation.lat, currentLocation.lng).then(setAvailableSpots)
  }, [currentLocation])

  if (!(currentLocation && availableSpots))
    return <p>Loading</p>

  if (availableSpots.length === 0)
    return <p>There is no spot around you</p>

  return children
}

export const AddPlaceForm: FC = () => {
  const { image, captureImage, again, videoRef, canvasRef } = useCamera()

  function handleOnSubmit(e: FormEvent) {
    e.preventDefault()


  }

  return (
    <form onSubmit={handleOnSubmit}>
      {image
        ? <>
          <img src={image} alt="Captured" style={{ width: '100%', maxWidth: '400px' }}/>

          <div>
            <button type="button" onClick={again}>
              again
            </button>

            <button type="submit">
              submit
            </button>
          </div>
        </>
        : <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', maxHeight: '400px', borderRadius: '8px' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }}/>

          <button type="button" onClick={captureImage}>
            create
          </button>
        </>}
    </form>
  )
}

