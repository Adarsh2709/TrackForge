from PIL import Image

temp_path = r'd:\TrackForge\temp_logo.png'
navbar_logo_path = r'd:\TrackForge\frontend\public\assets\trackforge_logo.png'
favicon_path = r'd:\TrackForge\frontend\src\app\icon.png'

try:
    img = Image.open(temp_path).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        # 1. Tightly crop the full logo
        full_logo = img.crop(bbox)
        full_logo.save(navbar_logo_path)
        print("Saved full logo for navbar.")
        
        # 2. Extract the square icon (left side) for the favicon
        width, height = full_logo.size
        # The icon should be a square, so we take the left `height` pixels
        # We add a tiny bit of padding to the height to ensure we don't cut off the hexagon
        square_size = height
        # Ensure we don't go out of bounds
        if square_size > width:
            square_size = width
            
        icon = full_logo.crop((0, 0, square_size, height))
        icon.save(favicon_path)
        print("Saved square icon for favicon.")
    else:
        print("Image is entirely transparent.")
except Exception as e:
    print(f"Error: {e}")
