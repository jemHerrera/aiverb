import { Migration } from '@mikro-orm/migrations';

export class Migration20231217025117 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop column "price";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" add column "price" varchar null default null;');
  }

}
