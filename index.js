const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bearsRouter = require('./BearsRoute.js');
const knexConfig = {
  client: "sqlite3",
  connection:{
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true,
}
const db = knex(knexConfig);
const server = express();

server.use(express.json());
server.use(helmet());
server.use('/api/bears', bearsRouter)

// endpoints here
//GET ALL 
server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos)
  } catch (error) {
    res.status(500).json(error);
  }
});
//GET SINGLE ZOO
server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoo = await db('zoos').where({id: req.params.id}).first();
    res.status(200).json(zoo)
  } catch (error) {
    res.status(500).json(error);
  }
});
//CREATE ZOO
server.post('/api/zoos', async (req, res) => {
  try {
    const [id] = await db('zoos').insert(req.body);
    const zoo = await db('zoos').where({id}).first();
    res.status(200).json(zoo)
  } catch (error) {
    res.status(500).json(error);
  }
});
//UPDATE ZOO
server.put('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos').where({id: req.params.id}).update(req.body);
    if(count > 0){
      const zoo = await db('zoos').where({id: req.params.id}).first();
      res.status(200).json(zoo);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//DELETE ZOO
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos').where({id: req.params.id}).del();
    if(count> 0){
      res.status(204).end();
    } else{
      res.status(404).json({message: "Zoo not found"})
    }
  } catch (error) {
    res.status(500).json(error);
  }
});


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
