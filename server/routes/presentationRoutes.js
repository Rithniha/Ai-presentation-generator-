const express = require('express');
const {
  getPresentations,
  getPresentation,
  createPresentation,
  updatePresentation,
  deletePresentation
} = require('../controllers/presentationController');
const { optionalProtect } = require('../middlewares/auth');

const router = express.Router();

router.use(optionalProtect); // Check token session for all presentation paths

router.route('/')
  .get(getPresentations)
  .post(createPresentation);

router.route('/:id')
  .get(getPresentation)
  .put(updatePresentation)
  .delete(deletePresentation);

module.exports = router;
