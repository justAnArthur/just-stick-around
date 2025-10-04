"use server"

import { db } from "@/database/db"

export async function getSpotsForCoordinates(bounds: google.maps.LatLngBoundsLiteral) {
  /*todo filtering*/

  return db.query.spots.findMany({
    with: { file: true }
  })
}
