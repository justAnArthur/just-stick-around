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
    (await db.query.spots.findMany({
      with: {
        file: true,
        usersToSpots: {
          where: (usersToSpots, { eq }) =>
            eq(usersToSpots.userId, user.id),
          with: {
            file: true
          }
        },
        creator: true,
        dependsOnSpot: {
          with: {
            usersToSpots: {
              where: (usersToSpots, { eq }) => eq(usersToSpots.userId, user.id)
            }
          }
        }
      }
    }))
      .filter(spot => !spot.dependsOnSpot || spot.dependsOnSpot.usersToSpots.length > 0)
  )
}
