#include <Wire.h>
#include "Adafruit_Si7021.h"
#include "Adafruit_SGP30.h"
#include "Arduino.h"
#include "board.h"
#include "LoRaMac.h"
#include "Commissioning.h"
#include <SPI.h>
#include <LoRa.h>
#include <Mcu.h>

#define SCK     5    // GPIO5  -- SX127x's SCK
#define MISO    19   // GPIO19 -- SX127x's MISO
#define MOSI    27   // GPIO27 -- SX127x's MOSI
#define SS      18   // GPIO18 -- SX127x's CS
#define RST     14   // GPIO14 -- SX127x's RESET
#define DIO0    26   // GPIO26 -- SX127x's IRQ(Interrupt Request)
#define DIO1    35   // GPIO33 -- SX127x's IRQ(Interrupt Request)

uint32_t  LICENSE[4] = {0x9870E38F,0xA66E379A,0x1F9B657C,0xE44D3534};

// Temp/Hum Sensor 
char Humidity_10;
char Humidity_1;
char Temperature_Sign;
char Temperature_High;
char Temperature_Low;
char Temperature_Decimal;

// Gas Sensor
char CO2_10000;
char CO2_1000;
char CO2_100;
char CO2_10;
char CO2_1;
char TVOC_10000;
char TVOC_1000;
char TVOC_100;
char TVOC_10;
char TVOC_1;

/**
 * Gas-Sensor funktioniert in Kombination mit DeepSleep nicht.
 * Gas-Sensor hat ebenfalls bei den ersten ca. 20 Messungen default-wert
 * Gas-Sensor benötigt evt. Anlaufzeit, bis er sinnvoll lesen kann
 * Gas-Sensor evt. muss man 12-Stunden lang messen, dann referenzwert nehmen und hardcodiert in eeprom abspeichern
 * und dann Gas-Sensor kann von erster Messung ab, von diesem Wert referenzieren
 * https://learn.adafruit.com/adafruit-sgp30-gas-tvoc-eco2-mox-sensor/arduino-code => baseline
 */

Adafruit_SGP30 gasSensor;
Adafruit_Si7021 tempSensor = Adafruit_Si7021();
int counter = 0;
int bootup = 0;

uint32_t getAbsoluteHumidity(float temperature, float humidity) {
    // approximation formula from Sensirion SGP30 Driver Integration chapter 3.15
    const float absoluteHumidity = 216.7f * ((humidity / 100.0f) * 6.112f * exp((17.62f * temperature) / (243.12f + temperature)) / (273.15f + temperature)); // [g/m^3]
    const uint32_t absoluteHumidityScaled = static_cast<uint32_t>(1000.0f * absoluteHumidity); // [mg/m^3]
    return absoluteHumidityScaled;
}

void setup(){
  Serial.begin(115200);
  delay(1000); //Take some time to open up the Serial Monitor

  Serial.println("----------------------------SETUP----------------------------------");
  
  SPI.begin(SCK,MISO,MOSI,SS);
  Mcu.begin(SS,RST,DIO0,DIO1,LICENSE);
  DeviceState = DEVICE_STATE_INIT;
  
  if (!tempSensor.begin()) {
    Serial.println("Did not find Si7021 sensor!");
    while (true);
  }

  if (! gasSensor.begin()){
    Serial.println("Sensor not found :(");
    while (1);
  }
}

/**
 * Update temperature fields in payload array.
 * At the moment all values are always positive.
 */
void updateTemp() {
      // convert int to char-array
      char tempBuffer[16];
      int exitTemp = snprintf(tempBuffer, sizeof tempBuffer, "%f", tempSensor.readTemperature());
      if (exitTemp < 0) {
        Serial.println("Exit-code: reading temperature...");
      }
      if (exitTemp >= sizeof tempBuffer) {
        Serial.println("Temp was truncated...");
      }
      Serial.print("Temperature: ");
      Serial.print(tempBuffer[0]);
      Serial.print(tempBuffer[1]);
      Serial.print(tempBuffer[2]);
      Serial.println(tempBuffer[3]);
      Temperature_Sign = '+';
      Temperature_High = tempBuffer[0];
      Temperature_Low = tempBuffer[1];
      Temperature_Decimal = tempBuffer[3];
}

/**
 * Update humidity fields in payload array.
 */
void updateHum() {
      // convert int to char-array
      char humBuffer[16];
      int exitHum = snprintf(humBuffer, sizeof humBuffer, "%f", tempSensor.readHumidity());
      if (exitHum < 0) {
        Serial.println("Exit-code: reading humidity...");
      }
      if (exitHum >= sizeof humBuffer) {
        Serial.println("Hum was truncated...");
      }
      Serial.print("Humidity: ");
      Serial.print(humBuffer[0]);
      Serial.println(humBuffer[1]);
      Humidity_10 = humBuffer[0];
      Humidity_1 = humBuffer[1];
}

