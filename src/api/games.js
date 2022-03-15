const express = require('express');
const monk = require('monk');
const Joi = require('@hapi/joi');
const { restart } = require('nodemon');

const db = monk(process.env.MONGO_URI);
const games = db.get('games');

const schema = Joi.object({
  name: Joi.string().trim().required(),
  year: Joi.number().required(),
  created_at: Joi.date().timestamp()
});

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await games.find({});
    
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await games.findOne({
      _id: id,
    });

    if (!item) return next();

    return res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);
    const inserted = await games.insert(value);

    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const value = await schema.validateAsync(req.body)
    const item = await games.findOne({
      _id: id,
    });

    if(!item) return next();

    const updated = await games.update({
      _id: id,
    }, {
      $set: value,
    });
    res.json(updated);
  } catch (error) {
    next(error)
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await games.remove({ _id:id });

    res.json(200).send('Success');
  } catch (error) {
    next(error);
  }
});

module.exports = router;