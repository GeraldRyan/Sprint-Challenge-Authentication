const router = require('express').Router();
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const configVars = require("../config/vars")

function isValid(user)
{
  return Boolean(user.username && typeof user.password === 'string')
}

async function add(user)
{
  try
  {
    const [id] = await db("auth").insert(user, "id");

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
});

module.exports = router;
