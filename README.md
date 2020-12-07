# User ID mapping Interface and Node.js sample

This repository contains the Interface for User ID mapping for TRIRIGA Building Insights(TBI) and the node.js sample. 

## Requirement for mapping

When the `rawUserId` field present in the DNA spaces cannot be mapped to any field in TRIRIGA to detect the occupancy in TBI, mapping component is required to map that user to a known field in TRIRIGA.

For Example, if the `rawUserId` from the DNA spaces is the machineId(machineId.company.com), which is stored in an asset management software and is not present in TRIRIGA. Then we would require this component to map that user

```json
.....
.....
		},
		"rawUserId": "machineId.company.com",
		"visitId": "visit-485538971754805824",
		"entryTimestamp": 1605856997000,
		"entryDateTime": "2020-11-20T02:23:00",
....
....
    
```

# Interface

The mapping component must implement the interface as described below

1. Application hosted on the web on any platform, e.g Node.js, Java. This sample is written in Node.js
2. Expose an API to provide the mapping between the userIDs in DNA space to the TRIRIGA
3. The API must return the mapping only for the floor requested.
3. API must accept the following query parameters
    1. *floorId* - Floor ID path from the TRIRIGA floor. This value received will be encoded as it contains special characters like / and "
    2. *idField* - User ID field in TRIRIGA to which the mapping is to be done
4. Based on the floorId and idField, it must return the mapping between this TRIRIGA ID and the external third party system.
5. The Output must be in the format of the following. `userId` represents field in TRIRIGA and the `mappedId` represents the field in the third part system e.g asset tracking system.
```json
{
    "map": [
        {
            "userId": "6039",
            "mappedId": "johndoe.company.com"
        },
        {
            "userId": "1002354",
            "mappedId": "janedoe.compancy.com"
        },
        {
            "userId": "6037",
            "mappedId": "olivia.company.com"
        }
    ]
}
```
6. The API should be protected by basic authetication and that should be provided in the KPS 

## Sample

In this sample, the mapping is done between a csv file which contains the mapping between the username in TRIRIGA and a ID field present in the external system.

URL exposed - `https:<hostname>/api`

1. Edit the `config.yml` and configure your TRIRIGA credentials
2. Edit the `mapping-csv/mapping.csv` file to match your requirements
3. Now the sample is ready. You can run locally to do a sanity test. Run `npm start` and test the URL on your API tool. `http://localhost:3000/api?floorPath=%22%5CLocations%5COffices%5CNorth%20America%5CCharlotte%20Watson%20Center%5C03%20-%20Third%20Floor%22&idField=spi:username`
4. After the sanity tests, now you can publish this to your IBM cloud. Use the command `cf push <your-app-name>`

