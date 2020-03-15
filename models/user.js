const bcrypt = require('bcrypt');
const {InsertUser, GetUserByName, UpdateUser} = require("../utils/Database");
const {Encrypt} = require("../utils/Token");

const userTemplate = {
    _id: undefined,
    type: "user",
    name: "Bob",
    password: "Hashed",
    done: [],
};

exports.CreateUser = async (username, password) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    let u = {
        type: "user",
        name: username,
        password: hash,
        done: []
    };

    u = await InsertUser(u);
    return u;
}

exports.Login = async (user, password) => {
    let foundUser = await GetUserByName(user);
    if(await bcrypt.compare(password, foundUser.password)){
        delete foundUser._rev;
        delete foundUser.password;
        delete foundUser.type;
        delete newUserData.roles;
        return {token: await Encrypt(foundUser)};
    }else{
        return {
            fail: true,
            msg: "Wrong username/password"
        };
    }
}

exports.updateUser = async (user) => {
   let newUser = await UpdateUser(user);
   if(newUser.ok){
       let newUserData = newUser.updatedUser;
       delete newUserData._rev;
       delete newUserData.password;
       delete newUserData.roles;
       return {token: await Encrypt(newUserData)};
   }else{
       return {Error: "There was a error during updating the user"};
   }
}