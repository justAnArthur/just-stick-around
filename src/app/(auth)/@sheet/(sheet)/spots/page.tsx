import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"
import { files, spots, usersSpots } from "@/database/schema"
import { eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import Link from "next/link"

export default async function Spots() {
  const spots = await getSpots()

  return (
    <main className="p-4 flex flex-col gap-4">
      {spots.map(spot => (
        <div key={spot.id} className="bg-muted p-4 rounded-md flex items-center gap-4">
          <img src={spot.file?.path} className="w-1/4"/>

          <b className="flex-1">{spot.name}</b>

          <p>{spot.usersToSpots[0]?.createdAt?.toUTCString().replace('GTM', '')}</p>
        </div>
      ))}

      <Link href="/spots/add">
        Create new spot
      </Link>
    </main>
  )
}

async function getSpots() {
  const user = (await auth.api.getSession({ headers: await headers() })).user
  if (!user)
    throw new Error("Not authenticated")

  const usersToSpotsFile = alias(files, "utsFile")

  return (await db
    .select({
      spot: spots,
      spotFile: files,
      userToSpot: usersSpots,
      userToSpotFile: files
    })
    .from(spots)
    .innerJoin(usersSpots, eq(spots.id, usersSpots.spotId))
    .leftJoin(files, eq(spots.fileId, files.id))
    .leftJoin(usersToSpotsFile, eq(usersSpots.fileId, usersToSpotsFile.id))
    .where(eq(usersSpots.userId, user.id))
    .execute())
    .map(({ spot, spotFile, userToSpot, userToSpotFile }) => ({
      ...spot,
      file: spotFile,
      usersToSpots: userToSpot ? [{ ...userToSpot, file: userToSpotFile }] : []
    }))
}
