const express = require('express'); 

const app = express(); 
// app.set('trust proxy', 1);

const port = process.env.PORT || 3000; 

const walletRoutes = require('./routes/walletRoutes'); 


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => { 
    res.send('Server is live'); 
}); 

app.listen(port, () => { 
    console.log("Server is listening at port: ", port)
}); 

// wallet routes
app.use('/api/v1/wallet', walletRoutes); 


