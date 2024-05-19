import os
import json


"""
This works for mac
"""

def get_folder_names(directory):
    """
    Get the names of all folders in the specified directory.

    Args:
    - directory (str): The directory path to search for folders.

    Returns:
    - folder_names (list): A list of folder names.
    """
    try:
        folder_names = [name for name in os.listdir(directory) if os.path.isdir(os.path.join(directory, name))]
    except PermissionError:
        folder_names = []
    return folder_names


def get_asset_names():
    """
    Get the names of all assets in the current directory.
    This looks for depth 2 so game assets should be in ./[Type]/[Asset] to be read

    Returns:
    - dictionary of asset .pngs with the key being the folder
    """
    # Get the current directory
    current_dir = os.getcwd()

    # Dictionary to store folder names and their PNG file names
    folders_and_png_files = {}

    # Get the names of all folders in the current directory
    folder_names = get_folder_names(current_dir)

    # Iterate over each folder
    for folder in folder_names:
        # Dictionary to store subfolder names and their PNG file names
        subfolders_and_png_files = {}

        # Get the path of the current folder
        folder_path = os.path.join(current_dir, folder)

        # Iterate over all subfolders in the current folder
        for subfolder in get_folder_names(folder_path):
            # List to store PNG file names
            png_files = []

            # Get the path of the current subfolder
            subfolder_path = os.path.join(folder_path, subfolder)

            # Check for PNG files directly within the subfolder
            if os.path.isdir(subfolder_path):
                for file in os.listdir(subfolder_path):
                    if file.endswith('.png'):
                        png_files.append(os.path.splitext(file)[0])  # Remove extension

                # Add the subfolder name and its PNG file names to the dictionary
                subfolders_and_png_files[subfolder] = png_files

        # Add the folder name and its subfolder names with PNG file names to the main dictionary
        folders_and_png_files[folder] = subfolders_and_png_files

    return folders_and_png_files


def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)


if __name__ == '__main__':
    folders_and_png_files_dict = get_asset_names()
    save_to_json(folders_and_png_files_dict, 'assetList.json')
