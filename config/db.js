require('dotenv').config(); 
const { PrismaClient } = require('@prisma/client'); 
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Initializing the prisma client
const databaseUrl = process.env.DATABASE_URL; 
const pool = new Pool({
  connectionString: databaseUrl,
  connect_timeout: 10,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({adapter});


/**
 * Handle graceful shutdown. 
 * This ensures the database connection closes if the stops.
 */

const disconnectDB = async( ) => { 
    await prisma.$disconnect(); 
    console.log('Disconnected from Internal_wallet_DB'); 
}

module.exports={ 
    prisma, 
    disconnectDB
}

