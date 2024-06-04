# Web-based Idle Game: [FarmClash](https://team3.ua-ppdb.me)

## Overview
This project is developed as part of the Programming Project Databases course at the University of Antwerp. It's a web-based idle game where players manage cities, gather resources, and interact in a multiplayer environment.

## Features
- Login system with basic security measures.
- Map view with settlements positioned for player interactions.
- Multiplayer interactions including alliances and chatting.
- Background updates for idle gameplay, including resource accumulation and action cooldowns.
- User-friendly and intuitive web interface using bootsrap.

## Technologies Used
- Flask for the webserver.
- PostgreSQL for the database.
- Raw JavaScipt for the front-end.

## Getting Started
### Prerequisites
List of necessary installations and their setup.
- Python 3
- PostgreSQL
- The cloned repository
```bash
git clone https://github.com/SiBMs58/FarmClash.git
```

### Installation
Step-by-step guide to get a development environment running.
#### 1. Initialize the database
* The app uses a PostgreSQL database. Create a new database called `dbtutor`with `app` user as the owner. This could be a different db or user which can be changed in the [config](src/ProgDBTutor/config.py).
* Run the following command to initialize the database (make sure you are in the root directory of the project):
```bash
psql dbtutor -U app -f sql/schema.sql
```
This will initialize the database with the necessary tables and data.
#### 2. Setup and activate virtual env
```bash
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
```
This will create, and activate a virtual environment and install the necessary packages.
#### 3. Run the app
```bash
cd src/ProgDBTutor
python3 app.py
```
This will start the Flask server on `localhost:5000` or at the IPs given by flask.

#### Optional info: Compile LaTeX
```bash
cd docs
pdflatex technical-report.tex  # First compilation
pdflatex technical-report.tex  # Second compilation to update the TOC
rm technical-report.aux
rm technical-report.log
rm technical-report.out
# Optionally, keep technical-report.toc for future compilations unless you need to remove it for specific reasons
```

## Usage
How to use the game, including login and gameplay examples.

## Contributing
Guidelines for how others can contribute to the project.

## License
Specify the license under which the project is released.

## Additional Documentation
- [Technical Report](docs/technical-report.pdf)
- [API Documentation](docs/api.pdf)
- [Manual-test-documentation.pdf](docs/Manual-test-documentation-main-game.pdf)

## Contact
- Project Supervisor: Prof. Bart Goethals, Joey De Pauw and Marco Favier
- Scrum Master: Annick De Bruyn
- Team Members: [Camille De Vuyst](link-to-your-github), [Joren Van der Sande](link-to-your-github), [Thomas De Volder](link-to-your-github), [Faisal Ettarrahi](link-to-your-github), [Ferhat Van Herck](link-to-your-github), [Siebe Mees](https://github.com/SiBMs58)

