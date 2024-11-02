/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex){
   return knex.schema.createTable('tokens', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('token').notNullable(); // JWT token string
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('revoked_at').nullable(); // Timestamp for when token is revoked
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tokens');
}
