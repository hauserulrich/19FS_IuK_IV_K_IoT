# 19FS_IuK_IV_K_IoT
IoT-Projekt HTW Chur 2019, Frühjahrssemester

## env variables
### the things network
- TTN_APPID
- TTN_ACCESSKEY

## start server
To start the server you can use this script.bat. Don't forget to replace everyting in <>. For development purposes install npm i -g nodemon or change it to node.
```
start cmd /k "cd PATH_TO_SERVERFOLDER && c: && set TTN_APPID=<APPID> && set TTN_ACCESSKEY=<ACCESSKEY> && set PORT=3000 && nodemon run"
```
