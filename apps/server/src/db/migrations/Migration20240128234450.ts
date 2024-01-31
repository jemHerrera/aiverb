import { Migration } from '@mikro-orm/migrations';

export class Migration20240128234450 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "account" drop column "recent_summary";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "account" add column "recent_summary" varchar(1000) null;');
  }

}
