CREATE TABLE "wd-chat_chat" (
	"id" text PRIMARY KEY NOT NULL,
	"messages" json DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX "chat_created_at_idx" ON "wd-chat_chat" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "chat_updated_at_idx" ON "wd-chat_chat" USING btree ("updatedAt");