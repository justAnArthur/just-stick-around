"use client"

import { FC, FormEvent, ReactNode, useEffect, useState } from "react"
import { getAvailableSpots, spotPlace } from "./actions"
import type { Spot } from "@/database/schema"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { LoaderCircleIcon, RefreshCcwIcon } from "lucide-react"
import { useLocationContext } from "@/app/(auth)/LocationProvider"
import { toast } from "sonner"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { useCamera } from "@/lib/useCamera"

export default function AddPlace() {
  const router = useRouter()

  function handleOnSubmit() {
    router.push('/')
  }

  return <>
    <SheetHeader className="sr-only">
      <SheetTitle>Adding new spot</SheetTitle>
    </SheetHeader>
    <main className="p-4">
      <AddPlaceCheckWrapper>
        <AddPlaceForm onSubmit={handleOnSubmit}/>
      </AddPlaceCheckWrapper>
    </main>
  </>
}

const AddPlaceCheckWrapper: FC<{ children: ReactNode }> = (
  { children }
) => {
  const currentLocation = useLocationContext()

  const [availableSpots, setAvailableSpots] = useState<Spot[]>()

  useEffect(() => {
    if (!currentLocation)
      return

    getAvailableSpots(currentLocation.lat, currentLocation.lng).then(setAvailableSpots)
  }, [currentLocation])

  console.log(availableSpots)

  if (!(currentLocation && availableSpots))
    return <Skeleton className="w-full aspect-[4/3]"/>

  if (availableSpots.length === 0)
    return <div className="w-fill aspect-[4/3] grid place-content-center"><p>There is no spot around you 😬</p></div>

  return <>
    <div className="border border-border rounded-md p-2 mb-4 text-center text-sm">
      Spot found: <strong>{availableSpots[0].name}</strong>
    </div>

    {children}
  </>
}

const AddPlaceForm: FC<{ onSubmit?: (spot: Spot) => void }> = (
  { onSubmit }
) => {
  const currentLocation = useLocationContext()

  const { image, captureImage, again, setFacingMode, videoRef, canvasRef } = useCamera()

  const [loading, setLoading] = useState(false)

  async function handleOnSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (!currentLocation || !image)
      return

    try {
      const spot = await spotPlace(image, currentLocation.lat, currentLocation.lng)

      toast.success('Spot added successfully!')

      onSubmit?.(spot)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
      {image
        ? <>
          <img
            src={image}
            className="bg-muted rounded-md"
            style={{ width: '100%' }}
          />

          <div className="flex items-center gap-4">
            <Button onClick={again} variant="outline" size="lg" className="font-semibold text-xl">
              Retake
            </Button>

            <Button type="submit" size="lg" className="flex-1 font-semibold text-xl flex items-center gap-1"
                    disabled={loading}>
              {loading && <LoaderCircleIcon size={20} className="animate-spin"/>}
              <div>
                Submit
              </div>
            </Button>
          </div>
        </>
        : <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="bg-muted rounded-md"
            style={{ width: '100%' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }}/>

          <div className="flex items-center gap-4">
            <Button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')}
                    size="lg" className="aspect-square">
              <RefreshCcwIcon size={20}/>
            </Button>
            <Button onClick={captureImage}
                    size="lg" className="flex-1 font-semibold text-xl">
              Capture
            </Button>
          </div>
        </>}
    </form>
  )
}

