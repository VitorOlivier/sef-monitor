const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const config = require('./cfg/config.json');
const scraper = require('./scraper');
const logger = require('./logger');

var agendamentos = new Object();

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
