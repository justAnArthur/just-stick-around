"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"

export async function getSpotDetails(spotId: string) {
  const user = (await auth.api.getSession({ headers: await headers() })).user
  if (!user)
    throw new Error("Not authenticated")

  return db.query.spots.findFirst({
    where: (spots, { eq }) => eq(spots.id, spotId),
    with: {
      file: true,
      usersToSpots: {
        where: (usersToSpots, { eq }) => eq(usersToSpots.userId, user.id),
        with: {
          file: true
        }
      }
    }
  })
}
