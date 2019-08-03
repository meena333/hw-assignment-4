const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');

const databaseUrl = 'postgres://postgres:secret@localhost:5432/postgres';
const db = new Sequelize(databaseUrl);
const app = express();

const Movie = db.define('movie', {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});

db.sync()
  .then(() =>
    Promise.all([
      Movie.create({
        title: 'The Grand Budapest Hotel',
        yearOfRelease: 2014,
        synopsis:
          'The adventures of Gustave H, a legendary concierge at a famous hotel, and Zero Moustafa, the lobby boy who becomes his most trusted friend.'
      }),
      Movie.create({
        title: 'Little Miss Sunshine',
        yearOfRelease: 2006,
        synopsis:
          'A family determined to get their young daughter into the finals of a beauty pageant take a cross-country trip in their VW bus.'
      }),
      Movie.create({
        title: 'Burn After Reading',
        yearOfRelease: 2008,
        synopsis:
          'A disk containing mysterious information from a CIA agent ends up in the hands of two unscrupulous and daft gym employees who attempt to sell it.'
      })
    ])
  )
  .catch(console.error);

app.use(bodyParser.json());
app.post('/movies', (req, res, next) => {
  Movie.create(req.body)
    .then(result => res.send(result))
    .catch(error => next(error));
});

app.get('/movies', (req, res, next) => {
  //console.log('test req query', req.query);
  const limit = req.query.limit;
  const offset = req.query.offset || 0;

  Movie.findAndCountAll({
    where: {},
    offset,
    limit
  })
    .then(result => {
      const total = result.count;
      const data = result.rows.map(m => m.dataValues);
      res.send({ data, total });
    })
    .catch(error => next(error));
});

app.get('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => res.send(movie))
    .catch(error => next(error));
});

app.put('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => movie.update(req.body))
    .then(movie => res.send(movie))
    .catch(error => next(error));
});

app.delete('/movies/:id', (req, res, next) => {
  Movie.destroy({ where: { id: req.params.id } })
    .then(number => res.send({ number }))
    .catch(error => next(error));
});

//app.listen(4000);
