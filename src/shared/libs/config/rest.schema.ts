import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  BASE_URL: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000,
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1',
  },
  BASE_URL: {
    doc: 'Base URL for the application',
    format: String,
    env: 'BASE_URL',
    default: 'http://localhost',
  },
  DB_USER: {
    doc: 'Username for the database',
    format: String,
    env: 'DB_USER',
    default: 'admin',
  },
  DB_PASSWORD: {
    doc: 'Password for the database',
    format: String,
    env: 'DB_PASSWORD',
    default: 'test',
  },
  DB_PORT: {
    doc: 'Port for the database',
    format: 'port',
    env: 'DB_PORT',
    default: 27017,
  },
  DB_NAME: {
    doc: 'Name of the database',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities',
  },
});
