# Overview

IR rework station is made up of halogen lamp 250 mm for bottom heater, ceramic heater 450 Watts for top. Raspberry Pi B+ v1.2 controls the process.

## How to use

1. Install Raspbian on ypur Raspberry Pi https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system
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

[![video1](https://img.youtube.com/vi/XWZlBCWv8PI/0.jpg)](https://www.youtube.com/watch?v=XWZlBCWv8PI)

[![video2](https://img.youtube.com/vi/XlxXhoq2SfA/0.jpg)](https://www.youtube.com/watch?v=XlxXhoq2SfA)


## How it works

- Raspberry Pi measures temperature using a module based on the MAX6675 chip and a K-type thermocouple.

<img src="https://github.com/barmenski/ir-station-hw/raw/main/assets/2023-04-17-sensor.jpg" alt="measure" height="480">

- Based on the measured temperature and the setpoint, the PID module calculates the percentage of power that must be supplied to the heaters.

<img src="https://github.com/barmenski/ir-station-hw/raw/main/assets/PID-diagramme.jpg" alt="pid" height="300">

- This percentage of power is transmitted to the PWM module, which controls the heaters.

![pwm](https://github.com/barmenski/ir-station-hw/raw/main/assets/pwm_simple.gif)

- It is necessary to heat the chip at the required speed and for the required duration in order not to damage the chip with high temperature. These parameters are reflected in the thermal profile graphs. Thermal profiles differ for lead-containing solders (products before 2006) and lead-free solders:


<img src="https://github.com/barmenski/ir-station-hw/raw/main/assets/profile_pb+.jpg" alt="pb+" height="300">

<img src="https://github.com/barmenski/ir-station-hw/raw/main/assets/profile_pb-.jpg" alt="pb-" height="300">

- To heat according to the thermal profile, you need to select the item "Profil":

![menu-profile](https://github.com/barmenski/ir-station-hw/raw/main/assets/menu_profile.png)

![profile-work](https://github.com/barmenski/ir-station-hw/raw/main/assets/profile_work.gif)

- To heat and maintain the desired temperature, you must select the item "Const":

![menu-const](https://github.com/barmenski/ir-station-hw/raw/main/assets/menu_const.png)
![const-work](https://github.com/barmenski/ir-station-hw/raw/main/assets/const_work.gif)
![const-video](https://github.com/barmenski/ir-station-hw/raw/main/assets/const_video.gif)

- The application starts a simple server that receives data via `web-sockets` and draws graphs in `<canvas>`. The application connects to the network with its static IP 192.168.0.100:8080.

## TODO
- [ ] The ability to connect to a hotspot on phone