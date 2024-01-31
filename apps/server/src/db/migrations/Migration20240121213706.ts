import { Migration } from '@mikro-orm/migrations';

export class Migration20240121213706 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "account" alter column "recent_summary" type varchar(1000) using ("recent_summary"::varchar(1000));');

    this.addSql('alter table "chat" alter column "user_message" type varchar(1000) using ("user_message"::varchar(1000));');
    this.addSql('alter table "chat" alter column "ai_message" type varchar(1000) using ("ai_message"::varchar(1000));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "account" alter column "recent_summary" type varchar(255) using ("recent_summary"::varchar(255));');

    this.addSql('alter table "chat" alter column "user_message" type varchar(255) using ("user_message"::varchar(255));');
    this.addSql('alter table "chat" alter column "ai_message" type varchar(255) using ("ai_message"::varchar(255));');
  }

}
