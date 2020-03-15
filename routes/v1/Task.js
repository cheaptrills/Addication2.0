const express = require("express");
const {Verify, HasRole} = require("../../utils/token");
const router = express.Router();

const levels = [0,3,5,8,12,17,23];

const {GetAllTasks, InsertTask, GetLowerLevel, RemoveTask} = require("../../models/Task");

router.use("/all", Verify, async (req, res) => {
    res.json(await GetAllTasks());
});

router.use('/my', Verify, async (req, res) => {
    let level = 0;
    let count = req.user.done.length;
    for(let i = 0; i < levels.length; i++){
        if(count >= levels[i]) level = i + 1;
    }
    res.json(await GetLowerLevel(level+1));
});

router.post('/add', Verify, HasRole("admin"), async (req, res) => {
    const {name, level, forusers} = req.body;
    const subtask = req.body.subtasks || [];
    res.json(await InsertTask(name, level, forusers, subtask));
});

router.post('/remove', Verify, HasRole("admin"), async (req, res) => {
    const {taskid} = req.body;
    res.send(await RemoveTask(taskid));
});

router.post('/update', Verify, HasRole('admin'), (req, res) => {
    res.send({msg: "Under construction"});
});

router.use("/", (req,res) => {
    res.json({
        paths:[
            {
                name: "/my",
                descritption: "Get all my tasks that i can do",
                type: "GET|POST",
                headers:[
                    {authorization: "bearer $token"}
                ]     
            },
            {
                name: "/all",
                descritption: "Get all tasks",
                type: "GET|POST",
                headers:[
                    {authorization: "bearer $token"}
                ]    
            }
        ]
    });
});

module.exports = router