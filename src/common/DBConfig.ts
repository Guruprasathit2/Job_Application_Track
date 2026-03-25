import 'reflect-metadata';
import { env } from '../env';
import { DataSource } from 'typeorm';
import * as entity from  '../common/Entity';

export const DbConnection = new DataSource({
    type: 'postgres',
    host: env.database.host,
    port: Number(env.database.port),
    username: env.database.username,
    password: env.database.password,
    database: env.database.database,
    synchronize: false,
    logging: true,
    entities: Object.values(entity),
    subscribers: []
});