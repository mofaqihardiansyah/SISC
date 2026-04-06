import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name'),
  email: varchar('email').unique(),
  password: varchar('password'),
  role: varchar('role'), // admin, organizer, visitor
  avatarUrl: varchar('avatar_url'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const provinces = pgTable('provinces', {
  id: serial('id').primaryKey(),
  name: varchar('name').unique(),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  provinceId: integer('province_id').references(() => provinces.id),
  name: varchar('name'),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name'), // IT, Medis, Ekonomi, dll
  slug: varchar('slug').unique(),
  iconUrl: varchar('icon_url'),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name').unique(), // AI, Web3, Seminar Nasional
});

export const eventToTags = pgTable('event_to_tags', {
  eventId: integer('event_id').references(() => events.id),
  tagId: integer('tag_id').references(() => tags.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.tagId] }),
}));

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  organizerId: integer('organizer_id').references(() => users.id), // Null jika scraping
  categoryId: integer('category_id').references(() => categories.id),
  cityId: integer('city_id').references(() => cities.id),
  title: varchar('title'),
  slug: varchar('slug').unique(),
  description: text('description'),
  bannerUrl: varchar('banner_url'),
  eventDate: timestamp('event_date'),
  registrationDeadline: timestamp('registration_deadline'),
  locationDetail: text('location_detail'), // Alamat spesifik/Gedung
  externalLink: varchar('external_link'), // Link pendaftaran asli
  status: varchar('status').default('pending'), // pending, published, rejected, unpublish_request
  isScraped: boolean('is_scraped').default(false),
  sourceWebsite: varchar('source_website'), // Asal scraping
  viewCount: integer('view_count').default(0),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const eventSocialMedia = pgTable('event_social_media', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id),
  platform: varchar('platform'), // whatsapp, instagram, website
  url: varchar('url'),
});

export const eventAttachments = pgTable('event_attachments', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id),
  fileUrl: varchar('file_url'),
  fileType: varchar('file_type'), // image, pdf
});

export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  eventId: integer('event_id').references(() => events.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title'),
  message: text('message'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const adminLogs = pgTable('admin_logs', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => users.id),
  eventId: integer('event_id').references(() => events.id),
  action: varchar('action'), // approved, rejected, edited
  prevData: jsonb('prev_data'),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- R E L A T I O N S ---
// Defines how tables connect to each other for easy querying in Drizzle

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  bookmarks: many(bookmarks),
  notifications: many(notifications),
  adminLogs: many(adminLogs),
}));

export const provincesRelations = relations(provinces, ({ many }) => ({
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  province: one(provinces, {
    fields: [cities.provinceId],
    references: [provinces.id],
  }),
  events: many(events),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  events: many(events),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  events: many(eventToTags),
}));

export const eventToTagsRelations = relations(eventToTags, ({ one }) => ({
  event: one(events, {
    fields: [eventToTags.eventId],
    references: [events.id],
  }),
  tag: one(tags, {
    fields: [eventToTags.tagId],
    references: [tags.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [events.categoryId],
    references: [categories.id],
  }),
  city: one(cities, {
    fields: [events.cityId],
    references: [cities.id],
  }),
  bookmarks: many(bookmarks),
  tags: many(eventToTags),
  socialMedia: many(eventSocialMedia),
  attachments: many(eventAttachments),
  adminLogs: many(adminLogs),
}));

export const eventSocialMediaRelations = relations(eventSocialMedia, ({ one }) => ({
  event: one(events, {
    fields: [eventSocialMedia.eventId],
    references: [events.id],
  }),
}));

export const eventAttachmentsRelations = relations(eventAttachments, ({ one }) => ({
  event: one(events, {
    fields: [eventAttachments.eventId],
    references: [events.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [bookmarks.eventId],
    references: [events.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(users, {
    fields: [adminLogs.adminId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [adminLogs.eventId],
    references: [events.id],
  }),
}));
