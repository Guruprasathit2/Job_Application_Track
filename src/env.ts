import * as dotenv from 'dotenv';
dotenv.config();

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

function optionalEnv(name: string): string | undefined {
    const value = process.env[name];
    if (!value) return undefined;
    return value;
}

export const env = {
    database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        requestTimeout: Number(process.env.REQUESTTIMEOUT),
    },
    serverPort: process.env.SERVER_PORT,
    jwtKey: requiredEnv('JWT_SECERET_KEY'),
    role: {
        admin: requiredEnv('ADMIN'),
        staff: requiredEnv('STAFF'),
        candidate: requiredEnv('CANDIDATE'),
    },
    userData: {
        name: requiredEnv('MAIN_USER_NAME'),
        email: requiredEnv('MAIN_USER_EMAIL_ID'),
        password: requiredEnv('MAIN_USER_PASSWORD'),
        phone: requiredEnv('MAIN_USER_MOBILE_NUMBER'),
    },
    mail: {
        smtpHost: optionalEnv('SMTP_HOST'),
        smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
        smtpUser: optionalEnv('SMTP_USER'),
        smtpPass: optionalEnv('SMTP_PASS'),
        mailFrom: optionalEnv('MAIL_FROM'),
    },
}