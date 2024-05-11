const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()

const corsoptions = {
    origin : ['http://localhost:5173'],
    Credential :true,
    optionSuccessStatus : 2000
}

// middleware
app.use(cors(corsoptions));  
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('hello its masala manager server')
})

app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
} )