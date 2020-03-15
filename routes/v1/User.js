const express = require("express");
const {Verify} = require("../../utils/token");
const {Login, CreateUser, updateUser} = require("../../models/user");
const bcrypt = require('bcrypt');
const router = express.Router();

const AUTOLOGINAFTERREGISTER = process.env.AUTO_LOGIN || true;

router.use("/me", Verify, (req, res) => {
    res.json(req.user);
})

router.post("/login", async (req, res) => {
    let {username, password} = req.body;
    res.json(await Login(username, password));
});

router.post("/register", async (req, res) => {
    let {username, password} = req.body;
    let returnData = {Ok: false};
    const response = await CreateUser(username, password);
    if(response.Ok){
        if(AUTOLOGINAFTERREGISTER) returnData = {...returnData, ...await Login(username, password)};
        returnData = {...returnData, Ok: true}
    }else{
        returnData = response;
    }
    res.json(returnData);
});
7
router.post("/update", Verify, async(req, res) => {
    let updateData = req.body;
    delete updateData._id;
    delete updateData.name;
    if(updateData.password){
        var salt = bcrypt.genSaltSync(10);
        updateData.password = bcrypt.hashSync(updateData.password, salt)
    }
    res.json(await updateUser({...req.user, ...updateData}));
});

router.use("/", (req,res) => {
    res.json({
        paths: [
            {
                name: "/me",
                type: "GET|POST",
                headers:[
                    {authorization: "bearer $token"}
                ],
                return: {
                    type: "application/json",
                    body:{
                        "_id": "<user id>",
                        "name": "<user name>",
                        "done": [
                            "<done task id>"
                        ],
                        "iat": 1584143935
                    }
                }        
            },
            {
                name: "/login",
                type: "POST",
                headers:[],
                body:{
                    username: "username|string",
                    password: "password|string"
                },
                return:{
                    type: "application/json",
                    success_body:{
                        token: "<bearer token>"
                    },
                    fail_body: {
                        "fail": true,
                        "msg": "Wrong username/password"
                    }
                }
            },
            {
                name: "/register",
                type: "POST",
                headers:[],
                body:{
                    username: "username|string",
                    password: "password|string"
                },
                return:{
                    type: "application/json",
                    success_body:{
                        "Ok": true,
                        token: "<bearer token>"
                    },
                    fail_body: {
                        "Ok": false,
                        msg: "<reason why the registration failed>"
                    }
                }
            },
            {
                name: "/update",
                type: "POST",
                body:{
                    password: "<new password>",
                    "done": [
                        "<done task id>",
                        "<new done task>"
                    ]
                },
                headers:[
                    {authorization: "bearer $token"}
                ],
                return:{
                    type: "application/json",
                    success_body:{
                        token: "<new bearer token>"
                    },
                    fail_body: {
                        error: "<Reason why it failed>"
                    }
                }      
            }
        ]
    });
});

module.exports = router