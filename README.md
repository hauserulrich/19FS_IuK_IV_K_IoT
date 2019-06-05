# 19FS_IuK_IV_K_IoT
IoT-Projekt HTW Chur 2019, Frühjahrssemester

## Beschreibung
Für das IoT Projekt am NTB soll eine Wetterstation aufgebaut werden. Das ganze soll mittels LoraWan realsiert werden. Verschiedene batteriebetriebene nodes messen CO2 , Luftströmung, Temparatur und Feuchtigkeit und senden diese mittels LoraWan an ein Gateway welches aus einem RaspberryPi mit LoraBee besteht. Die Visualisierung der Daten soll mit einer NodeJS Webapplikation realisiert werden. Die zu visualisierenden Daten werden mittels MQTT Broker ausgeliefert.In einem ersten Schritt wird das Gateway direkt die Funktion des MQTT Broker übernehmen. Später soll der online Dienst «the things network» dies Funktion übernehmen.
