//Biblioteca para controlar Chrome
const puppeteer = require('puppeteer-extra');
//Plugin pupperteer para navegação stealth
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
//Plugin pupperteer para navegação anonima
const UserAgentPlugin = require('puppeteer-extra-plugin-anonymize-ua');
//Plugin puppeteer para resolver captcha
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const logger = require('../logger');

const config = require('../cfg/config.json');
const recaptchaPlugin = RecaptchaPlugin(config.recaptchaOptions);
// add recaptch plugin
puppeteer.use(recaptchaPlugin);
// add stealth plugin e usa defaults config (all tricks to hide puppeteer usage)
puppeteer.use(StealthPlugin());
// add plugin para anonimato do User-Agent e signal Windows como platforma
puppeteer.use(UserAgentPlugin({ makeWindows: true }));

async function scraping(callback) {
  try {
    const browser = await puppeteer.launch(config.puppeteerLaunchOptions);
    const page = await browser.newPage();
    await page.goto(config.urlAgendamento, { waitUntil: 'networkidle2' });
    if (page.url().includes(config.urlLogin)) {
      await page.type(config.userTextBox, config.userSEF, config.typeOptions);
      await page.type(config.passTextBox, config.passSEF, config.typeOptions);
      await Promise.all([page.waitForNavigation(), page.click(config.loginBtn)]);
      await page.goto(config.urlAgendamento, { waitUntil: 'networkidle2' });
    }
    const servicos = await page.$$eval(config.comboBoxServicos + ' option', opts => {
      return opts
        .filter(opt => opt.getAttribute('value') !== '')
        .map(opt => {
          return [opt.getAttribute('value'), opt.innerText.trim()];
        });
    });
    console.log(servicos);
    for (var servico of servicos) {
      if (servico[0] !== '') {
        await Promise.all([page.waitForNavigation(), page.select(config.comboBoxServicos, servico[0])]);
        const lugares = await page.$$eval(config.comboBoxLugares + ' option', opts => {
          return opts
            .filter(opt => opt.getAttribute('value') !== '')
            .map(opt => {
              return [opt.getAttribute('value'), opt.innerText.trim()];
            });
        });
        for (var lugar of lugares) {
          await Promise.all([page.waitForNavigation(), page.select(config.comboBoxLugares, lugar[0])]);
          const agendamento = {
            servico: servico[1],
            posto: lugar[1],
            datas: {},
          };
          if (!(await page.$(config.msgNotFound))) {
            for (var qtdMes = 0; qtdMes < 6; qtdMes++) {
              const ths = await page.$$eval(config.ths, ths =>
                ths.map(th => [th.getAttribute('data-date'), th.getAttribute('class')]),
              );
              const tds = await page.$$eval(config.tds, tds => tds.map(td => td.innerText.trim()));
              for (var i = 0; i < ths.length; i++) {
                if (!ths[i][1].includes('fc-other-month')) {
                  if (tds[i]) agendamento.datas[ths[i][0]] = tds[i];
                  if (tds[i].includes(':')) {
                    console.log(agendamento.posto + ' ' + ths[i][0] + ', ' + tds[i]);
                  }
                }
              }
              await page.click(config.buttonNext);
              await page.waitFor(1000);
            }
          }
          callback(agendamento);
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
