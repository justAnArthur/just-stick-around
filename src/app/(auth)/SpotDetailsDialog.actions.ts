"use server"

import { db } from "@/database/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSpotDetails(spotId: string) {
  const user = (await auth.api.getSession({ headers: await headers() })).user
  if (!user)
    throw new Error("Not authenticated")

  return db.query.spots.findFirst({
    where: (spots, { eq }) => eq(spots.id, spotId),
    with: {
      file: true,
      usersToSpots: {
        where: (usersToSpots, { eq }) => eq(usersToSpots.userId, user.id)
      }
    }
  })
}
