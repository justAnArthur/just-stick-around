import * as t from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { users } from "../../auth-schema"
import { randomUUID } from "crypto"
import { relations } from "drizzle-orm/relations"

export * from "@/../auth-schema"

const id = t.text().primaryKey().$defaultFn(() => randomUUID()),
  createdAt = t.timestamp("created_at").notNull().defaultNow()

export const usersRelations = relations(users, ({ many }) => ({
  usersToSpots: many(usersSpots)
}))

export const spots = pgTable(
  "spots",
  {
    id,
    createdAt,
    createdBy: t.text("created_by").references(() => users.id),

    name: t.text().notNull(),
    description: t.text().notNull(),

    lat: t.doublePrecision().notNull(),
    lng: t.doublePrecision().notNull(),

    fileId: t.text("file_id").references(() => files.id).notNull()
  }
)

export type Spot = typeof spots.$inferSelect
export type SpotWithFileNUsers = Spot & { file: File | null, usersToSpots: (UsersToSpots & { file: File | null })[] }

export const spotsRelations = relations(spots, ({ many, one }) => ({
  usersToSpots: many(usersSpots),
  file: one(files, {
    fields: [spots.fileId],
    references: [files.id]
  }),
  creator: one(users, {
    fields: [spots.createdBy],
    references: [users.id]
  }),
  attachments: many(spotsAttachments)
}))

export const spotsAttachments = pgTable(
  'spots_attachments',
  {
    spotId: t.text("spot_id").references(() => spots.id).notNull(),
    fileId: t.text("file_id").references(() => files.id).notNull(),
    createdAt
  },
  s => [
    t.primaryKey({ columns: [s.spotId, s.fileId] })
  ]
)

export type SpotToAttachments = typeof spotsAttachments.$inferSelect

export const spotsToAttachmentsRelations = relations(spotsAttachments, ({ one }) => ({
  spot: one(spots, {
    fields: [spotsAttachments.spotId],
    references: [spots.id]
  }),
  file: one(files, {
    fields: [spotsAttachments.fileId],
    references: [files.id]
  })
}))

export const usersSpots = pgTable(
  "users_spots",
  {
    userId: t.text("user_id").references(() => users.id).notNull(),
    spotId: t.text("spot_id").references(() => spots.id).notNull(),

    fileId: t.text("file_id").references(() => files.id).notNull(),
    createdAt
  },
  s => [
    t.primaryKey({ columns: [s.userId, s.spotId] })
  ]
)

export type UsersToSpots = typeof usersSpots.$inferSelect

export const usersToSpotsRelations = relations(usersSpots, ({ one }) => ({
  spot: one(spots, {
    fields: [usersSpots.spotId],
    references: [spots.id]
  }),
  user: one(users, {
    fields: [usersSpots.userId],
    references: [users.id]
  }),
  file: one(files, {
    fields: [usersSpots.fileId],
    references: [files.id]
  })
}))

export const files = pgTable(
  "files",
  {
    id,
    createdAt,

    path: t.text().notNull()
  }
)

export type File = typeof files.$inferSelect
