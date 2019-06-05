# Server

## preperations

### env variables

#### the things network
before you can start the server, you need following parameters from your The Things Network application

- TTN_APPID
- TTN_ACCESSKEY


## start server

To start the server you can use this script.bat. Don't forget to replace everything in <>. For development purposes install npm i -g nodemon or change it to node.

```
start cmd /k "cd PATH_TO_SERVERFOLDER && c: && set TTN_APPID=<APPID> && set TTN_ACCESSKEY=<ACCESSKEY> && set PORT=3000 && nodemon run"
```
## API
### Single page routes
```
GET     /                      
```
- Response: index.html

```
GET		/api/v1/data            
```
Returns the stored data.

- Response:
````javascript
{
   "iuk_lora_01":{
      "info":{
         "name":"Zimmer1"
      },
      "data":{
         "temperature":[],
         "humidity":[],
         "co2":[],
         "time":[]
      }
   },
   "iuk_lora_02":{
      "info":{
         "name":"Zimmer2"
      },
      "data":{
         "temperature":[],
         "humidity":[],
         "co2":[],
         "time":[]
      }
   },
   "iuk_lora_03":{
      "info":{
         "name":"Kreisel"
      },
      "data":{
         "temperature":[],
         "humidity":[],
         "co2":[],
         "time":[]
      }
   },
   "iuk_lora_04":{
      "info":{
         "name":"HTW-Dach"
      },
      "data":{
         "temperature":[],
         "humidity":[],
         "co2":[],
         "time":[]
      }
   }
}
````

### Data
