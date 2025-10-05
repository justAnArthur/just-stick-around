"use client"

import type { FC, ReactNode } from "react"
import Link from "next/link"
import { MapIcon, StickerIcon, TelescopeIcon, UserIcon } from "lucide-react"
import { LocationProvider } from "@/app/(auth)/LocationProvider"

export default function AuthLayout(props: { children: ReactNode, sheet: ReactNode }) {
  return (
    <LocationProvider>
      {props.children}
      {props.sheet}

      <Navigation/>
    </LocationProvider>
  )
}

const Navigation: FC = () => {
  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card text-card-foreground px-2 py-1 rounded-full shadow-md border border-border">
      <ul className="flex items-center gap-3">
        <li>
          <Link href="/" className="block hover:bg-background active:bg-background p-3 hover:no-underline rounded-xl">
            <MapIcon size={20}/>
          </Link>
        </li>
        <li>
          <Link href="/spots"
                className="block hover:bg-background active:bg-background p-3 hover:no-underline rounded-xl">
            <StickerIcon size={20}/>
          </Link>
        </li>
        <li>
          <Link href="/account/settings"
                className="block hover:bg-background active:bg-background p-3 hover:no-underline rounded-xl">
            <UserIcon size={20}/>
          </Link>
        </li>

        <li>
          <Link href="/spots/explore"
                className="block hover:bg-background active:bg-background p-3 hover:no-underline rounded-xl">
            <TelescopeIcon size={20}/>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
