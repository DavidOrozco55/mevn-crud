const express = require('express');
const router = express.Router();
const Task = require('../models/task.js');

router.get('/', async (req,res)=>{
    let data = await Task.find();
    res.send(JSON.stringify(data));
})

router.post('/',async(req,res)=>{
    console.log(req.body)
    const newTask = new Task(req.body);
    await newTask.save();
    res.json({
        response: 'success'
    })
})

router.put('/:id/:name/:hours/:minutes',async(req,res)=>{
    const id = req.params.id;
    const hours = req.params.hours;
    const minutes = req.params.minutes;
    const name = req.params.name;
    console.log('hello ' + name + hours,minutes);
    await Task.findByIdAndUpdate(id,{name:name, hours: hours,minutes: minutes});
    res.json({
        response:'updated'
    });
})

router.delete('/:id', async (req,res)=>{
    const id = req.params.id;
    console.log(id);
    await Task.findOneAndDelete(id);
    res.json({
        response:'deleted'
    });

})

module.exports = router;