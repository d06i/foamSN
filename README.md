# Foam Graph
 A lightweight and real-time system monitoring (CPU, RAM, Disks) web application built with [Actix.rs](https://actix.rs) and [React](https://react.dev/).
 - Extremely lightweight - typically uses only 5-10 MB of memory.
 - Login is required to access the dashboard. User credentials are defined in .env file and can be customized.
````
 The default login is:
 - Username: admin
 - Password: foam1234
````
 -  Currently only CPU, RAM and disks metrics are available. Others metrics may be added soon 🙄

## Screenshots
![tt](https://github.com/user-attachments/assets/7dd01ffb-d1a9-44b2-95f3-9b48cf3e21bf)
![login](https://github.com/user-attachments/assets/83844dea-604a-4bfd-b4e5-8d6abde04d5f)
![ram](https://github.com/user-attachments/assets/b848bb42-c70a-42c4-b84d-7d4c5b355d44)![cpu](https://github.com/user-attachments/assets/86b815e8-d85d-443e-9850-84983626d673) 
![disk](https://github.com/user-attachments/assets/39b9d531-4fb0-4a5c-8892-beb9fa8f9095)

## Usage
Install for Linux
````
git clone https://github.com/d06i/foam_graph.git && cd foam_graph && chmod +x && ./build.sh
````
or Windows
````
git clone https://github.com/d06i/foam_graph.git && cd foam_graph && build.bat
````

## Credits
- [Apache ECharts](https://echarts.apache.org)
- [GuillaumeGomez/sysinfo](https://github.com/GuillaumeGomez/sysinfo)
- [PicoCSS](https://github.com/picocss/pico)
