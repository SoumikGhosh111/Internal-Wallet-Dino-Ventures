const walletService = require('../services/walletService');
const topUp = async (req, res) => {
    try {
        const { userId, assetType, amount } = req.body;

        if (!userId || !assetType || !amount) {
            res.status(400).send({
                message: "All fiends are required"
            });
        }
        const result = await walletService.topUp(userId, assetType, amount); 

        res.status(200).json({ 
            message: "Top-up successfull", 
            data: result
        }); 
    }catch(err){ 
        console.log(err.message)
        res.status(500).json({message: err.message}); 
    }
}
const issueBonus = async (req, res) => {
    try {
        const { userId, assetType, amount } = req.body;

        if (!userId || !assetType || !amount) {
            res.status(400).send({
                message: "All fiends are required"
            });
        }
        const result = await walletService.issueBonus(userId, assetType, amount); 

        res.status(200).json({ 
            message: "Bonus issued successfully", 
            data: result
        }); 
    }catch(err){ 
        console.log(err.message); 
        res.status(500).json({message: err.message}); 
    }
}
const spend = async (req, res) => {
    try {
        const { userId, assetType, amount } = req.body;

        if (!userId || !assetType || !amount) {
            res.status(400).send({
                message: "All fiends are required"
            });
        }
        const result = await walletService.spend(userId, assetType, amount); 

        res.status(200).json({ 
            message: "Purchase successful", 
            data: result
        }); 
    }catch(err){ 
        console.log(err.message); 
        res.status(500).json({message: err.message}); 
    }
}


module.exports={
    topUp, 
    issueBonus, 
    spend
}
