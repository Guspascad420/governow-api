/* eslint-disable */
const {
  addLeaderHandler,
  getAllLeadersHandler,
  getLeaderByIdHandler,
  editLeaderByIdHandler,
  deleteLeaderByIdHandler,
} = require('../handler/leader.handler');
const express = require('express')

const router = express.Router()

router.get('/', getAllLeadersHandler)
router.post('/', addLeaderHandler)
router.get('/:id', getLeaderByIdHandler)
router.put('/:id', editLeaderByIdHandler)
router.delete('/:id', deleteLeaderByIdHandler)

module.exports = router
