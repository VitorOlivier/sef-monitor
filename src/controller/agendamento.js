const express = require('express');
const Agendamento = require('../model/Agendamento');
const router = express.Router();
const logger = require('../logger');

router.post('/', async (req, res) => {
  try {
    const agendamento = await Agendamento.create(req.body);
    return res.send({ agendamento });
  } catch (err) {
    return res.status(400).send({ err });
  }
});

router.get('/', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find(req.body);
    return res.send({ agendamentos });
  } catch (err) {
    return res.status(400).send({ err });
  }
});

module.exports.routers = app => app.use('/agendamento', router);

module.exports.create = async obj => {
  const agendamento = await Agendamento.create(obj);
  return agendamento;
};

module.exports.deleteMany = async obj =>
  await Agendamento.deleteMany(obj, err => {
    if (err) logger.error(err.message);
  });
