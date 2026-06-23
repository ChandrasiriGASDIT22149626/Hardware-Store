import os
from PIL import Image

def main():
    img_path = r'public/images/logo.png'
    build_dir = 'build'
    ico_path = os.path.join(build_dir, 'icon.ico')

    if not os.path.exists(build_dir):
        os.makedirs(build_dir)

    if not os.path.exists(img_path):
        print(f"Error: {img_path} does not exist.")
        return

    print(f"Opening {img_path}...")
    img = Image.open(img_path)
    
    # Save as ICO with multiple standard sizes
    # Windows icon sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    img.save(ico_path, format='ICO', sizes=sizes)
    print(f"Successfully saved icon to {ico_path}!")

if __name__ == '__main__':
    main()
