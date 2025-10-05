import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"

type Params = {
  id: string
}

export default async function SpotDetails(props: { params: Promise<Params> }) {
  const params = await props.params

  const spot = await getSpotDetails(params.id)

  if (!spot)
    return notFound()

  return <>
    {typeof spot !== 'boolean'
      && <main className="flex flex-col gap-4 p-4 pb-0">
        <div
          className="aspect-[4/3] bg-muted flex flex-col items-center justify-center rounded-md p-4 sm:p-6 overflow-hidden">
          {spot.usersToSpots?.length > 0
            ? <div className="relative h-full">
              <img src={spot.file?.path} className="absolute -bottom-1/16 -left-1/4 w-1/2 -rotate-7" alt=""/>
              <img src={spot.usersToSpots[0].file?.path} className="rounded-md overflow-hidden h-full" alt=""/>
            </div>
            : <img
              src="/vercel.svg"
              className="w-44 h-44"
            />}
        </div>
      </main>}

    <SheetHeader className="pt-0">
      <SheetTitle>{spot.name}</SheetTitle>
      <SheetDescription className="mt-2">{spot.description}</SheetDescription>
    </SheetHeader>
  </>
}

async function getSpotDetails(spotId: string) {
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
