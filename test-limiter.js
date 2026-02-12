console.log("Hi from hehre")
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1/wallet/spend';
const payload = {
  userId: "1de57c6d-f5c6-48de-bd88-bff59e6f6060", // Use your Test User ID
  assetType: "GOLD_COINS",
  amount: 1
};

async function testRateLimit() {

  console.log("🚀 Blasting 10 simultaneous requests to test the 5 req/sec limit...");

  // Create an array of 10 request promises
  const requests = Array.from({ length: 12 }, (_, i) => 
    axios.post(API_URL, payload)
      .then(res => `Req ${i + 1}: ✅ Success (${res.status})`)
      .catch(err => `Req ${i + 1}: ❌ Failed (${err.response?.status}) - ${err.response?.data.message}`)
  );

  // Execute all at once
  const results = await Promise.all(requests);
  
  results.forEach(result => console.log(result));

  console.log("\n💡 Note: If you see 5 successes and 5 failures, your 'transactionLimiter' is working perfectly!");
}

testRateLimit();