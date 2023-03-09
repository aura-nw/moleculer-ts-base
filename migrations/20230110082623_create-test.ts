import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  let tblName = 'persons';
  await knex.schema.dropTableIfExists(tblName);
  await knex.schema.createTable(tblName, (table: any) => {
    table.increments('id').primary();
    table.string('firstName');
    table.string('lastName');
    // table.string('name').unique().notNullable();
    // table.string('lp_contract_addr').unique().notNullable();
    // table.string('contract_addr').unique().notNullable();
    // table.string('pool_contract_addr').unique().notNullable();
    // table.integer('fee').notNullable();
    // table.string('whitelist_addr').defaultTo('');
    // table.string('creator_addr').defaultTo('');
    // table.integer('lp_total').notNullable();
    // table.string('status').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('delete_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
