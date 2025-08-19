import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { 
    PORT = 5000, 
    NODE_ENV = "development", 
    DB_URI, 
    JWT_SECRET, 
    JWT_EXPIRES_IN = "7d",
    BCRYPT_SALT_ROUNDS = 12
} = process.env;
