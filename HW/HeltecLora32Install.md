# Installation Heltec LoRa32 unter Arduino für das TTN

**LoRa-Modul nicht  anstecken, bevor Antenne montiert (Modul kann zerstört werden)
**

* Antenne montieren
 
* Modul anstecken
 
## Arduino

### Ubuntu
* [neueste Arduino IDE herunterladen](https://www.arduino.cc/en/main/software), auch wenn schon eine Arduino IDE installiert ist
* als neue Installation an geeignete Position auspacken

* im Verzeichnis der Arduino IDE in Verzeichnis `hardware` wechseln

* Bei [GitHub Heltec Kit besorgen](https://github.com/Heltec-Aaron-Lee/WiFi_Kit_series). Dort gibt es einen Install Guide.

	+ Für Ubuntu muss man ein Git-Repository holen
	
* [ESP32_LoRaWAN library](https://redirect.viglink.com/?format=go&jsonp=vglnk_155862423048117&key=acd882f55d3709c9d7764b784bfa62d6&libId=jw0q8u7901029g8l000DAjngxipym&loc=https%3A%2F%2Frobotzero.one%2Fheltec-lora32-lorawan-node%2F&v=1&out=https%3A%2F%2Fgithub.com%2FHelTecAutomation%2FESP32_LoRaWAN%2Farchive%2Fmaster.zip&ref=https%3A%2F%2Fwww.google.ch%2F&title=Heltec%20LoRa%2032%20LoRaWAN%20Node%20on%20The%20Things%20Network%20%E2%80%93%20Robot%20Zero%20One&txt=https%3A%2F%2Fgithub.com%2FHelTecAutomation%2FESP32_LoRaWAN%2Farchive%2Fmaster.zip) muss installiert werden. Zip-File in /libraries der Arduino IDE auspacken.

* neue Arduino IDE starten

* Das Projekt `hardware/heltec/esp32/libraries/ESP32/examples/ChipID/GetChipID/GetChipID.ino` laden.
* Bei Fehlermeldung, dass serial nicht gefunden wird, [serial für python 2 installieren](https://engineerworkshop.com/2019/03/02/esp32-compiler-error-in-arduino-ide-heltec-esp32-tools-esptool-esptool-py-no-module-named-serial-tools-list_ports/)

Ist alles in Ordnung, sollte der Serial Monitor (Achtung, Baudraten angleichen) eine id wie `ESP32 Chip ID = EC6A178E0D84` anzeigen.

### Heltec Registrierung

Um einen Licence Key zu bekommen, muss man sich [bei Heltec anmelden](https://redirect.viglink.com/?format=go&jsonp=vglnk_155862124990411&key=acd882f55d3709c9d7764b784bfa62d6&libId=jw0q8u7901029g8l000DAjngxipym&loc=https%3A%2F%2Frobotzero.one%2Fheltec-lora32-lorawan-node%2F&v=1&out=http%3A%2F%2Fwww.heltec.cn%2Fsearch%2F&ref=https%3A%2F%2Fwww.google.ch%2F&title=Heltec%20LoRa%2032%20LoRaWAN%20Node%20on%20The%20Things%20Network%20%E2%80%93%20Robot%20Zero%20One&txt=http%3A%2F%2Fwww.heltec.cn%2Fsearch%2F).

## Am TTN anmelden

### Device registrieren

Beim TTN muss ein neues Device registriert werden.

###Eintragen der Registrierung
Iin \libraries\ESP32_LoRaWAN-master\src in der Arduino IDE

#### Commissioning.h

* LORAWAN_DEVICE_EUI

* LORAWAN_APPLICATION_EUI

* LORAWAN_APPLICATION_KEY

mit den Werten aus der TTN-Device Registrierung ersetzen

#### LoRaMac-definitions.h

USE_BAND_xyz einstellen (USE_BAND_868)

## Beispielapplikation starten

Bei den examples `ESP_32LoRaWan` den Sketch `OTAA` öffnen.
`LICENSE[4]` mit der Heltec-License ersetzen
Nach dem Start sollte bei TTN alle Minute ein Datenpaket eingehen 

## registrierte Nodes

* iuk_lora_01:
	* Heltec:
	* TTN:
		* DEVICE_EUI `{ 0x00, 0x97, 0xF5, 0x3A, 0xDD, 0x12, 0x87, 0xDF }`
		* APPLICATION_EUI `{ 0x70, 0xB3, 0xD5, 0x7E, 0xD0, 0x01, 0xB2, 0xAF }`
		* APPLICATION_KEY `{ 0x53, 0x96, 0x07, 0x1A, 0x55, 0x44, 0x5A, 0x41, 0xBB, 0xE1, 0x6C, 0x28, 0x4B, 0x13, 0x41, 0x3A }`
		
* iuk_lora_03:
	* Heltec: FCAA81E350CC -> 0x9870E38F,0xA66E379A,0x1F9B657C,0xE44D3534
	* TTN:
		* DEVICE_EUI `{ 0x00, 0x73, 0xB3, 0xD3, 0x0E, 0x11, 0x3F, 0x95 }`
		* APPLICATION_EUI `{ 0x70, 0xB3, 0xD5, 0x7E, 0xD0, 0x01, 0xB2, 0xAF }`
		* APPLICATION_KEY `{ 0xD6, 0x9D, 0x8F, 0xF7, 0x48, 0x00, 0xEE, 0x02, 0xB3, 0xEF, 0x7B, 0x50, 0x57, 0x16, 0x86, 0x93 }`		
	
* iuk_lora_04
	* Heltec: EC6A178E0D84 -> 0x1AF05844,0x6256B9F4,0x1FF33F31,0x211403FD
	* TTN:
		* DEVICE_EUI `{ 0x00, 0x80, 0x00, 0x28, 0x18, 0xB5, 0xD8, 0xC5 }`
		* APPLICATION_EUI `{ 0x70, 0xB3, 0xD5, 0x7E, 0xD0, 0x01, 0xB2, 0xAF }`
		* APPLICATION_KEY `{ 0xBE, 0xDE, 0x6F, 0x9C, 0x92, 0xA6, 0xA5, 0xA6, 0x9D, 0x9D, 0x48, 0xCC, 0x4B, 0x3B, 0x20, 0x6B }`
	
		

