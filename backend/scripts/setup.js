#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setup = async () => {
    console.log('🚀 Setting up Quiz Platform Backend...\n');

    try {
        // Check if .env file exists
        const envPath = path.join(__dirname, '..', '.env.development.local');
        
        try {
            await fs.access(envPath);
            console.log('✅ Environment file already exists');
        } catch {
            // Copy .env.example to .env.development.local
            const examplePath = path.join(__dirname, '..', '.env.example');
            await fs.copyFile(examplePath, envPath);
            console.log('✅ Created .env.development.local from .env.example');
            console.log('📝 Please update the environment variables in .env.development.local');
        }

        // Create logs directory
        const logsDir = path.join(__dirname, '..', 'logs');
        try {
            await fs.mkdir(logsDir, { recursive: true });
            console.log('✅ Created logs directory');
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
            console.log('✅ Logs directory already exists');
        }

        console.log('\n🎉 Setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Make sure MongoDB is running');
        console.log('2. Update environment variables in .env.development.local');
        console.log('3. Install dependencies: npm install');
        console.log('4. Seed the database: npm run seed');
        console.log('5. Start the server: npm run dev');
        console.log('\n📖 For more information, check the README.md file');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
};

setup();
