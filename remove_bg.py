from rembg import remove
from PIL import Image

input_path = r'C:\Users\ADARSH\.gemini\antigravity-ide\brain\0f978952-5cb4-42c1-98f5-ffd82d95864a\media__1780923988338.png'
output_path = r'd:\TrackForge\temp_logo.png'

print("Opening image...")
input = Image.open(input_path)
print("Removing background...")
output = remove(input)
print("Saving image...")
output.save(output_path)
print("Done!")
