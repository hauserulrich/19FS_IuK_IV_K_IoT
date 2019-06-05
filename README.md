# 19FS_IuK_IV_K_IoT

IoT-Projekt HTW Chur 2019, Frühjahrssemester

## Introduction
This project was made by students at the [NTB](www.ntb.ch) as a semesterproject.
The purpose of this project is to get used to the Internet of Things.
The task was the following:
Send Data from Things (in this case LoRa-Nodes with Sensors) via LoRa-Gateway to [TheThingsNetwork](www.thethingsnetwork.org).
Afterwards, read the Sensor data and show them in a webapplication.
## Participants
- Silvan Knecht
- Silvio Jäger
- Jann Lemm
- Andreas Jung
- Janick Hartmann
- Sandro Santoro
- Gian Brunner

Under the guidance of Prof. Dr. Ulrich Hauser-Ehninger


## preperations

### env variables

#### the things network

- TTN_APPID
- TTN_ACCESSKEY

## dataStorage

create a data.json inside of server/ with the following content:

```json
{
  "GebäudeA": { "temperature": [], "humidity": [], "time": [] },
  "GebäudeB": { "temperature": [], "humidity": [], "time": [] },
  "Kreisel": { "temperature": [], "humidity": [], "time": [] }
}
```

## start server

To start the server you can use this script.bat. Don't forget to replace everything in <>. For development purposes install npm i -g nodemon or change it to node.

```
start cmd /k "cd PATH_TO_SERVERFOLDER && c: && set TTN_APPID=<APPID> && set TTN_ACCESSKEY=<ACCESSKEY> && set PORT=3000 && nodemon run"
```
