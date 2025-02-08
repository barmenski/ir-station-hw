# Make daemon of buttons handler
Copy /services/buttons_handler.service to /etc/systemd/system/buttons_handler.service

Edit daemon (for changing path, etc.):
`nano /etc/systemd/system/buttons_handler.service`
Make autolaunch for daemon:
`systemctl enable buttons_handler`
Start daemon now:
`systemctl start buttons_handler`
Status daemon (must be "running"):
`systemctl status buttons_handler`
Do similar actions with the file **ir_station.service**