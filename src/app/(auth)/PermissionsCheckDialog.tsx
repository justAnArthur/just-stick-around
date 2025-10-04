"use client"

import { FC, useState } from "react"

export const PermissionsCheckDialog: FC<{ permissions: PermissionName[] }> = (
  { permissions }
) => {
  const allowed = useAllowedPermissions(permissions)

  return null
}


function useAllowedPermissions(permissions: PermissionName[]) {
  const [allowed, setAllowed] = useState<boolean | undefined>()

  // todo
  // useEffect(() => {
  //   let isMounted = true
  //   let permissionStatusList: PermissionStatus[] = []
  //
  //   async function check() {
  //     if (!navigator.permissions) {
  //       if (isMounted) setAllowed(false)
  //       return
  //     }
  //     // Query all permissions and store PermissionStatus objects
  //     const results = await Promise.all(
  //       permissions.map(async p => {
  //         const status = await navigator.permissions.query({ name: p })
  //         permissionStatusList.push(status)
  //         console.log(p, status.state)
  //         return status.state !== "denied"
  //       })
  //     )
  //     if (isMounted) setAllowed(results.every(Boolean))
  //
  //     // Add onchange listeners
  //     permissionStatusList.forEach(status => {
  //       status.onchange = () => {
  //         console.log("Permission changed:", status.name, status.state)
  //         // Re-check all permissions on any change
  //         check()
  //       }
  //     })
  //   }
  //
  //   check()
  //   return () => {
  //     isMounted = false
  //     // Remove onchange listeners
  //     permissionStatusList.forEach(status => {
  //       status.onchange = null
  //     })
  //   }
  // }, [permissions])

  return allowed
}
