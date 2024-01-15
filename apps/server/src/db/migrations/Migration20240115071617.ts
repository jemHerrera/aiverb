import { Migration } from '@mikro-orm/migrations';

export class Migration20240115071617 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "chat" add column "ai_message" varchar(255) not null;');
    this.addSql('alter table "chat" drop column "messages";');
    this.addSql('alter table "chat" rename column "topic" to "user_message";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "chat" add column "messages" text[] not null;');
    this.addSql('alter table "chat" drop column "ai_message";');
    this.addSql('alter table "chat" rename column "user_message" to "topic";');
  }

}
