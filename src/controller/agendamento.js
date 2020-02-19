const express = require('express');
const Agendamento = require('../model/Agendamento');
const router = express.Router();
const logger = require('../logger');

router.post('/', async (req, res) => {
  try {
    const agendamento = await Agendamento.create(req.body);
    return res.send({ agendamento });
  } catch (err) {
    return res.status(500).send({ err });
  }
});

router.get('/', async (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 20;
  const currentPage = parseInt(req.query.page) > 0 ? parseInt(req.query.page) - 1 : 0;
  const sortBy = req.query.sortBy || 'hora';
  const orderBy = req.query.orderBy || 'asc';
  const sortQuery = { [sortBy]: orderBy };
  const data = req.query.data;
  const hora = req.query.hora;
  const local = req.query.local;
  const servico = req.query.servico;
  let filterQuery = {};
  filterQuery = data ? { ...filterQuery, data } : filterQuery;
  filterQuery = hora ? { ...filterQuery, hora } : filterQuery;
  filterQuery = local ? { ...filterQuery, local } : filterQuery;
  filterQuery = servico ? { ...filterQuery, servico } : filterQuery;
  Agendamento.find(filterQuery)
    //.limit(pageSize)
    .skip(currentPage * pageSize)
    .sort(sortQuery)
    .then(agendamentos => {
      return res.status(200).json({ agendamentos });
    })
    .catch(err => {
      return res.status(500).json({ err });
    });
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
