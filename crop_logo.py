from PIL import Image

# Open the image
img_path = r'd:\TrackForge\frontend\public\assets\trackforge_logo.png'
img = Image.open(img_path)

# Convert to RGBA if not already
img = img.convert("RGBA")

# Get the bounding box of non-transparent pixels
bbox = img.getbbox()

if bbox:
    # Crop to the bounding box
    img_cropped = img.crop(bbox)
    
    # Make it a square
    width, height = img_cropped.size
    max_dim = max(width, height)
    
    # Create a new transparent square image
    square_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    
    # Calculate padding to center it
    x_offset = (max_dim - width) // 2
    y_offset = (max_dim - height) // 2
    
    # Paste the cropped image into the center
    square_img.paste(img_cropped, (x_offset, y_offset))
    
    # Save the new square image
    square_img.save(img_path)
    
    # Also save as icon.png
    icon_path = r'd:\TrackForge\frontend\src\app\icon.png'
    square_img.save(icon_path)
    print("Successfully cropped and squared the logo!")
else:
    print("Image is completely transparent!")
