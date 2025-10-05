"use client"

import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { FormEvent, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { LoaderCircleIcon } from "lucide-react"
import { addSpot } from "@/app/(auth)/@sheet/(sheet)/spots/add/actions"
import { toast } from "sonner"
import { mapInstance } from "@/app/(auth)/StickersMap"
import { useRouter } from "next/navigation"

const CoordinatePicker = dynamic(() => import("./CoordinatePicker").then(module => module.CoordinatePicker), { ssr: false })

export default function AddSpot() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [coords, setCoords] = useState<{ lat: number, lng: number }>()
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [sticker, setStickers] = useState<File | null>(null)

  async function handleOnSubmit(e: FormEvent) {
    e.preventDefault()

    if (!coords || !sticker)
      return

    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("lat", String(coords.lat))
    formData.append("lng", String(coords.lng))
    formData.append("sticker", sticker as Blob)
    if (photos)
      Array.from(photos).forEach(photo => formData.append("photos", photo))

    try {
      const spot = await addSpot(formData)

      toast.success(`Spot ${spot.name} added`)

      mapInstance.setCenter(spot)
      router.push('/')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleOnSubmit} className="p-4 overflow-y-auto">
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="sr-only">Basic</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator/>

        <FieldSet>
          <FieldLegend>Location</FieldLegend>
          <CoordinatePicker onValueChange={setCoords}/>
        </FieldSet>

        <FieldSeparator/>

        <FieldSet>
          <FieldLegend>Images</FieldLegend>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setPhotos(e.target.files)}
            className="border p-2 w-full"
          />
          {photos && photos.length > 0 &&
            <div className="grid grid-cols-3 gap-2">
              {Array.from(photos).map((photo, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />))}
            </div>}
        </FieldSet>

        <FieldSeparator/>

        <FieldSet>
          <FieldLegend>Sticker</FieldLegend>
          <Input
            type="file"
            accept="image/*"
            onChange={e => setStickers(e.target.files ? e.target.files[0] : null)}
            className="border p-2 w-full"
          />
          {sticker &&
            <div className="grid grid-cols-3 gap-2">
              <img
                src={URL.createObjectURL(sticker)}
                alt="Sticker"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>}
        </FieldSet>
      </FieldGroup>

      <div className="w-full flex justify-end">
        <Button type="submit" className="mt-4 w-44" size="lg" disabled={loading}>
          {loading && <LoaderCircleIcon size={20} className="animate-spin"/>}
          Submit
        </Button>
      </div>
    </form>
  )
}