/**
 * Update gas fields in payload array.
 */
void updateGas() {
    // set the absolute humidity to enable the humditiy compensation for the air quality signals
    float temperature = tempSensor.readTemperature();
    float humidity = tempSensor.readHumidity();
    gasSensor.setHumidity(getAbsoluteHumidity(temperature, humidity));
    
    if (! gasSensor.IAQmeasure()) {
      Serial.println("Measurement failed");
      return;
    }
    
    // measure co2 and convert it from int16 to char-array
    uint16_t co2 = gasSensor.eCO2;
    char co2Buffer[5];
    sprintf(co2Buffer, "%d", co2);

    Serial.print("eCO2 "); Serial.print(gasSensor.eCO2); Serial.println(" ppm");
    Serial.println(co2Buffer);

    // measure tvoc and convert it from int16 to char-array
    uint16_t tvoc = gasSensor.TVOC;
    char tvocBuffer[5];
    sprintf(tvocBuffer, "%d", tvoc);

    Serial.print("TVOC "); Serial.print(gasSensor.TVOC); Serial.println(" ppb");
    Serial.println(tvocBuffer);
    CO2_10000 = co2Buffer[0];
    CO2_1000 = co2Buffer[1];
    CO2_100 = co2Buffer[2];
    CO2_10 = co2Buffer[3];
    CO2_1 = co2Buffer[4];
    
    TVOC_10000 = tvocBuffer[0];
    TVOC_1000 = tvocBuffer[1];
    TVOC_100 = tvocBuffer[2];
    TVOC_10 = tvocBuffer[3];
    TVOC_1 = tvocBuffer[4];

    if (counter == 30) {
      counter = 0;
  
      uint16_t TVOC_base, eCO2_base;
      if (! gasSensor.getIAQBaseline(&eCO2_base, &TVOC_base)) {
        Serial.println("Failed to get baseline readings");
        return;
      }
      Serial.print("****Baseline values: eCO2: 0x"); Serial.print(eCO2_base, HEX);
      Serial.print(" & TVOC: 0x"); Serial.println(TVOC_base, HEX);
    }
}

void loop(){
  // Gas sensor requires bootup time of about 15 to 20seconds in order to measure values correctly.
  if(DeviceState == DEVICE_STATE_INIT) {
    for(bootup=0; bootup < 20; bootup++){
      updateGas();
      delay(1000);
    }
  }

  // state-machine
  switch( DeviceState )
  {
    // initialize device and lora communication
    case DEVICE_STATE_INIT:
    {
      Serial.println();
      Serial.println("DEVICE_STATE_INIT");
      LoRa.DeviceStateInit();
      if(IsLoRaMacNetworkJoined==false)
      {DeviceState = DEVICE_STATE_JOIN;}
      else
      {DeviceState = DEVICE_STATE_SEND;}
      break;
    }
    // join lora network
    case DEVICE_STATE_JOIN:
    {
      Serial.println();
      Serial.println("DEVICE_STATE_JOIN");
      LoRa.DeviceStateJion();
      break;
    }
    // after successful initializing and joining start sending payload
    case DEVICE_STATE_SEND:
    {
      Serial.println();
      Serial.println("DEVICE_STATE_SEND");
      // update temperature variables with newly measured temperature
      updateTemp();
      // update humidity variables with newly measured humidity
      updateHum();
      // update gas variables with newly measured gas values (co2 and tvoc)
      updateGas();
      
      lora_printf("Into send state\n");
      PrepareTxFrame( AppPort );
      LoRa.DeviceStateSend();
      DeviceState = DEVICE_STATE_CYCLE;
      break;
    }
    // set timer for next outgoing packet
    case DEVICE_STATE_CYCLE:
    {
      Serial.println();
      Serial.println("DEVICE_STATE_CYCLE");
      // Schedule next packet transmission
      TimerSetValue( &TxNextPacketTimer, TxDutyCycleTime );
      TimerStart( &TxNextPacketTimer );
      DeviceState = DEVICE_STATE_SLEEP;
      break;
    }
    // set device to deep sleep mode for about 60seconds
    case DEVICE_STATE_SLEEP:
    {
      Serial.println();
      Serial.println("DEVICE_STATE_SLEEP");
      LoRa.DeviceSleep(IsLowPowerOn,DebugLevel);
      break;
    }
    default:
    {
      Serial.println();
      Serial.println("default");
      DeviceState = DEVICE_STATE_INIT;
      break;
    }
  }
}
