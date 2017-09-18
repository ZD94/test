/**
 * Created by wlh on 2017/7/18.
 */

'use strict';

//导入express模块
import express = require("express");
const app = express();
import {DB} from '@jingli/database';
import _ = require("lodash")

const ERROR_MSG = {
    '0': 'ok',
    "500": "缺少参数",
    "502": "系统内部错误",
    "404": "请求的接口不存在",
    "403": "没有权限访问",
};

function resData(res: express.Response, code: number, data: any) {
    res.json({
        code: code,
        msg: ERROR_MSG[code],
        data: data,
    })
}

//城市信息
app.get("/city/:id", async (req, res, next) => {
    try {
        let {id} = req.params;
        let cities = await DB.models['City'].findById(id);
        return resData(res, 0, cities);
    } catch (err) {
        next(err);
    }
});
//城市下一级
app.get("/city/:id/children", async (req, res, next) => {
    try {
        let {id} = req.params;
        let cities = await DB.models['City'].findAll({where: {parentId: id}});
        return resData(res, 0, cities);
    } catch (err) {
        next(err);
    }
});

//城市上一级
app.get('/city/:id/parent', async (req, res, next) => {
    try {
        let {id} = req.params;
        let {lang} = req.query;
        if (!lang) {
            lang = 'zh';
        }
        let city = await DB.models['City'].findById(id);
        let parentCity = await DB.models['City'].findById(city.parentId);
        if (parentCity) {
            let ret = parentCity.toJSON();
            let alternateNames = await DB.models['CityAltName'].find({where: {cityId: id}});
            let alternateName = await DB.models['CityAltName'].findOne({where: {cityId: id, lang: lang}});
            if (alternateName) {
                ret.name = alternateName.value;
            }
            ret.alternateNames = alternateNames;
            return resData(res, 0, ret)
        } else {
            res.send('该城市没有上一级')
        }
    } catch (err) {
        next(err)
    }
});

//城市全部别名
app.get('/city/:id/altername', async (req, res, next) => {
    try {
        let {id} = req.params;
        let alternateName = await DB.models['CityAltName'].findAll({where: {cityId: id}});
        return resData(res, 0, alternateName)
    } catch (err) {
        next(err)
    }});

//城市别名
app.get('/city/:id/altername/:lang', async (req, res, next) => {
    try {
        let {id} = req.params;
        let {lang} = req.params;
        let alternateNames = await DB.models['CityAltName'].find({where: {cityId: id, lang: lang}});
        console.log(alternateNames.value,'--------------');
        return resData(res, 0, alternateNames)
    } catch (err) {
        next(err)
    }
});

app.get('/test', (req, res, next) => {
    res.send('ok');
});

export default app;
