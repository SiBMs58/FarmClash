# FarmClash
Web-based Idle Game, mixing Clash of Clans and Hay Day. For the course "Programming Project Databases"

## Run instructions (Local)
1. (Optionally) reload, initialize the database
   1. Reload
      1. Using pg_ctl (from the command line):
      ```bash
      pg_ctl reload -D /path/to/data/directory
      ```
      2. Using SQL command (from within a SQL client like psql):
      ```sql
      SELECT pg_reload_conf();
      ```
   2. Initialize:
   ```bash
   psql dbtutor -U app -f sql/schema.sql
   ```
         
2. Setup and activate virtual env
```bash
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
```

3. Run development server
```bash
cd src/ProgDBTutor
python app.py
```