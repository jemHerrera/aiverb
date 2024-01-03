import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { ProductsDescription } from "../../utils/types/Products";
import { Product } from "../entities/Product";
import { Products } from "../../utils/types/Products";

export class SeedProducts extends Seeder {
  async run(em: EntityManager): Promise<void> {
    try {
      await em.upsertMany(
        Product,
        Object.values(Products).map((p) => {
          return em.create(Product, {
            name: p,
            description: ProductsDescription[p],
          });
        })
      );
    } catch (e: any) {
      console.error(`Error in seeder SeedProducts: ${JSON.stringify(e)}`);
      if (e.message) {
        console.error(`Error message: ${JSON.stringify(e.message)}`);
      }
    }
  }
}
