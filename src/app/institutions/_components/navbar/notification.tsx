"use client"

import GlassSheet from "@/components/global/glass-sheet"
import { Bell } from "@/icons"

export const Notification = () => {
  return (
    <GlassSheet
      trigger={
        <span className="cursor-pointer">
          <Bell />
        </span>
      }
    >
      <div>yo</div>
    </GlassSheet>
  )
}
