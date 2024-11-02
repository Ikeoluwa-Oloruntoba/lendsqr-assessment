/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('type', ['CREDIT', 'DEBIT']).notNullable(); // Type of transaction
    table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).defaultTo('PENDING'); // Transaction status
    table.enum('account_type', ['WALLET', 'LOAN', 'SAVINGS']).notNullable(); // Account type for more flexibility
    table.decimal('amount', 14, 2).notNullable(); // Amount with two decimal places
    table.string('reference').unique().notNullable(); // Unique transaction reference
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('transactions');
};
