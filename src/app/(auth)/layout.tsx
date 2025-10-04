"use client"

import { FC, ReactNode } from "react"
import { PermissionsCheckDialog } from "@/app/(auth)/PermissionsCheckDialog"
import { openAddPlaceDialog } from "@/app/(auth)/AddPlaceDialog"

export default function AuthLayout(props: { children: ReactNode }) {
  return <>
    {props.children}

    <Navigation/>

    <PermissionsCheckDialog permissions={['camera', 'geolocation']}/>
  </>
}

const Navigation: FC = () => {
  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-3">
      <li>
        <a href="/" className="px-3 py-1 hover:underline">Map</a>
      </li>
      <li>
        <a href="/account/profile" className="px-3 py-1 hover:underline">Account</a>
      </li>
      <li>
        <button type="button" onClick={openAddPlaceDialog}>
          Add
        </button>
      </li>
    </nav>
  )
}
