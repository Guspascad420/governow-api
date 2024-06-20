/* eslint-disable */
const {
  addLeaderHandler,
  getAllLeadersHandler,
  getLeaderByIdHandler,
  editLeaderByIdHandler,
  deleteLeaderByIdHandler,
} = require('../handler/leader.handler');
const express = require('express')
const imgUpload = require('../utils/imgUpload')
const Multer = require('multer');

const router = express.Router()
const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024
})

router.get('/', getAllLeadersHandler)
router.post('/', multer.single('attachment'), imgUpload.uploadToGcs, addLeaderHandler)
router.get('/:id', getLeaderByIdHandler)
router.put('/:id', editLeaderByIdHandler)
router.delete('/:id', deleteLeaderByIdHandler)

module.exports = router
