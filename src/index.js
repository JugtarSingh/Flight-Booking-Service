const express = require('express');
const apiRoutes = require('./routers');
const { serverConfig , logger } = require('./config');
const CRONS = require('./utils/common/cron-jobs')

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api',apiRoutes);

app.listen(serverConfig.PORT,()=>{
    console.log(`Successfully started the server on PORT:  ${serverConfig.PORT}`);
    CRONS();
    logger.info("Successfully started the server",{});
})