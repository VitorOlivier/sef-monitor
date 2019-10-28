const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const config = require('./cfg/config.json');
const scraper = require('./scraper');
const logger = require('./logger');

const agendamentos = {};

const server = express();

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

const update = ag => ({ servico, posto, datas }) => {
  if (!ag[servico]) ag[servico] = {};
  if (!ag[servico][posto]) ag[servico][posto] = {};
  logger.info(`${servico} - ${posto} - Obtidos ${Object.keys(datas).length} horarios.`);
  ag[servico][posto] = {
    timestamp: Date.now(),
    datas,
  };
};

const startScraper = async () => {
  logger.info('Iniciando raspagem...');
  const updateFn = update(agendamentos);
  await scraper(updateFn);
  logger.info('Raspagem finalizada.');
};

// startScraper(); // Para rodar imediatamente
schedule.scheduleJob('*/10 * * * *', startScraper);
