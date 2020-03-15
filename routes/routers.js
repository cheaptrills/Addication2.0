exports.Getpaths = (pathName) => {
    let paths = [];

    require("fs").readdirSync(pathName).forEach(function(file) {
        let fileShort = file.replace(".js", "");
        paths.push(`/${fileShort}`);
    });
    return paths;
}

exports.SetRouter = (pathName, router) => {
    let paths = [];

    require("fs").readdirSync(pathName).forEach(function(file) {
        let fileShort = file.replace(".js", "");
        let t = require(`${pathName}/` + file);
        router.use(`/${fileShort}`, t);
        paths.push(`/${fileShort}`);
    });
}