"use client"

import type { FC, ReactNode } from "react"
import { AddPlaceDialog, openAddPlaceDialog } from "@/app/(auth)/AddPlaceDialog"
import Link from "next/link"
import { MapIcon, PlusIcon, UserIcon } from "lucide-react"
import { SpotDetailsDialog } from "@/app/(auth)/SpotDetailsDialog"
import { LocationProvider } from "@/app/(auth)/LocationProvider"

export default function AuthLayout(props: { children: ReactNode }) {
  return <>
    <LocationProvider>
      {props.children}

      <Navigation/>

      <SpotDetailsDialog/>
      <AddPlaceDialog/>
    </LocationProvider>
  </>
}

const Navigation: FC = () => {
  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card text-card-foreground px-2 py-1 rounded-full shadow-md border border-border">
      <ul className="flex items-center gap-3">
        <li>
          <Link href="/" className="block hover:bg-background p-3 hover:no-underline rounded-md">
            <MapIcon size={20}/>
          </Link>
        </li>
        <li>
          <Link href="/profile" className="block hover:bg-background p-3 hover:no-underline rounded-md">
            <UserIcon size={20}/>
          </Link>
        </li>
        <li>
          <button type="button" onClick={openAddPlaceDialog} className="hover:bg-background p-3 rounded-md">
            <PlusIcon size={20}/>
          </button>
        </li>
      </ul>
    </nav>
  )
}
