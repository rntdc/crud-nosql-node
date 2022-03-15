const express = require('express');

const emojis = require('./emojis');
const games = require('./games');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/games', games);

module.exports = router;
