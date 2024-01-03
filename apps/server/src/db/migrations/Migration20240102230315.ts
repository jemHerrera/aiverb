import { Migration } from '@mikro-orm/migrations';

export class Migration20240102230315 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product" ("name" varchar(255) not null, "description" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "product_pkey" primary key ("name"));');

    this.addSql('create table "account" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "email_verified" boolean not null default false, "is_admin" boolean not null default false, "product_name" varchar(255) not null, constraint "account_pkey" primary key ("id"));');
    this.addSql('alter table "account" add constraint "account_username_unique" unique ("username");');
    this.addSql('alter table "account" add constraint "account_email_unique" unique ("email");');

    this.addSql('create table "chat" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "topic" varchar(255) not null, "messages" text[] not null, constraint "chat_pkey" primary key ("id"));');

    this.addSql('alter table "account" add constraint "account_product_name_foreign" foreign key ("product_name") references "product" ("name") on update cascade;');

    this.addSql('alter table "chat" add constraint "chat_user_id_foreign" foreign key ("user_id") references "account" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "account" drop constraint "account_product_name_foreign";');

    this.addSql('alter table "chat" drop constraint "chat_user_id_foreign";');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "account" cascade;');

    this.addSql('drop table if exists "chat" cascade;');
  }

}
