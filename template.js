const express = require('express')
const bodyParser = require('body-parser')


const app = express()



app.get('/' , function(res , req){

    res.send('hello world')
})

app.listen(3000 , function(res , req){

    console.log('server is running on port 3000')
})