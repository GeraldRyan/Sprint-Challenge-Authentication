const request = require('supertest')
const server = require('../api/server')
const db = require('../database/dbConfig')

beforeEach(()=>{
  return db.migrate.rollback()
  .then(()=> db.migrate.latest())
  .then(()=> db.seed.run())
})

test("POST to /api/auth/register to be successful", async ()=>{
  const res = await request(server)
  .post("/api/auth/register").send({username:"brian", password:"red"})
  expect(res.status).toBe(200)
  expect(res.body).toMatchObject({
    username:"brian"
  })
}) 

test("POST to /api/auth/login to be successful", async ()=>{
  const register = await request(server)
  .post("/api/auth/register").send({username:"brian", password:"red"})
  expect(register.status).toBe(200)
  expect(register.body).toMatchObject({
    username:"brian"
  })
  const res = await request(server)
  .post('/api/auth/login').send({username:"brian",password:"red"})
  expect(res.body).toHaveProperty('token')
  expect(res.status).toBe(200)
}) 

test("GET to /api/jokes to be successful", async ()=>{
  const register = await request(server)
  .post("/api/auth/register").send({username:"brian", password:"red"})
  expect(register.status).toBe(200)
  expect(register.body).toMatchObject({
    username:"brian"
  })
  const login = await request(server)
  .post('/api/auth/login').send({username:"brian",password:"red"})
  expect(login.body).toHaveProperty('token')
  expect(login.status).toBe(200)
  const res = await request(server).get('/api/jokes').set('authorization', login.body.token)
  console.log("res body jokes'", res.body[0])
  expect(res.body[0]).toHaveProperty('id')
  expect(res.body[0]).toHaveProperty('joke')

}) 