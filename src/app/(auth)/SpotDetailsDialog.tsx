import { FC, useEffect, useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SpotWithFileNUsers } from "@/database/schema"

const openListeners = [] as ((spot: SpotWithFileNUsers) => void)[]

export function openSpotDetailsDialog(spot: SpotWithFileNUsers) {
  openListeners.forEach(listener => listener(spot))
}

export const SpotDetailsDialog: FC = () => {
  const [openOrSpot, setOpen] = useState<boolean | SpotWithFileNUsers>(false)

  useEffect(() => {
    const listener = (spot: SpotWithFileNUsers) => setOpen(spot)

    openListeners.push(listener)

    return () => {
      const index = openListeners.indexOf(listener)
      if (index > -1)
        openListeners.splice(index, 1)
    }
  }, [])

  const spot = openOrSpot

  return (
    <Sheet open={!!openOrSpot} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="max-w-2xl mx-auto rounded-md inset-x-4 bottom-4">
        <SheetHeader>
          {typeof spot !== 'boolean'
            && <main className="flex flex-col gap-4">
              <div className="aspect-[4/3] bg-muted flex flex-col items-center justify-center rounded-md p-4 sm:p-6 overflow-hidden">
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

              <div>
                <SheetTitle>{spot.name}</SheetTitle>
                <SheetDescription className="mt-2">{spot.description}</SheetDescription>
              </div>
            </main>}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
