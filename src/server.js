const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const scraper = require('./scraper');
const logger = require('./logger');
const config = require('./cfg/config.json');
const appURL = (process.env.APP_URL, 'https://sef-monitor-web.herokuapp.com/');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect(appURL);
});

require('./controller/agendamento').routers(app);

app.listen(process.env.PORT || config.port, () => {
  logger.info('SEF-Monitor ouvindo a porta ' + (process.env.PORT || config.port));
});

const startScraper = async () => {
  logger.info('Iniciando raspagem...');
  await scraper(async agendamento => {
    require('./controller/agendamento').create(agendamento);
  });
  logger.info('Raspagem finalizada.');
};

//startScraper(); // Para rodar imediatamente
schedule.scheduleJob('*/15 * * * *', startScraper);
