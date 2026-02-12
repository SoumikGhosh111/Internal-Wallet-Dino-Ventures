// testing for database connectivity
const { prisma, disconnectDB } = require('./config/db'); 


async function main(){ 
    try{ 
        console.log('Running the test query'); 
        const res= await prisma.$queryRaw`SELECT 1 as v`; 
        console.log('query results: ',res); 
    }catch(err){ 
        console.log("Connection error", err); 
    }finally{ 
        try{disconnectDB()}catch(err){}
    }
}


main(); 