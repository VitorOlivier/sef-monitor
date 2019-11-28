const schedule = require('node-schedule');
const scraper = require('./scraper');
const logger = require('./logger');
const { db, Timestamp } = require('./firebase');

const startScraper = async () => {
  logger.info('Iniciando raspagem...');
  await scraper(async agendamento => {
    db.collection('sef').add({
      timestamp: Timestamp.fromMillis(Date.now()),
      ...agendamento,
    });
  });

  logger.info('Raspagem finalizada.');
};

//startScraper(); // Para rodar imediatamente
schedule.scheduleJob('*/15 * * * *', startScraper);
