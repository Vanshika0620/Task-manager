const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create task
router.post('/tasks',auth, async (req,res) => {
  //const task = new Task(req.body)
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try{
    await task.save()
    res.status(201).send(task)
  }catch(e){
    res.status(400).send(e)
  }

  // task.save().then(() =>{
  //   res.status(201).send(task)
  // }).catch((e) => {
  //   res.status(400).send(e)
  // })
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc
//Read all tasks
router.get('/tasks',auth, async (req,res) => {
  const match = {}
  const sort = {}

  //Check if value of completed is provided
  if(req.query.completed){
    match.completed = req.query.completed ==='true' //set completed = true if return 'true' else false
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1:1
  }

  try{
    //const tasks = await Task.find({owner: req.user._id})
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort          //completed: 1,  // -1 -> completed first 1-> completed last
          //createdAt: 1    //1 -> asc  -1 -> desc
        
      }
    }).execPopulate()
    res.send(req.user.tasks)
  }catch(e){
    res.status(500).send()
  }


})

//Read individual task
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try{

    const task= await Task.findOne({_id, owner: req.user._id})

    if(!task){
      return res.status(404).send()
    }
    res.send(task)
  }catch(e){
    res.status(500).send()
  }

  
})

//Update Task
router.patch('/tasks/:id',auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['completed', 'description']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    
    
  
      if (!task) {
          return res.status(404).send()
      }
      updates.forEach((update) => {
        task[update] = req.body[update]
  
      })
      await task.save()
      res.send(task)
  } catch (e) {
      res.status(400).send(e)
  }
})

//Delete Task
router.delete('/tasks/:id',auth, async (req,res) => {
  try{
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id })
    if(!task){
      return res.status(404).send()
    }

    res.send(task)
  }catch(e){
    res.status(500).send()
  }
})

module.exports = router