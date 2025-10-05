"use server"

import { db } from "@/database/db"
import { spots, spotsAttachments } from "@/database/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { randomUUID } from "crypto"
import { saveBufferFile } from "@/app/(auth)/@sheet/(sheet)/spots/explore/actions"

export async function addSpot(formData: FormData) {
  const user = (await auth.api.getSession({ headers: await headers() })).user
  if (!user) throw new Error("Not authenticated")

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const lat = Number(formData.get("lat"))
  const lng = Number(formData.get("lng"))
  const photos = formData.getAll("photos") as File[]
  const sticker = formData.get("sticker") as File

  if (!name || !description || isNaN(lat) || isNaN(lng) || !sticker)
    throw new Error("Missing required fields")

  const stickerArrayBuffer = await sticker.arrayBuffer()
  const stickerBuffer = Buffer.from(stickerArrayBuffer)
  const stickerFileName = `spot-${randomUUID()}-sticker.png`
  const stickerFile = await saveBufferFile(stickerBuffer, stickerFileName)

  const [spot] = await db.insert(spots).values([{
    name,
    description,
    lat,
    lng,
    createdBy: user.id,
    fileId: stickerFile.id
  }]).returning()

  for (const photo of photos) {
    const arrayBuffer = await photo.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const fileName = `spot-${spot.id}-${randomUUID()}.png`
    const file = await saveBufferFile(buffer, fileName)

    await db.insert(spotsAttachments).values([{
      spotId: spot.id,
      fileId: file.id
    }])
  }

  return spot
}
