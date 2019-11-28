const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgentPlugin = require('puppeteer-extra-plugin-anonymize-ua');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const logger = require('../logger');
const credentials = require('../cfg/sef-credentials.json');
const config = require('../cfg/config.json');
const recaptchaPlugin = RecaptchaPlugin(config.recaptchaOptions);
const { db } = require('../firebase');
const moment = require('moment');

puppeteer.use(recaptchaPlugin);
puppeteer.use(StealthPlugin());
puppeteer.use(UserAgentPlugin({ makeWindows: true }));

async function deleteDataBase(local, servico) {
  const batch = db.batch();
  db.collection('sef')
    .where('local', '==', local)
    .where('servico', '==', servico)
    .get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
}

async function scraping(callback) {
  try {
    const browser = await puppeteer.launch(config.puppeteerLaunchOptions);
    const page = await browser.newPage();
    await page.goto(config.urlAgendamento, { waitUntil: 'networkidle2' });
    if (page.url().includes(config.urlLogin)) {
      await page.type(config.userTextBox, credentials.userSEF, config.typeOptions);
      await page.type(config.passTextBox, credentials.passSEF, config.typeOptions);
      await Promise.all([page.waitForNavigation(), page.click(config.loginBtn)]);
      await page.goto(config.urlAgendamento, { waitUntil: 'networkidle2' });
    }
    const servicos = await page.$$eval(config.comboBoxServicos + ' option', opts => {
      return opts
        .filter(opt => opt.getAttribute('value') !== '')
        .map(opt => {
          return [opt.getAttribute('value'), opt.innerText.replace('  ', ' ').trim()];
        });
    });
    for (var servico of servicos) {
      if (servico[0] !== '') {
        await Promise.all([page.waitForNavigation(), page.select(config.comboBoxServicos, servico[0])]);
        const lugares = await page.$$eval(config.comboBoxLugares + ' option', opts => {
          return opts
            .filter(opt => opt.getAttribute('value') !== '')
            .map(opt => {
              return [opt.getAttribute('value'), opt.innerText.replace('  ', ' ').trim()];
            });
        });
        for (var lugar of lugares) {
          deleteDataBase(lugar[1], servico[1]);
          await Promise.all([page.waitForNavigation(), page.select(config.comboBoxLugares, lugar[0])]);
          if (!(await page.$(config.msgNotFound))) {
            for (var qtdMes = 0; qtdMes < 6; qtdMes++) {
              const ths = await page.$$eval(config.ths, ths =>
                ths.map(th => [th.getAttribute('data-date'), th.getAttribute('class')]),
              );
              const tds = await page.$$eval(config.tds, tds => tds.map(td => td.innerText.trim()));
              for (var i = 0; i < ths.length; i++) {
                if (!ths[i][1].includes('fc-other-month')) {
                  if (tds[i].includes(':')) {
                    console.log(servico[1] + ' ' + lugar[1] + ' ' + ths[i][0] + ', ' + tds[i]);
                    const dtHora = moment.utc(ths[i][0] + ' ' + tds[i], 'YYYY-MM-DD HH:mm').toDate();
                    const agendamento = {
                      data: ths[i][0],
                      hora: tds[i],
                      datahora: dtHora,
                      local: lugar[1],
                      servico: servico[1],
                    };
                    callback(agendamento);
                  }
                }
              }
              await page.click(config.buttonNext);
              await page.waitFor(1000);
            }
          }
        }
      }
    }
    await page.close();
    await browser.close();
  } catch (e) {
    logger.error(e.message);
  }
}

module.exports = scraping;
