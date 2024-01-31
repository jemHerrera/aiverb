import { Migration } from '@mikro-orm/migrations';

export class Migration20240119015035 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "chat" add column "recent_summary" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "chat" drop column "recent_summary";');
  }

}
