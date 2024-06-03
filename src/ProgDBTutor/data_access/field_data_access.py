from models.field import Field
from datetime import datetime

class FieldDataAccess:
    def __init__(self, db_connection):
        self.db_connection = db_connection

    def get_field(self, building_name, username_owner):
        """
        Fetches the field with the given building_name and username_owner from the database.
        :param building_name: The name of the building (primary key).
        :param username_owner: The username of the owner (primary key).
        :return: The Field object with the given building_name and username_owner, if not found return None.
        """
        cursor = self.db_connection.get_cursor()
        try:
            cursor.execute("SELECT * FROM fields WHERE building_name = %s AND username_owner = %s", (building_name, username_owner))
            result = cursor.fetchone()
            if result:
                return Field(
                    building_name=result['building_name'],
                    username_owner=result['username_owner'],
                    crop=result['crop'],
                    phase=result['phase'],
                    asset_phase=result['asset_phase'],
                    time_planted=result['time_planted']
                )
            else:
                return None
        except Exception as e:
            print("Error:", e)
            return None
        finally:
            cursor.close()

    def get_fields_by_username_owner(self, username_owner):
        """
        Fetches all fields belonging to the given username_owner from the database.
        :param username_owner: The username of the owner.
        :return: A list of Field objects belonging to the given username_owner, an empty list if none found.
        """
        cursor = self.db_connection.get_cursor()
        try:
            cursor.execute("SELECT * FROM fields WHERE username_owner = %s", (username_owner,))
            results = cursor.fetchall()

            fields = []
            for result in results:
                field = Field(
                    building_name=result['building_name'],
                    username_owner=result['username_owner'],
                    crop=result['crop'],
                    phase=result['phase'],
                    asset_phase=result['asset_phase'],
                    time_planted=result['time_planted']
                )
                fields.append(field)

            return fields
        except Exception as e:
            print("Error:", e)
            return []
        finally:
            cursor.close()

    def add_or_update_field(self, field):
        """
        Adds or updates the given field object in the database.
        :param field: A Field object.
        :return: True if the field was added/updated successfully, False otherwise.
        """
        cursor = self.db_connection.get_cursor()
        try:
            # Check if the field already exists for the given building_name and username_owner
            cursor.execute("SELECT * FROM fields WHERE building_name = %s AND username_owner = %s", (field.building_name, field.username_owner))
            existing_field = cursor.fetchone()
            if existing_field:
                # Update the existing field entry
                cursor.execute("""
                    UPDATE fields
                    SET crop = %s, phase = %s, asset_phase = %s, time_planted = %s
                    WHERE building_name = %s AND username_owner = %s;
                """, (field.crop, field.phase, field.asset_phase, field.time_planted, field.building_name, field.username_owner))
            else:
                # Insert a new field entry
                cursor.execute("""
                    INSERT INTO fields (building_name, username_owner, crop, phase, asset_phase, time_planted)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (building_name, username_owner) DO UPDATE
                    SET crop = EXCLUDED.crop, phase = EXCLUDED.phase, asset_phase = EXCLUDED.asset_phase, time_planted = EXCLUDED.time_planted;
                """, (field.building_name, field.username_owner, field.crop, field.phase, field.asset_phase, field.time_planted))
            self.db_connection.conn.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.db_connection.conn.rollback()  # Rollback in case of error
            return False
        finally:
            cursor.close()  # Ensure the cursor is closed
