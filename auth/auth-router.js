const router = require('express').Router();
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const configVars = require("../config/vars")
const db = require('../database/dbConfig')

function isValid(user)
{
  return Boolean(user.username && typeof user.password === 'string')
}

async function add(user)
{
  try
  {
    const [id] = await db("users").insert(user, "id");

    return db("users").where({ id }).first();
  } catch (error)
  {
    throw error;
  }
}


router.post('/register', (req, res) =>
{
  // implement registration
  const credentials = req.body
  console.log(credentials)

  if (isValid(credentials))
  {
    const rounds = process.env.BCRYPT_ROUNDS || 4

    // turn password into hashbrowns
    const hash = bcryptjs.hashSync(credentials.password, rounds)
    credentials.password = hash
    console.log(credentials)
    //save user to db
    add(credentials).then(user =>{
      res.status(200).json(user)
    })
    .catch(e =>{
      res.status(500).json(e)
    })
  }
  else{
    res.status(500).json("Please provide username and password")
  }
})
  

router.post('/login', (req, res) =>
{
  // implement login
  const { username, password } = req.body
  if (isValid(req.body))
  {
    db('users').where({username:username}).orderBy('id').then(([user])=>{
      console.log(user)
      if (user && bcryptjs.compareSync(password, user.password)){
        const token = createToken(user)
        // req.session.loggedIn = true
        // req.session.user = user
        // console.log("req.session", req.session.user) --- not working. abandon this method, ask TL or something. 
        res.status(200).json(`Welcome to our API ${user.username}. Your token is ${token}.`)
      }
      else{
        res.status(401).json({message: "invalid credentials. User==", user})
      }
    })
    .catch(e =>{
      res.status(500).json(e)
    }) 
  }
  else{
    res.status(400).json("Please provide correct username and credentials. ")
  }
});





function createToken(user){
  const payload={
    sub:user.id,
    username:user.username  }
  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, configVars.jwtSecret, options)
}



module.exports = router;
