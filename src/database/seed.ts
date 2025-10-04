import { db } from "@/database/db"
import { files, spots } from "@/database/schema"

async function seedSpots() {
  const [file] = await db.insert(files)
    .values([
      {
        path: '/vercel.svg'
      }
    ])
    .returning({ id: files.id })

  return db.insert(spots).values([
    {
      name: 'HackYear25',
      description: "Foolbal stadium",
      lat: 50.067005,
      lng: 19.991579,
      fileId: file.id
    },
    {
      name: 'Wawel Castle',
      description: "",
      lat: 50.0545,
      lng: 19.9366,
      fileId: file.id
    },
    {
      name: 'Main Square',
      description: "",
      lat: 50.0614,
      lng: 19.9383,
      fileId: file.id
    },
    {
      name: 'Kazimierz',
      description: "",
      lat: 50.0499,
      lng: 19.9448,
      fileId: file.id
    },
    {
      name: 'Nowa Huta',
      description: "",
      lat: 50.0727,
      lng: 20.0376,
      fileId: file.id
    },
    {
      name: 'Krakus Mound',
      description: "",
      lat: 50.0412,
      lng: 19.9632,
      fileId: file.id
    },
    {
      name: 'Botanic Garden',
      description: "",
      lat: 50.0652,
      lng: 19.9637,
      fileId: file.id
    },
    {
      name: 'Błonia Park',
      description: "",
      lat: 50.0606,
      lng: 19.9116,
      fileId: file.id
    },
    {
      name: 'ICE Kraków',
      description: "",
      lat: 50.0462,
      lng: 19.9361,
      fileId: file.id
    },
    {
      name: 'Galeria Krakowska',
      description: "",
      lat: 50.0669,
      lng: 19.9486,
      fileId: file.id
    },
    {
      name: 'Tauron Arena',
      description: "",
      lat: 50.0617,
      lng: 19.9842,
      fileId: file.id
    }
  ])
}

(async function runSeed() {
  const start = Date.now()
  console.log("⏳ Running seeding...")

  await seedSpots()

  const end = Date.now()
  console.log(`🌱 Seeding is completed in ${end - start}ms`)

  process.exit(0)
})()
  .catch((err) => {
    console.error("❌ Seeding is failed")
    console.error(err)
    process.exit(1)
  })
