from models.market import Market
from threading import Lock

class MarketDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection
        self.lock = Lock()

    def get_market_data(self, crop_name):
        """
        Fetches market data for the given crop_name from the database
        :param crop_name: the name of the crop
        :return: The market object with the given crop_name, if not found return None
        """
        with self.lock:
            cursor = self.db_connection.get_cursor()
            cursor.execute("SELECT * FROM market WHERE crop_name = %s", (crop_name,))
            result = cursor.fetchone()
            if result:
                return Market(result['crop_name'], result['current_price'], result['current_quantity_crop'], result['prev_quantity_crop'], result['last_update'])
            else:
                return None

    def add_market_data(self, market):
        """
        Adds the given market data to the database or updates existing entry
        :param market: A Market object
        :return: True if the market data was added or updated successfully, False otherwise
        """
        with self.lock:
            cursor = self.db_connection.get_cursor()
            cursor.execute("SELECT * FROM market WHERE crop_name = %s", (market.crop_name,))
            existing_market = cursor.fetchone()
            if existing_market:
                # Update the existing market entry
                cursor.execute("""
                    UPDATE market
                    SET current_price = %s, current_quantity_crop = %s, prev_quantity_crop = %s, last_update = %s
                    WHERE crop_name = %s;
                """, (market.current_price, market.current_quantity_crop, market.prev_quantity_crop, market.last_update, market.crop_name))
            else:
                # Insert a new market entry
                cursor.execute("""
                    INSERT INTO market (crop_name, current_price, current_quantity_crop, prev_quantity_crop, last_update)
                    VALUES (%s, %s, %s, %s, %s);
                """, (market.crop_name, market.current_price, market.current_quantity_crop, market.prev_quantity_crop, market.last_update))
            self.db_connection.conn.commit()
            return True
