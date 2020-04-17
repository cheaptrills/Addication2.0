const Primus = require ("primus");

const go = (server)=> {

    let primus = new Primus(server,{});

    primus.on("connection",spark=>{
    console.log("penis");
        spark.on("data",data=>{

        });
    });
    
}


module.exports.go = go;
