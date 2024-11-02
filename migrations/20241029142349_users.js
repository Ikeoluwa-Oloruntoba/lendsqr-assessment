/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary(); // UUID for user IDs
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable(); // Hashed password
    table.string('kyc_documents').defaultTo(''); // Placeholder for KYC data

    table.enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']).defaultTo('ACTIVE'); // User account status
    table.enum('kyc_status', ['NOT_VERIFIED', 'PENDING', 'VERIFIED']).defaultTo('NOT_VERIFIED'); // KYC status level
    table.enum('account_tier', ['BASIC', 'SILVER', 'GOLD']).defaultTo('BASIC'); // Account tier based on KYC verification

    table.boolean('blacklisted').defaultTo(false); // Blacklist flag
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
