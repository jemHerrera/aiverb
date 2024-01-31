import { Migration } from '@mikro-orm/migrations';

export class Migration20240121211056 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "account" add column "recent_summary" varchar(255) null;');

    this.addSql('alter table "chat" drop column "recent_summary";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "account" drop column "recent_summary";');

    this.addSql('alter table "chat" add column "recent_summary" varchar(255) null;');
  }

}
