import express from "express";
import {fetchData} from "../services/fetch.js";
import dotenv from "dotenv"; dotenv.config();

const geographieRouter = express.Router();
const colorMap = {
    grey: 0,
    lightyellow: 1000,
    yellow: 5000,
    orange: 10000,
    darkorange: 20000,
    orangered: 50000,
    red: 100000,
    darkred: Infinity,
};

geographieRouter.get('/regions', async (req, res) => {
    const url = process.env.API_GEOGRAPHIE + '/regions';
    const data = await fetchData(url);
    const outreMer = ['01','02','03','04','05','06'];
    const filteredData = data.filter((region) => !outreMer.includes(region.code));
    res.send(filteredData);
});
geographieRouter.get('/regions/:id/departements', async (req, res) => {
    const id = req.params.id;
    const url = process.env.API_GEOGRAPHIE + `/regions/${id}/departements`;
    const data = await fetchData(url);
    res.send(data);
});
geographieRouter.get('/regions/:idReg/departements/:idDep/communes', async (req, res) => {
    const idDep = req.params.idDep;
    const fields = ['code','nom','codeDepartement','codeRegion','population']
    const url = process.env.API_GEOGRAPHIE + `/departements/${idDep}/communes?fields=${fields.join(',')}`;
    const data = await fetchData(url);
    res.send(data);
});
geographieRouter.get('/communes', async (req, res) => {
    const url = process.env.API_GEOGRAPHIE + '/communes';
    const data = await fetchData(url);
    const keepKeys = ['code', 'population'];
    const newData = data.map((object) => {
        const newObject = {};
        for (const key in object) {
            if (keepKeys.includes(key)) {
                newObject[key] = object[key];
            }
        }
        newObject.color = 'grey';
        for (const [colorKey, populationThreshold] of Object.entries(colorMap)) {
            if (newObject.population <= populationThreshold) {
                newObject.color = colorKey;
                break;
            }
        }
        return newObject;
    });
    res.send({communes:newData,legend:colorMap});
});

geographieRouter.get('/localisation/commune',async (req, res) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    if(longitude && latitude){
        const fields = ['code', 'codeDepartement', 'codeRegion']
        const url = process.env.API_GEOGRAPHIE + `/communes/?lat=${latitude}&lon=${longitude}&fields=${fields.join(',')}`;
        const data = await fetchData(url);
        res.send(data);
    } else {
        res.send([]);
    }
})
export default geographieRouter;