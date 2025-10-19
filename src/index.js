const express = require('express');
const apiRoutes = require('./routers');
const { serverConfig , logger } = require('./config');


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api',apiRoutes);

app.listen(serverConfig.PORT,()=>{
    console.log(`Successfully started the server on PORT:  ${serverConfig.PORT}`);
    logger.info("Successfully started the server",{});
})