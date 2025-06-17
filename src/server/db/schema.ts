// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";
import { type Message } from "ai";
import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `wd-chat_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const chats = createTable(
  "chat",
  (d) => ({
    id: d.text().primaryKey(),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    messages: d
      .json()
      .$type<Message[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index("chat_created_at_idx").on(t.createdAt),
    index("chat_updated_at_idx").on(t.updatedAt),
  ],
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

//exercise table
export const exercises = pgTable("exercise", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),

  exerciseName: d.text("exercise_name"),
  youtubeDemoShortUrl: d.text("youtube_demo_short_url"),
  youtubeDemoInDepthUrl: d.text("youtube_demo_in_depth_url"),
  difficulty: d.text("difficulty"),

  targetMuscleGroup: d.text("target_muscle_group"),
  primeMoverMuscle: d.text("prime_mover_muscle"),
  secondaryMuscle: d.text("secondary_muscle"),
  tertiaryMuscle: d.text("tertiary_muscle"),

  primaryEquipment: d.text("primary_equipment"),
  primaryEquipmentQt: d.integer("primary_equipment_qt"),
  secondaryEquipment: d.text("secondary_equipment"),
  secondaryEquipmentQt: d.integer("secondary_equipment_qt"),

  posture: d.text("posture"),
  singleOrDoubleArm: d.text("single_or_double_arm"),
  continuousOrAlternatingArms: d.text("continuous_or_alternating_arms"),
  grip: d.text("grip"),
  loadPositionEnding: d.text("load_position_ending"),
  continuousOrAlternatingLegs: d.text("continuous_or_alternating_legs"),
  footElevation: d.text("foot_elevation"),
  combinationExercises: d.text("combination_exercises"),

  movementPattern1: d.text("movement_pattern_1"),
  movementPattern2: d.text("movement_pattern_2"),
  movementPattern3: d.text("movement_pattern_3"),

  planeOfMotion1: d.text("plane_of_motion_1"),
  planeOfMotion2: d.text("plane_of_motion_2"),
  planeOfMotion3: d.text("plane_of_motion_3"),

  bodyRegion: d.text("body_region"),
  forceType: d.text("force_type"),
  mechanics: d.text("mechanics"),
  laterality: d.text("laterality"),
  primaryExerciseClassification: d.text("primary_exercise_classification"),
}));
