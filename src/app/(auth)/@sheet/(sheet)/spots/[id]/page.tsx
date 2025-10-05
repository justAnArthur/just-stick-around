import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getSpotDetails } from "@/app/(auth)/@sheet/(sheet)/spots/[id]/actions"

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
              src="/placeholder.png"
              className="w-44 h-44"
            />}
        </div>
      </main>}

    <SheetHeader className="pt-0">
      <SheetTitle>{spot.name}</SheetTitle>
      <SheetDescription className="mt-2">{spot.description}</SheetDescription>
    </SheetHeader>

    <SheetFooter>
      <Link href={"/spots/" + spot.id + "/users"}>
        Other users explorations
      </Link>
    </SheetFooter>
  </>
}
