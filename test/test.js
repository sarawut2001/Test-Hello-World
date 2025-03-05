const assert = require("assert");
const request = require("supertest");
const app = require("../main"); // เปลี่ยนจาก const server = ...

describe('Test all / request', function () {
    it('Test request to /', async function () {
        const getResponse = await request(app).get('/');
        assert.equal(getResponse.status, 200, 'Status Code');
    });

    it('Test request to /fail', async function () {
        const getResponse = await request(app).get('/fail');
        assert.equal(getResponse.status, 500, 'Status Code');
    });
});