"""Draws the app icon (ink rounded square, white "27") and writes docs/icon-*.png + icon.ico (Windows shortcuts).
Run: py make_icons.py"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

root = pathlib.Path(__file__).parent
INK, PAPER = (24, 24, 27), (250, 250, 250)
FONT = r'C:\Windows\Fonts\segoeuib.ttf'

def draw(size, inset=0.0):
    """inset > 0 leaves a transparent margin (Windows icons); phone icons fill the square."""
    S = size * 4  # supersample, then shrink for smooth edges
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pad = int(S * inset)
    d.rounded_rectangle([pad, pad, S - pad - 1, S - pad - 1], radius=int((S - 2 * pad) * 0.22), fill=INK)
    font = ImageFont.truetype(FONT, int((S - 2 * pad) * 0.5))
    box = d.textbbox((0, 0), '27', font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    d.text(((S - w) / 2 - box[0], (S - h) / 2 - box[1]), '27', font=font, fill=PAPER)
    return im.resize((size, size), Image.Resampling.LANCZOS)

for n in (180, 192, 512):
    draw(n).convert('RGB').save(root / 'docs' / f'icon-{n}.png')
draw(256, inset=0.04).save(root / 'icon.ico', sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print('icons written')
