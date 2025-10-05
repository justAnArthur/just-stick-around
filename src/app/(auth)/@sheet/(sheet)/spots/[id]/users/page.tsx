import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { db } from "@/database/db"

type Params = {
  id: string
}

export default async function SpotDetails(props: { params: Promise<Params> }) {
  const params = await props.params

  const userSpots = await getLastestUsersSpot(params.id)

  return <>
    <SheetHeader className="pb-0">
      <SheetTitle>Latest user explorations</SheetTitle>
    </SheetHeader>

    <main className="flex flex-col gap-4 p-4 pt-0">
      {userSpots.map((userSpot, index) => (
        <div key={index} className="bg-muted p-4 rounded-md flex items-center gap-4">
          <img src={userSpot.file?.path} className="w-1/4"/>

          <b className="flex-1">{userSpot.user?.name}</b>

          <p>{userSpot.createdAt?.toLocaleDateString()}</p>
        </div>
      ))}
    </main>
  </>
}

async function getLastestUsersSpot(spotId: string) {
  return db.query.usersSpots.findMany({
    with: {
      user: true,
      file: true
    },
    where: (usersSpots, { eq }) => eq(usersSpots.spotId, spotId),
    orderBy: (usersSpots, { desc }) => [desc(usersSpots.createdAt)],
    limit: 100
  })
}
