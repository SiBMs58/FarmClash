import pytest
import requests

BASE_URL = "https://team3.ua-ppdb.me/api/"

# Test the Users endpoint
def test_get_users_admin_access():
    admin_token = 'your_admin_token_here'  # Admin JWT token
    headers = {'Authorization': f'Bearer {admin_token}'}
    response = requests.get(f"{BASE_URL}users", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Should return a list of users

# Test the Maps endpoint
def test_get_maps_admin_access():
    admin_token = 'your_admin_token_here'
    headers = {'Authorization': f'Bearer {admin_token}'}
    response = requests.get(f"{BASE_URL}maps", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Should return a list of maps

# Test the General Resources endpoint
def test_get_resources_admin():
    admin_token = 'your_admin_token_here'
    headers = {'Authorization': f'Bearer {admin_token}'}
    response = requests.get(f"{BASE_URL}resources", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Check if it returns a list of resources

# Test the Terrain Map endpoint for logged in users
def test_get_terrain_map_user_access():
    user_token = 'your_user_token_here'  # User JWT token
    headers = {'Authorization': f'Bearer {user_token}'}
    response = requests.get(f"{BASE_URL}terrain-map", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Should return a list of terrain maps

# Test the Friendships endpoint for current user
def test_get_friends_user_access():
    user_token = 'your_user_token_here'
    headers = {'Authorization': f'Bearer {user_token}'}
    response = requests.get(f"{BASE_URL}friends", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Should return a list of friends

# Test the Chat Messages endpoint for current user
def test_get_chat_messages_user_access():
    user_token = 'your_user_token_here'
    friend_name = 'friendUsername'  # Example friend username
    headers = {'Authorization': f'Bearer {user_token}'}
    response = requests.get(f"{BASE_URL}messages/{friend_name}", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Should return a list of messages

# Run the tests
if __name__ == "__main__":
    pytest.main()
