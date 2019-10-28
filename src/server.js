const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const config = require('./cfg/config.json');
const scraper = require('./scraper');

var agendamentos = new Object();

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
      colorize: true,
    }),
    new winston.transports.File({ filename: __dirname + '/cfg/log.json' }),
  ],
});

var server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.get(config.urlGetDatasAgendamento, async (req, res) => {
  try {
    return res.status(200).json(agendamentos);
  } catch (e) {
    logger.error(e);
    return res.status(400).send({ error: e.message });
  }
});

server.listen(config.port, () => {
  logger.info('SEF-Monitor ouvindo a porta ' + config.port);
});

schedule.scheduleJob('*/10 * * * *', async () => {
  agendamentos = await scraper.scraping();
});

//Teste - Inicia raspagem sem scheduler
// (async () => {
//   agendamentos = await scraper.scraping();
// })();
