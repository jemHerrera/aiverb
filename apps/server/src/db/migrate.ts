import { MikroORM } from "@mikro-orm/core";

import mikroOrmConfig from "./_config/mikroOrmConfig";
import { SeedProducts } from "./seeders/SeedProducts";
import { seedMemory } from "./seeders/SeedMemory";
import { User } from "./entities";
import { waitForDB } from "./waitForDB";

export async function handler() {
  console.log(mikroOrmConfig);
  try {
    const orm = await MikroORM.init(mikroOrmConfig);

    const em = orm.em.fork();

    const migrator = orm.getMigrator();

    await migrator.up();

    new SeedProducts().run(em);

    const users = await em.find(User, {});

    for (const user of users) {
      await seedMemory(user.id);
      console.log(`Seeded memory for user ${user.id}.`);
    }

    await orm.close(true);

    console.log("Migration complete.");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(`Error in 'handler' (migrate.ts): ${JSON.stringify(e)}`);

    if (e.message) {
      console.error(`Error message: ${JSON.stringify(e.message)}`);
    }
  }
}

waitForDB(
  mikroOrmConfig.host || "localhost",
  mikroOrmConfig.port ?? 5432,
  16,
  handler
);
