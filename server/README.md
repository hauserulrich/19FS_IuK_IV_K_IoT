# 19FS_IuK_IV_K_IoT

IoT-Projekt HTW Chur 2019, Frühjahrssemester

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
