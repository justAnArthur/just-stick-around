"use client"

import { createContext, FC, ReactNode, useContext } from "react"
import { toast } from "sonner"
import { useCurrentLocation } from "@/lib/useCurrentLocation"

const LocationContext = createContext<ReturnType<typeof useCurrentLocation> | undefined>(undefined)

export const LocationProvider: FC<{ children: ReactNode }> = (props) => {
  const location = useCurrentLocation(
    (err) => {
      if (JSON.stringify(err) === "{}")
        toast.error("Could not get your location, please allow location access")
      else
        toast.error(err.message)
    }
  )

  return (
    <LocationContext.Provider value={location}>
      {props.children}
    </LocationContext.Provider>
  )
}

export function useLocationContext() {
  const context = useContext(LocationContext)

  if (context === undefined)
    throw new Error("useLocationContext must be used within a LocationProvider")

  return context
}
