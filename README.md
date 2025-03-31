# Application for IR rework station.

IR rework station is made up of halogen lamp 250 mm for bottom heater, ceramic heater 450 W for top. Raspberry Pi B+ v1.2 controls the process.

## How to use

1. Install Raspbian on ypur RaspberryPi https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system
2. Install Node.js:
   1. Install NVM with the install script:
      `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
   2. Install the latest Long Term Support version of Node with NVM:
      `nvm install --lts`
3. Install Git:
   `sudo apt install git -y`
4. Clone repository:
   `git clone https://github.com/barmenski/ir-station-hw.git`
5. Go to ir-station-hw directory:
   `cd ./ir-station-hw/`
6. Install dependencies:
   `npm install`
7. Run:
   `node index.js`

## Peripheral devices connection diagram

![wiring](https://github.com/barmenski/ir-station-hw/raw/main/assets/ir-station_Sketch.png)

## Video of the device in operation

[![video](https://img.youtube.com/vi/XWZlBCWv8PI/0.jpg)](https://www.youtube.com/watch?v=XWZlBCWv8PI)

[![video](https://img.youtube.com/vi/XlxXhoq2SfA?list=PL6vxfcC_QPnMol9xhfhP5AWL9lPwSGcwa/0.jpg)](https://www.youtube.com/watch?v=XlxXhoq2SfA?list=PL6vxfcC_QPnMol9xhfhP5AWL9lPwSGcwa)

## How it works

- Raspberry Pi measures temperature using a module based on the MAX6675 chip and a K-type thermocouple.

<img src="https://github.com/barmenski/ir-station-hw/raw/main/assets/2023-04-17-sensor.jpg" alt="measure" width="500" height="300">

![measure](https://github.com/barmenski/ir-station-hw/raw/main/assets/2023-04-17-sensor.jpg)

- Based on the measured temperature and the setpoint, the PID module calculates the percentage of power that must be supplied to the heaters.

![pid](https://github.com/barmenski/ir-station-hw/raw/main/assets/PID-diagramme.jpg)

- This percentage of power is transmitted to the PWM module, which controls the heaters.
![pwm](https://github.com/barmenski/ir-station-hw/raw/main/assets/pwm_simple.gif)

- It is necessary to heat the chip at the required speed and for the required duration in order not to damage the chip with high temperature. These parameters are reflected in the thermal profile graphs. Thermal profiles differ for lead-containing solders (products before 2006) and lead-free solders:

![pb+](https://github.com/barmenski/ir-station-hw/raw/main/assets/profile_pb+.jpg)
![pb-](https://github.com/barmenski/ir-station-hw/raw/main/assets/profile_pb-.jpg)

- To heat according to the thermal profile, you need to select the item "Profil":
![menu-profile](https://github.com/barmenski/ir-station-hw/raw/main/assets/menu_profile.png)

![profile-work](https://github.com/barmenski/ir-station-hw/raw/main/assets/profile_work.gif)

- To heat and maintain the desired temperature, you must select the item "Const":
![menu-const](https://github.com/barmenski/ir-station-hw/raw/main/assets/menu_const.png)
![const-video](https://github.com/barmenski/ir-station-hw/raw/main/assets/const_video.gif)

## TODO
- [ ] The ability to connect to a hotspot on phone