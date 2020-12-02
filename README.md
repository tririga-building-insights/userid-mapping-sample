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
3. API must accept the following query parameter
    1. *floorId* - Floor ID path from the TRIRIGA floor
    2. *idField* - User ID field in TRIRIGA to which the mapping is to be done
