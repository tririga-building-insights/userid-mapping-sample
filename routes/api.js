const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const request = require('request');
const parse = require('csv-parse/lib/sync')

var router = express.Router();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const peopleOSLC = "/oslc/spq/ibmTbiPeopleAllocation?oslc.select=*,spi:people{*},spi:cb{*},spi:occ{*}&oslc.where=spi:floorPath=";

// the csv is read in sync, if the csv is huge, convert this to be read async
const csvFileName = path.join(__dirname, '../', 'mapping-csv', 'mapping.csv');
let csvContent = fs.readFileSync(csvFileName, 'utf8');
const csvRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  })


router.get('/', function (req, response, next) {

    if (!req.query.floorPath) {
        console.log("Floor path not passed. Ensure floorPath is passed as a query parameter");
        response.status(400).send({
            "message": "floorPath query param not found"
        });
        return;
    }

    if (!req.query.idField) {
        console.log("ID field not passed. Ensure Id field is passed as a query parameter");
        response.status(400).send({
            "message": "idField query param not found"
        });
        return;
    }

    try {
        var filename = path.join(__dirname, '../', 'config.yml'),
        contents = fs.readFileSync(filename, 'utf8'),
        config = yaml.load(contents);
        if(!config.tririgaCredentials || !config.tririgaCredentials.url || !config.tririgaCredentials.username || !config.tririgaCredentials.password) {
            response.status(400).json({
                "message" : "Set TRIRIGA credentials on the user mapping"
            })
            return;
        }
        let tririgaUrl = config.tririgaCredentials.url + peopleOSLC + req.query.floorPath;
        let tririgaReqOptions = {
            url: tririgaUrl,
            method: "GET",
            auth: {
                'user': config.tririgaCredentials.username,
                'pass': config.tririgaCredentials.password,
                'sendImmediately': true
            }
        };
        request(tririgaReqOptions, function (error, triResponse, triBody) {
            if (error) 
                response.status(500).send(String(error));
                
            let oslcJson = JSON.parse(triBody);

            let final = {
                map : []
            };
            for (const memberRecord of oslcJson["rdfs:member"]) {
                // iterate only for the records that have the property 'spi:people', others dont have people assigned
                if(memberRecord['spi:people']) {
                    for (const people of memberRecord['spi:people']) {
                        if(people[req.query.idField]) {
                            let matchId = people[req.query.idField];
                            console.log(matchId);
                            for (const csv of csvRecords) {
                                console.log(csv);
                                if(matchId === csv.userId) {
                                    final.map.push(csv);
                                }
                            }
                        }
                            
                    }
                }
            }
            console.log("Fetched records size :",final.map.length);
            response.json(final);
          });
    } catch (err) {
        console.log(err.stack || String(err));
        response.status(500).send(String(err));
    }
});

module.exports = router;