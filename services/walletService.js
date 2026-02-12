const { prisma } = require('../config/db');



/**
 * Flow 1: Wallet Top-up (Purchase)
 * Requirement: A user purchases credits.
 */
const topUp = async (userId, assetType, amount) => {
    return await prisma.$transaction(async (tx) => {

        //finding wallets
        const treasury = await tx.wallet.findFirst({
            where: { isSystem: true, assetType }
        });

        const userWallet = await tx.wallet.findUnique({
            where: { userId_assetType: { userId, assetType } }
        });

        if (!treasury || !userWallet) {
            throw new Error("Wallet not foud");
        }

        // perdorming double entry update
        await tx.wallet.update({
            where: { id: treasury.id },
            data: { balance: { decrement: amount } }
        });

        const updated = await tx.wallet.update({
            where: { id: userWallet.id },
            data: { balance: { increment: amount } }
        });



        // creating audit logs 
        await tx.transaction.create({
            data: { walletId: treasury.id, amount: -amount, type: "DEBIT", description: `Issued to User ${userId}` }
        });
        await tx.transaction.create({
            data: { walletId: userWallet.id, amount, type: "CREDIT", description: `Purchase Top-up` }
        });


        return updated;
    });
}



const spend = async (userId, assetType, amount) => {
    return await prisma.$transaction(async (tx) => {

        console.log(userId,assetType, amount,  "in the spend")
        const userWallet = await tx.wallet.findUnique({
            where: { userId_assetType: { userId, assetType } }
        });

        console.log(userWallet, "Babu")

        if (!userWallet) throw new Error("User wallet not found");


        // quick balance check
        console.log(userWallet.bonus, "This  is balance"); 
        const totalAvilable = Number(userWallet.balance) + Number(userWallet.bonus);
        if (totalAvilable < amount) {
            throw new Error("Insufficiant funds");
        }

        // calculating deductons
        let bonusDeduction = 0;
        let balanceDeduction = 0;

        if (Number(userWallet.bonus) >= amount) {
            bonusDeduction = amount;
        } else {
            bonusDeduction = Number(userWallet.bonus);
            balanceDeduction = amount - bonusDeduction;
        }

        const updated = await tx.wallet.update({
            where: { id: userWallet.id },
            data: {
                bonus: { decrement: bonusDeduction },
                balance: { decrement: balanceDeduction }
            }
        });


        // System Revenue Entry (Requirement A.2)
        // We credit the Treasury/Revenue account to show where the spent money went
        const treasury = await tx.wallet.findFirst({ 
            where: {isSystem:true, assetType}
        }); 


        if(treasury) { 
            await tx.wallet.update({ 
                where: {id: treasury.id}, 
                data:{ balance: {increment: amount}}
            }); 
        }


      
        // Audit log
        await tx.transaction.create({
            data: { walletId: userWallet.id, amount: -amount, type: "DEBIT", description: "Service Spend" }
        }); 


        return updated; 
    })
}


const issueBonus = async (userId, assetType, amount) => {
  return await prisma.$transaction(async (tx) => {
    const userWallet = await tx.wallet.findUnique({
      where: { userId_assetType: { userId, assetType } }
    });

    if (!userWallet) throw new Error("User wallet for this asset does not exist");

    const updated = await tx.wallet.update({
      where: { id: userWallet.id },
      data: { bonus: { increment: amount } }
    });

    // Audit Log
    await tx.transaction.create({
      data: { walletId: userWallet.id, amount, type: 'BONUS', description: 'Referral/Incentive Bonus' }
    });

    return updated;
  });
}






module.exports = {topUp, spend, issueBonus}