import pathlib
root = pathlib.Path(__file__).parent
src = root / 'src'
shell = (src / 'shell.html').read_text(encoding='utf8')
css = (src / 'app.css').read_text(encoding='utf8')
data = '\n'.join((src / f).read_text(encoding='utf8') for f in ['d-maths.js', 'd-science.js', 'd-english.js', 'd-humanities.js', 'd-german.js'])
app = (src / 'app.js').read_text(encoding='utf8')
frag = shell.replace('/*CSS*/', css).replace('/*DATA*/', data).replace('/*APP*/', app)
dist = root / 'dist'; dist.mkdir(exist_ok=True)
(dist / 'gcse-plan.html').write_text(frag, encoding='utf8')
full = '<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + frag.replace('<header', '</head>\n<body>\n<header', 1) + '\n</body>\n</html>\n'
(dist / 'index.html').write_text(full, encoding='utf8')
# GitHub Pages copy (served from /docs) with home-screen icon + manifest
head_links = ('<link rel="manifest" href="manifest.webmanifest">\n'
              '<link rel="apple-touch-icon" href="icon-180.png">\n'
              '<link rel="icon" type="image/png" href="icon-192.png">\n')
pages = full.replace('<meta name="theme-color"', head_links + '<meta name="theme-color"', 1)
(root / 'docs').mkdir(exist_ok=True)
(root / 'docs' / 'index.html').write_text(pages, encoding='utf8')
print('built', len(frag) // 1024, 'KB')
