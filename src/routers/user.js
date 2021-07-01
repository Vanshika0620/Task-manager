const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')

//Create router
const router = new express.Router()

//Set up route
// router.get('/test', (req,res) => {
//   res.send('from a new file')
// })


//Add user
router.post('/users', async (req,res)=>{
  const user = new User(req.body)

  try{
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({user, token})
  }catch(e){
    res.status(400).send(e)
  }
 
  // user.save().then(() => {
  //   res.status(201).send(user)
  // }).catch((e) => {
  //   res.status(400)
  //   res.send(e)
  // })
})



router.post('/users/login', async (req, res) => {
  try {
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()
      res.send({ user, token })
  } catch (e) {
      res.status(400).send()
  }
})

router.post('/users/logout',auth, async (req,res) => {
  try{
    //logout of a particular session
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch(e){
    res.status(500).send()

  }
})

//logout of all sessions
router.post('/users/logoutAll', auth, async(req,res) => {
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch(e){
    res.status(500).send()
  }
})



//fetch individual users using id
// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id

//   try{
//     const user = await User.findById(_id)
//     if(!user){
//       return res.status(404).send()
//     }
//     res.send(user)
//   }catch(e){
//     res.status(500).send()
//   }

// })

//fetch all users
router.get('/users/me', auth , async (req,res) => {

  res.send(req.user)

})


//Update User
router.patch('/users/me',auth, async (req, res) => {
  // To tell which properties are allowed to be updated
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // return true if update is allowed else false

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {

    updates.forEach((update) => {
      req.user[update] = req.body[update]

    })

    await req.user.save()

      //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })


    res.send(req.user)
  } catch (e) {
      res.status(400).send(e)
  }
})

//Delete profile
router.delete('/users/me', auth, async (req,res) => {
  try{
    // const user = await User.findByIdAndDelete(req.user._id)
    // if(!user){
    //   return res.status(404).send()
    // }

    await req.user.remove()

    res.send(req.user)
  }catch(e){
    res.status(500).send()
  }
})

//profile image upload
const multer = require('multer')
const upload = multer({
  limits: {
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg||jpeg||png)$/)){
      return cb(new Error('Please upload an image'))
    }

    cb(undefined,true)

  }

})

//add profile to database
router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res) => {
  const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({error: error.message}) //error when file is not of right format
})

//delete profile from database
router.delete('/users/me/avatar', auth, async(req,res) =>{
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

//fetch image
router.get('/users/:id/avatar', async (req,res) => {
  try{
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar){
      throw new Error()
    }

    res.set('Content-Type','image/png')
    res.send(user.avatar)
  }catch(e){
    res.status(404).send()
  }
})

//register router using express
module.exports = router