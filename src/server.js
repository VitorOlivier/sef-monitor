// const schedule = require('node-schedule');
const scraper = require('./scraper');
const logger = require('./logger');
const { db, Timestamp } = require('./firebase');

const updateFirebase = async ({ servico, posto, datas }) => {
  db.collection('agendamentos')
    .doc(servico)
    .collection('locais')
    .doc(posto)
    .set(
      {
        timestamp: Timestamp.fromMillis(Date.now()),
        datas,
      },
      { merge: true },
    );
};

const startScraper = async () => {
  logger.info('Iniciando raspagem...');
  await scraper(updateFirebase);
  logger.info('Raspagem finalizada.');
};

startScraper(); // Para rodar imediatamente
// schedule.scheduleJob('*/10 * * * *', startScraper);
