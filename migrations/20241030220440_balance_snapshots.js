/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('balance_snapshots', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.decimal('balance', 14, 2).notNullable();
    table.integer('transaction_count').notNullable(); // Transaction count at snapshot time
    table.enum('account_type', ['WALLET', 'LOAN', 'SAVINGS']).defaultTo('WALLET'); // Optional: separate balance snapshots by account type
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('balance_snapshots');
};
