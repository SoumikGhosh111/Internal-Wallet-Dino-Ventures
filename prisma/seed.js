const { prisma,disconnectDB  } = require('../config/db');

async function main(params) {
    console.log("Starting db seeding");

    // creating system user (treasury)
    const systemUser = await prisma.user.upsert({
        where: { email: "treasury@system.com" },
        update: {},
        create: {
            email: 'treasury@system.com',
            name: 'System Treasury',
        }
    });



    const assets = ["GOLD_COINS", "DIAMONDS", "LOYALTY_POINTS"];

    for (const asset of assets) {
        await prisma.wallet.upsert({
            where:{ 
                userId_assetType: { userId: systemUser.id, assetType: asset },
            },
            update: {},
            create: {
                userId: systemUser.id,
                isSystem: true,
                assetType: asset,
                balance: 1000000.00
            }
        });
    }


    console.log("System treasury wallet initialized ");


    // Creating Users

    const userAlpha = await prisma.user.upsert({
        where: { email: 'alpha@example.com' },
        update: {},
        create: {
            email: 'alpha@example.com',
            name: 'User Alpha',
            wallets: {
                create: [
                    { assetType: 'GOLD_COINS', balance: 500.00, bonus: 50.00 },
                    { assetType: 'DIAMONDS', balance: 10.00 }
                ]
            }
        }
    })
    const userBeta = await prisma.user.upsert({
        where: { email: 'beta@example.com' },
        update: {},
        create: {
            email: 'beta@example.com',
            name: 'User Beta',
            wallets: {
                create: [
                    { assetType: 'GOLD_COINS', balance: 100.00 },
                    { assetType: 'LOYALTY_POINTS', balance: 1000.00 }
                ]
            }
        }
    }); 


    console.log("Test users and wallets created"); 
    console.log("Seeding complete"); 
}



main().
catch((err) => { 
    console.log("Seeding failed",err); 
    process.exit(1); 
}).
finally(async( ) => { 
    await disconnectDB(); 
})