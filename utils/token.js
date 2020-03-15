const jwt = require("jsonwebtoken");
const {GetUserRole} = require("./Database");

const secret = process.env.SECRET || "test";
const AUTH_TYPE = "Bearer ";

exports.Verify = (req, res, next) => {
    let token = req.headers["authorization"];
    if(token == undefined) {res.json({Error: "Error no Authorization was given"}); return;}
    token = token.slice(AUTH_TYPE.length, token.length);
    try{
        let user = jwt.decode(token);
        req.user= user;
        next();
    }
    catch{
        res.json({Error: "There was a problem"});
    }
};

exports.Encrypt = async (data) => {
    let t= jwt.sign(data, secret);
    return t;
}

exports.HasRole = (rolename) => {
    return async (req, res, next) => {
        let user = req.user;
        let roles = await GetUserRole(user._id);
        if(roles != null && roles.includes(rolename))
        {
            next();
        }else{
            res.json({Error: "You do not have the correct role"});
            return;
        }
    }
}