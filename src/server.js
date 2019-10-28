const config         = require('./cfg/config.json');
var   agendamentos   = new Object();

//Logger = gerenciador de log para armazenar em arquivo log em disco
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        colorize: true
      }),
      new winston.transports.File({ filename: __dirname+'/cfg/log.json' })
    ]
});

//Instancia do Servidor Web
const express        = require('express');
const bodyParser     = require('body-parser');
var server = express();
//Adiciona apis ao Servidor
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));  

//Define Rota getAgendamento
server.get(config.urlGetDatasAgendamento, async (req, res) => {
    try{
        return res.status(200).json(agendamentos);    
    }catch(err){
        logger.error({erro : err.message});
        return res.status(400).send({erro : err.message});  
    };
});

//Inicia Servidor
server.listen(config.port, () => {
    logger.info('SEF-Monitor ouvindo a porta '+config.port);
    });

//Inicia scheduler que mantem a raspagem
const schedule       = require('node-schedule');
const scraper        = require('./scraper');
let j = schedule.scheduleJob('*/10 * * * *', async () => {
    agendamentos = await scraper.scraping();
});

//Teste - Inicia raspagem sem scheduler
(async () => {
    agendamentos = await scraper.scraping()
})()



module.exports.logger = logger;   