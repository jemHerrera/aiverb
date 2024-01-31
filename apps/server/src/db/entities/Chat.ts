import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./_lib/BaseEntity";
import { User } from "./User";

@Entity({ tableName: "chat" })
export class Chat extends BaseEntity {
  @ManyToOne({ entity: () => User })
  user!: User;

  @Property({ length: 1000 })
  userMessage!: string;

  @Property({ length: 1000 })
  aiMessage!: string;
}
