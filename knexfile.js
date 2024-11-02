// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    version: '8.0',
    connection: {
      host: "mysql.railway.internal",
      port: Number(process.env.MYSQLDB_LOCAL_PORT),
      user: "root",
      password: "cxSBYvLecaUkuDykeUEsSamJBojsfQQc",
      database: "railway",
      ssl: false
    },
    migrations: {
      tableName: 'knex_migrations'
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
