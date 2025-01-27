const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send(`${"<h1><center style='font-size:50px;'>"}Hello World!!${"</center></h1>"}`);
})

app.listen(8888, () =>{
    console.log("Running on port 8888");
    console.log("http://localhost:8888/");
})
