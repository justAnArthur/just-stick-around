"use server"

import { db } from "@/database/db"
import { Spot, spots, usersSpots } from "@/database/schema"
import { sql } from "drizzle-orm"
import OpenAI from "openai"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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
      ${maxDistance * 111.139}
    `) // convert degrees to km (1 deg ≈ 111.139 km)
}

export async function spotPlace(image: string, lat: number, lng: number) {
  const user = (await auth.api.getSession({ headers: await headers() })).user
  if (!user)
    throw new Error("Not authenticated")

  const [spot] = await getAvailableSpots(lat, lng)
  if (!spot)
    throw new Error('No spot found around you')

  const { confidence, reason } = await checkSpot(image, spot)

  console.log({ confidence, reason })

  if (confidence < 0.7)
    throw new Error(`Could not verify your location. Please try again. ${reason}`)

  await db.insert(usersSpots).values([{
    userId: user.id,
    spotId: spot.id
  }])

  return spot.id
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function checkSpot(image: string, spot: Spot) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Is this image proving that person is in ${spot.name}? Respond only with JSON: { "confidence": 0.1-1.0, "reason": "..." }, where "confidence" is how sure you are that the person is in the spot, and "reason" is why you think so.`
          },
          { type: "image_url", image_url: { url: image } }
        ]
      }
    ]
  })

  const message = response.choices[0]?.message?.content

  if (!message)
    throw new Error('No response from OpenAI')

  try {
    return JSON.parse(message) as { confidence: number, reason: string }
  } catch (error) {
    throw new Error('Invalid response from OpenAI')
  }
}
