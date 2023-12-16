import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./_lib/BaseEntity";
import { User } from "./User";

@Entity({ tableName: "product" })
export class Product extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @Property()
  description?: string;

  @OneToMany({ entity: () => User, mappedBy: "product" })
  users = new Collection<User>(this);

  @Property()
  price!: Record<string, any>;
}
