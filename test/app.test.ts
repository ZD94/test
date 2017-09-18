/**
 * Created by Administrator on 2017/8/10.
 */
let request = require('supertest');
import assert = require("assert");

describe("GET /city/:id ", function () {
    let url = 'http://localhost:3001';
    let result = ["id", 'name', 'letter', 'timezone', 'lng', 'lat', 'parentId', 'pinyin'];
    it("GET /city/:id should be ok", function (done) {
        request(url)
            .get("/city/10086857")
            .end((err, res) => {
                if (err)
                    throw err;
                let cities = res.body.data;
                let city = Object.keys(cities);
                for (let value of result) {
                    city.indexOf(value) < 0 ? assert.ok(false) : assert.ok(true)
                }
                done();
            });
    });

    it("GET /city/:id/children should be ok", function (done) {
        request(url)
            .get("/city/3041565/children")
            .end((err, res) => {
                if (err)
                    throw err;
                let cities = res.body.data;
                if (typeof cities == 'string') {
                    cities = JSON.parse(cities);
                }
                for (let city of cities) {
                    assert.equal(!!city.id, true);
                    assert.equal(!!city.name, true);
                    assert.equal(!!city.timezone, true);
                    assert.equal(!!city.letter, true);
                    assert.equal(!!city.lng, true);
                    assert.equal(!!city.lat, true);
                    assert.equal(!!city.parentId, true);
                    assert.equal(!!city.pinyin, true)
                }
                done();
            });
    });

    it('GET /city/:id/parent should be ok', (done) => {
        request(url)
            .get('/city/292969/parent')
            .end((err, res) => {
                if (err)
                    throw err;
                let parentCities = res.body.data;
                if (typeof parentCities == 'string') {
                    parentCities = JSON.parse(parentCities)
                }
                let parentCity = Object.keys(parentCities);
                for (let i of result) {
                    parentCity.indexOf(i) < 0 ? assert.ok(false) : assert.ok(true)
                }
                done();
            });
    });

    it('GET /city/:id/altertname should be ok', (done) => {
        request(url)
            .get('/city/10017452/altername')
            .end((err, res) => {
                if (err)
                    throw err;
                let altername = res.body.data;
                for (let alternames of altername) {
                    assert.equal(!!alternames.value, true)
                }
                done();
            });
    });

    it('GET /city/:id/altername/:lang should be ok', (done) => {
        request(url)
            .get('/city/290557/altername/arc ')
            .end((err, res) => {
                if (err)
                    throw err;
                let alterLangNames = res.body.data;
                assert.equal(!!alterLangNames.value, true);
                done()
            });
    });
});



