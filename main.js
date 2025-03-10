const express = require("express");
const app = express();
const client = require("prom-client");

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
    name: "http_request_total",
    help: "Total request count",
    labelNames: ["method", "path", "status"]
});

register.registerMetric(httpRequestCounter);

app.get("/", (req, res) => {
    httpRequestCounter.inc({ method: 'GET', path: '/', status: '200' });
    res.send(`${"<h1><center style='font-size:50px;'>"}Hello World!!${"</center></h1>"}`);
});

app.get("/fail", (req, res) => {
    httpRequestCounter.inc({ method: 'GET', path: 'fail', status: '500' });
    res.send(`${"<h1><center style='font-size:50px; color: red;'>"}Fail Page!!${"</center></h1>"}`);
});

app.get("/metrics", async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = app; 

if (require.main === module) {
    const port = process.env.PORT || 8888;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}