import { AccountView } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"
import { SignOutButton } from "@/app/(auth)/@sheet/(sheet)/account/[path]/SignOutButton"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }))
}

export default async function AccountPage({
                                            params
                                          }: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params

  return (
    <main className="container self-center p-4 md:p-6">
      <AccountView
        path={path}
        classNames={{
          sidebar: {
            base: "sticky top-20"
          }
        }}
      />
      {path && 'settings' && <SignOutButton/>}
    </main>
  )
}
