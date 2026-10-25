"""Capture legacy editorial blocks, not product grids or shopper/session data."""
import json
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'content' / 'collections' / 'legacy'
PATHS = [
    'fitflop', 'merken/fitflop', 'fitflop-slippers', 'fitflop-sandalen',
    'fitflop-sneakers', 'fitflop-enkellaarzen', 'fitflop-ballerinas',
    'fitflop-dames', 'fitflop-heren', 'fitflop-outlet', 'fitflop-pantoffels',
    'fitflop-slides', 'over-fitflop', 'hi-tec', 'holster-australi',
    'holster-australia', 'juicy-couture-all', 'loewenweiss', 'odlo',
    'odlo-all', 'over-odlo', 'odlo-running', 'odlo-cycling', 'odlo-outdoor',
    'odlo-underwear', 'odlo-accessories', 'sweaty-betty', 'sweaty-betty-legging',
    'sweaty-betty-swimwear', 'sneakerlab', 'juicy-couture-pants',
    'juicy-couture-hoodies', 'juicy-couture-tops-t-shirts', 'juicy-couture-shorts',
]


def readable(block):
    lines = []
    for node in block.select('h1,h2,h3,h4,h5,h6,p,li'):
        if node.name == 'p' and node.find_parent('li'):
            continue
        text = node.get_text(' ', strip=True)
        if text:
            prefix = '#' * int(node.name[1]) + ' ' if node.name.startswith('h') else '- ' if node.name == 'li' else ''
            lines.append(prefix + text)
    return '\n\n'.join(lines) or block.get_text('\n', strip=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.headers['User-Agent'] = 'Mozilla/5.0 (Original Brands content migration)'
    for index, path in enumerate(PATHS):
        target = OUT / (path.replace('/', '--') + '.json')
        if target.exists():
            previous = json.loads(target.read_text(encoding='utf-8'))
            if previous.get('extractionVersion') == 2:
                continue
        if index:
            time.sleep(3)
        url = 'https://www.originalbrands.nl/nl/' + path
        response = session.get(url, timeout=35)
        record = {'sourceUrl': url, 'finalUrl': response.url, 'capturedAt': datetime.now(timezone.utc).isoformat(), 'status': response.status_code, 'extractionVersion': 2}
        if response.status_code == 429:
            print('STOP: legacy site rate limit; no automatic retries.', flush=True)
            break
        soup = BeautifulSoup(response.content.decode('utf-8'), 'html.parser')
        record['title'] = soup.title.get_text(strip=True) if soup.title else ''
        record['h1'] = [h.get_text(' ', strip=True) for h in soup.select('h1')]
        blocks = soup.select('.content__body, .text__body')
        if not blocks:
            blocks = soup.select('.field--name-body, .field--name-field-description, .view-footer')
        blocks = [b for b in blocks if not any(p in blocks for p in b.parents)]
        record['blocks'] = [{'html': str(b), 'text': readable(b), 'links': [{'text': a.get_text(' ', strip=True), 'href': a.get('href')} for a in b.select('a[href]')]} for b in blocks if b.get_text(strip=True)]
        if response.status_code == 200 and not record['blocks']:
            record['note'] = 'No matching editorial blocks; not evidence that this page has no copy.'
        target.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        md = f"# Legacy reference: {path}\n\nSource: {url}\n\nCaptured: {record['capturedAt']}\n\nHTTP status: {response.status_code}\n\nHistorical wording only; claims and links are not approved storefront copy.\n\n"
        md += '\n\n---\n\n'.join(block['text'] for block in record['blocks'])
        target.with_suffix('.md').write_text(md.rstrip() + '\n', encoding='utf-8')
        print(f"{path}: {response.status_code}, {len(record['blocks'])} blocks, {sum(len(b['text']) for b in record['blocks'])} characters", flush=True)


if __name__ == '__main__':
    main()
