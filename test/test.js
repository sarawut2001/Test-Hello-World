const assert = require("assert");
const request = require("supertest");
const server = require("../main");

describe('Test all / request', function(){
    it('Test request to /', async function () {
        const getResponse = await mockedApp.get('/'); 
        assert.equal(getResponse.status, 200, 'Status Code');      
    });

    it('Test request to /fail', async function () {
        const getResponse = await mockedApp.get('/fail');
        assert.equal(getResponse.status, 500, 'Status Code');        
    });
});