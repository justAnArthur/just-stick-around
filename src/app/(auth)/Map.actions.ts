"use server"

import { db } from "@/database/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSpotsForCoordinates(bounds: google.maps.LatLngBoundsLiteral) {
  /*todo filtering by bounds*/

  const user = (await auth.api.getSession({ headers: await headers() })).user
  if (!user)
    throw new Error("Not authenticated")

  return (
    db.query.spots.findMany({
      with: {
        file: true,
        usersToSpots: {
          where: (usersToSpot, { eq }) =>
            eq(usersToSpot.userId, user.id)
        }
      }
    })
  )
}
