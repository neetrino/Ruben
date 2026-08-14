import {
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

import {
  createdAtColumn,
  idColumn,
  updatedAtColumn,
} from "@/db/schema/columns";
import { contactMessageStatusEnum } from "@/db/schema/enums";

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: idColumn(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: contactMessageStatusEnum("status").notNull().default("UNREAD"),
    spamScore: integer("spam_score"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    index("contact_messages_status_created_idx").on(
      table.status,
      table.createdAt,
    ),
  ],
);
