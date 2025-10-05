"use client"

import { ReactNode, useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"

export default function SheetLayout(props: { children: ReactNode }) {
  const router = useRouter()

  const [open, setOpen] = useState(true)

  function handleOnOpenChange(open: boolean) {
    setOpen(open)

    if (!open)
      router.push('/')
  }

  return (
    <Sheet open={open} onOpenChange={handleOnOpenChange}>
      <SheetContent side="bottom" className="max-w-2xl mx-auto inset-x-4 rounded-md bottom-4 max-h-[90%]">
        {props.children}
      </SheetContent>
    </Sheet>
  )
}
