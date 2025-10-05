"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export const SignOutButton = () => {
  const router = useRouter()

  return (
    <Button onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push('/auth/sign-in') } })}
            className="mt-4">
      Sign out
    </Button>
  )
}
