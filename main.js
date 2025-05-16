const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("<h1><center style='font-size:50px;'>Hello World!!</center></h1>");
});

app.get("/fail", (req, res) => {
    res.status(500).send("<h1><center style='font-size:50px; color: red;'>Fail Page!!</center></h1>");
});

module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 8888;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}