"use server"

import { db } from "@/database/db"
import { spots } from "@/database/schema"
import { sql } from "drizzle-orm"

export async function getAvailableSpots(lat: number, lng: number, maxDistance: number = 0.001 /* roughly within 100 meters */) {
  return db.select()
    .from(spots)
    .where(sql`
      (6371 * acos(
        cos(radians(${lat})) * cos(radians(${spots.lat})) *
        cos(radians(${spots.lng}) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(${spots.lat}))
        ))
      <
      ${maxDistance * 111.139} -- convert degrees to km (1 deg ≈ 111.139 km)
    `)
}
