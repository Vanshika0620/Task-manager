const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//   res.status(503).send('Site is currently down. Check back soon!') 
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//Without middleware: new request -> run route handler
//
// With middleware: request -> do something -> run route handler

app.listen(port, () =>{
  console.log("Server is up on port " + port)
})




// const jwt = require('jsonwebtoken')

// const myFunction = async() => {

//   const token = jwt.sign({_id: 'abc123'}, 'thisismynewcourse', { expiresIn: '7 days'})
//   console.log(token)

//   const data = jwt.verify(token, 'thisismynewcourse')
//   console.log(data)


  // const password = 'Red12345!'
  // const hashedPassword = await bcrypt.hash(password, 8)

  // console.log(password)
  // console.log(hashedPassword)

  // const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
  // console.log(isMatch)

//}

//myFunction()


//Encryption - Vanshika => pedupweytvsbnkaoiwt => Vanshika
//Hashing - Vanshika => pedupweytvsbnkaoiwt (Not reversible)