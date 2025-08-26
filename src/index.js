const express = require('express');
const apiRoutes = require('./routers');
const { serverConfig , logger } = require('./config');


const app=express();


app.use('/api',apiRoutes);

app.listen(serverConfig.PORT,()=>{
    console.log(`Successfully started the server on PORT:  ${serverConfig.PORT}`);
    logger.info("Successfullt started the server",{});
})