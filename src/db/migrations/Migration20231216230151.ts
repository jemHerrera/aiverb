import { Migration } from '@mikro-orm/migrations';

export class Migration20231216230151 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "price" varchar(255) not null, constraint "product_pkey" primary key ("id"));');
    this.addSql('alter table "product" add constraint "product_name_unique" unique ("name");');

    this.addSql('create table "chat" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "topic" varchar(255) not null, "messages" text[] not null, constraint "chat_pkey" primary key ("id"));');

    this.addSql('alter table "chat" add constraint "chat_user_id_foreign" foreign key ("user_id") references "account" ("id") on update cascade;');

    this.addSql('alter table "account" add column "email_verified" boolean not null default false, add column "is_admin" boolean not null default false, add column "product_id" varchar(255) not null;');
    this.addSql('alter table "account" add constraint "account_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "account" drop constraint "account_product_id_foreign";');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "chat" cascade;');

    this.addSql('alter table "account" drop column "email_verified";');
    this.addSql('alter table "account" drop column "is_admin";');
    this.addSql('alter table "account" drop column "product_id";');
  }

}
