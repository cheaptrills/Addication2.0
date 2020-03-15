const {GetTasks, GetLowerLevel, InsertTask, RemoveTask} = require("./../utils/database");

const taskTemplate = {
    name: "<Task name>",
    level: 1,
    forusers: 1,
    type: "task"
};

exports.GetAllTasks = async () => {
    return await GetTasks();
}

exports.GetLowerLevel = async (level) => {
    return await GetLowerLevel(level);
}

exports.InsertTask = async (name, level, forusers, subtasks) => {
    return InsertTask({
        name,
        level,
        forusers,
        subtasks,
        type: "task"
    });
}

exports.RemoveTask = async(taskId) => {
    return await RemoveTask(taskId);
}