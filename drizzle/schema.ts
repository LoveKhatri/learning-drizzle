import { relations } from "drizzle-orm";
import { index, integer, pgEnum, pgTable, serial, unique, uuid, varchar, boolean, real, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const UserRole = pgEnum("user_role", ["ADMIN", "BASIC"]);

export const UserTable = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    // id2: serial("id2").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    role: UserRole("userRole").default("BASIC").notNull()
}, table => {
    return {
        emailIndex: index("email_index").on(table.email),
        uniqueNameAndAge: unique("unique_name_and_age").on(table.name, table.age)
    }
})

export const UserPreferencesTable = pgTable("userPreferences", {
    id: uuid("id").primaryKey().defaultRandom(),
    emailUpdates: boolean("emailUpdates").notNull().default(false),
    userId: uuid("userId").references(() => UserTable.id).notNull()
})

export const PostTable = pgTable("post", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 256 }).notNull(),
    averageRating: real("averageRating").notNull().default(0),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    authorId: uuid("authorId").references(() => UserTable.id).notNull()
})

export const CategoryTable = pgTable("category", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull()
})

export const PostCategoryTable = pgTable("postCategory", {
    postId: uuid("postId").references(() => PostTable.id).notNull(),
    categoryId: uuid("categoryId").references(() => CategoryTable.id).notNull(),

}, table => {
    return {
        primaryKey: primaryKey({ columns: [table.postId, table.categoryId] })
    }
})

// relations

export const UserTableRelations = relations(UserTable, ({ one, many }) => {
    return {
        preferences: one(UserPreferencesTable),
        posts: many(PostTable)
    }
})

export const UserPreferencesRelation = relations(UserPreferencesTable, ({ one }) => {
    return {
        user: one(UserTable, {
            fields: [UserPreferencesTable.userId],
            references: [UserTable.id]
        })
    }
})

export const PostTableRelations = relations(PostTable, ({ one, many }) => {
    return {
        author: one(UserTable, {
            fields: [PostTable.authorId],
            references: [UserTable.id]
        }),
        postCategories: many(PostCategoryTable)
    }
})

export const CategoryTableRelations = relations(CategoryTable, ({ many }) => {
    return {
        postCategories: many(PostCategoryTable)
    }
})