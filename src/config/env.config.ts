import * as env from 'env-var';
import { config } from 'dotenv';

config();

export const NODE_ENV = env.get('NODE_ENV').asString();

export const REDIS_URL = env.get('REDIS_URL').asString();

export const MYSQLDB_HOST = env.get('MYSQLDB_HOST').asString();

export const MYSQLDB_PASSWORD = env.get('MYSQLDB_PASSWORD').asString();

export const MYSQLDB_DATABASE = env.get('MYSQLDB_DATABASE').asString();

export const MYSQLDB_USER = env.get('MYSQLDB_USER').asString();

export const MYSQLDB_LOCAL_PORT = env.get('MYSQLDB_LOCAL_PORT').asInt();

export const JWT_SECRET = env.get('JWT_SECRET').asString();

export const ADJUTOR_BASE_URL = env.get('ADJUTOR_BASE_URL').asString();
export const ADJUTOR_API_KEY = env.get('ADJUTOR_API_KEY').asString();

export const SNAPSHOT_THRESHOLD = env.get('SNAPSHOT_THRESHOLD').asInt();

