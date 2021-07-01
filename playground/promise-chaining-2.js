require('../src/db/mongoose')

const Task = require('../src/models/task')

//60d604bc92ef291820dad2fa

// Task.findByIdAndDelete( {_id: '60d60eff19be262a60a9ea53'}).then((task) => {
//   console.log(task)
//   return Task.countDocuments({completed: false})
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({completed: false})
  return count
}

deleteTaskAndCount('60cf775f581a7d1cc459fe52').then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})