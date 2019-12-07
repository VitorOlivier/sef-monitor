const mongoose = require('../database');

const AgendamentoSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  datahora: {
    type: Date,
    required: true,
  },
  local: {
    type: String,
    required: true,
  },
  servico: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

module.exports = Agendamento;
