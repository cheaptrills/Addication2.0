const DB_USER = process.env.DB_USER || "admin";
const DB_PASS = process.env.DB_PASS || "mypassword";
const DB_HOST = process.env.DB_HOST || "localhost:5984";

const nano = require('nano')(`http://${DB_USER}:${DB_PASS}@${DB_HOST}`);

const DATABASE_NAME = "test";
let db = nano.db.use(DATABASE_NAME);

// User stuff
nano.db.list().then((body) => {
    let ex = false;
    body.forEach((dbName) => {
        if(dbName == DATABASE_NAME){
            ex = true;
        }
    });
    if(!ex){
        nano.db.create(DATABASE_NAME).then(() => db = nano.db.use(DATABASE_NAME));
    }
    else{
        db = nano.db.use(DATABASE_NAME);
    }
});

exports.InsertUser = async (user) => {
    let foundUser = await GetUserByName(user.name);
    if(foundUser == undefined){
        let t = await db.insert(user);
        if(t.ok){
            user._id = t.id;
            return {Ok: true,user};
        }
    }else{
        return {
            Ok: false,
            msg: "user already exsists"
        };
    }
}

exports.UpdateUser = async (user) => {
    let foundUser = await GetUserById(user._id);
    if(foundUser != undefined){
        let updatedUser = {...foundUser, ...user};

        let res = await db.insert(updatedUser);
        return {ok: res.ok, updatedUser};
    }
}

const GetUserByName = async (username) => {
    let foundUser = await db.find({
        selector: {
            name: { "$eq": username },
            type: { "$eq": "user" }
        },
        limit: 1
    });
    if(foundUser.docs.length > 0){
        return foundUser.docs[0];
    }else{
        return undefined;
    }
}
const GetUserById = async (id) => {
    let foundUser = await db.find({
        selector: {
            _id: {"$eq": id},
            type: { "$eq": "user" }
        },
        limit: 1
    });
    if(foundUser.docs.length > 0){
        return foundUser.docs[0];
    }else{
        return undefined;
    }
}

exports.GetUserRole = async(id) => {
    let user = await GetUserById(id);
    if('roles' in user){
        return user.roles;
    }else{
        return null;
    }
}

exports.GetUserByName = GetUserByName;
exports.GetUserById = GetUserById;

//Tasks
exports.GetTasks = async () => {
    let found = await db.find({
        selector: {
            type: { "$eq": "task"}
        },
        fields: ["name", "subtasks", "level"],
        limit: 100
    });
    return found.docs;
}

exports.GetLowerLevel = async (level) => {
    let found = await db.find({
        selector: {
            type: { "$eq": "task"},
            level: {"$lt": level}
        },
        fields: ["name", "subtasks", "level"],
        limit: 100
    });
    return found.docs;
}

exports.InsertTask = async (Task) => {
    let t = await db.insert(Task);
    Task.id = t.id;
    return Task;
}

exports.RemoveTask = async (taskId) => {
    let d = await GetTaskById(taskId);
    if(d != undefined){
        await db.destroy(d._id, d._rev);
        return {msg: `Removed ${taskId} from the database`}
    }else{
        return {error: "There was a problem during removeing the document"}
    }
}

exports.UpdateTask = async (task) => {
    let foundTask = await GetTaskById(task._id);
    if(foundTask != undefined){
        let updatedTask = {...foundTask, ...task};
        let res = await db.insert(updatedTask);
        return {ok: res.ok, UpdateTask};
    }
}

const GetTaskById = async(id) => {
    let found = await db.find({
        selector: {
            type: { "$eq": "task"},
            _id: {"$eq": id}
        },      
        limit: 1
    });
    if(found.docs.length > 0){
        return found.docs[0];
    }
    return undefined;
}

exports.GetTaskById = GetTaskById;