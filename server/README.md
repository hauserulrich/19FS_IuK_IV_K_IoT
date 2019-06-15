# Server
## Description
The server is the connection between all parts of the system.  All information comes together and is processed. Firstly the server receives the data which was sent to the The Things Network by the Devices. In a further step the data is encoded and stored in a file. For now the file will accept 10'000 entries for every device and value, after that older data is replaced! Lastly the data is sent to the MQTT Broker.

## Preperations

### Env variables

#### The Things Network
before you can start the server, you need following parameters from your The Things Network application

- TTN_APPID
- TTN_ACCESSKEY

### Edit Url
you also need to change the url located in server/public/javascript/index.js. In case your not using any of the presented urls you also need to add your url to the allowed Origins Array in the server/index.js file.

## Start server

To start the server you can use this script.bat. Don't forget to replace everything in <>. For development purposes install npm i -g nodemon or change it to node.

```
start cmd /k "cd PATH_TO_SERVERFOLDER && c: && set TTN_APPID=<APPID> && set TTN_ACCESSKEY=<ACCESSKEY> && set PORT=2222 && nodemon run"
```
## API
### Page routes
```
GET     /                      
```
- Response: index.html

### Data
```
GET	/api/v1/data            
```
Returns the stored data of all available Devices.

- Response example:
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

### MQTT
For MQTT a public broker from [hivemq](https://www.hivemq.com/public-mqtt-broker/) is in use. 
Broker URL: mqtt://broker.hivemq.com

```
TOPIC	  htwchurwebofthings:newData         
```
Under this topic newData is published as soon as the Devices send new Data.

- Response example:
````javascript
{
  "iuk_lora_01": {
    "data": {
      "temperature": 31,
      "humidity": 58,
      "co2": 34,
      "time": "2019-10-04 00:00:00"
    }
  }
}
````

