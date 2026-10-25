"""Build Shopify rich text and a review index from the authored collection Markdown."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content' / 'collections'
EXCLUDED = {
    'frontpage': 'Internal homepage merchandising collection.',
    'merken': 'Unused empty collection; /pages/merken is the brands directory.',
    'kinderen': 'Held for merchandising review: rules match Unisex adult items and a marketing pallet, not a verified children’s range.',
}


def inline(text, valid_handles, own_handle):
    children, markup, last = [], [], 0
    for match in re.finditer(r'\[([^\]]+)\]\(([^)]+)\)', text):
        before, label, url = text[last:match.start()], match[1], match[2]
        if before:
            children.append({'type': 'text', 'value': before})
            markup.append(html.escape(before))
        assert url.startswith('/collections/'), f'Non-relative collection link: {url}'
        handle = url.removeprefix('/collections/')
        assert handle in valid_handles and handle not in EXCLUDED, f'Unknown/excluded destination: {url}'
        assert handle != own_handle, f'Self-link in {own_handle}'
        children.append({'type': 'link', 'url': url, 'children': [{'type': 'text', 'value': label}]})
        markup.append(f'<a href="{html.escape(url, quote=True)}">{html.escape(label)}</a>')
        last = match.end()
    if text[last:]:
        children.append({'type': 'text', 'value': text[last:]})
        markup.append(html.escape(text[last:]))
    return children, ''.join(markup)


def main():
    inventory = json.loads((CONTENT / 'shopify-before-2026-10-25.json').read_text(encoding='utf-8'))
    handles = {c['handle'] for c in inventory['collections']}
    entries = []
    for block in re.split(r'(?m)^# ', (CONTENT / 'bottom-descriptions.md').read_text(encoding='utf-8')):
        if not block.strip():
            continue
        lines = block.strip().splitlines()
        handle, title = lines.pop(0).split(' | ', 1)
        assert handle in handles and handle not in EXCLUDED, handle
        assert lines[0].startswith('Sources: ') and lines[1].startswith('Basis: '), handle
        sources = [s.strip() for s in lines.pop(0).removeprefix('Sources: ').split(',')]
        sources = [] if sources == ['none'] else sources
        basis = lines.pop(0).removeprefix('Basis: ')
        source_records = []
        for source in sources:
            record = json.loads((CONTENT / 'legacy' / f'{source}.json').read_text(encoding='utf-8'))
            assert record['status'] == 200 and record['blocks'], f'Unavailable source: {source}'
            source_records.append({'file': f'legacy/{source}.md', 'url': record['sourceUrl'], 'capturedAt': record['capturedAt']})
        children, markup, word_text, links = [], [], [], []
        for paragraph in re.split(r'\n\s*\n', '\n'.join(lines).strip()):
            heading = paragraph.startswith('## ')
            value = ' '.join(paragraph.removeprefix('## ').splitlines())
            nodes, rendered = inline(value, handles, handle)
            node = {'type': 'heading' if heading else 'paragraph', 'children': nodes}
            if heading:
                node['level'] = 2
            children.append(node)
            tag = 'h2' if heading else 'p'
            markup.append(f'<{tag}>{rendered}</{tag}>')
            word_text.append(re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', value))
            links.extend(n['url'] for n in nodes if n['type'] == 'link')
        assert children and children[0]['type'] == 'heading', handle
        assert len(links) >= 2, f'Insufficient navigation: {handle}'
        entries.append({'handle': handle, 'title': title, 'basis': basis, 'sources': source_records, 'wordCount': len(' '.join(word_text).split()), 'internalLinks': sorted(set(links)), 'html': '\n'.join(markup), 'richText': {'type': 'root', 'children': children}})
    written = [entry['handle'] for entry in entries]
    assert len(written) == len(set(written)), 'Duplicate collection copy'
    assert set(written) == handles - set(EXCLUDED), f'Missing collections: {handles - set(EXCLUDED) - set(written)}'
    output = {'authoredDate': '2026-10-25', 'language': 'nl', 'namespace': 'custom', 'key': 'bottom_description', 'type': 'rich_text_field', 'excludedCollections': EXCLUDED, 'collections': entries}
    (CONTENT / 'bottom-descriptions.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    index = ['# Collection copy index', '', 'Authored copy: [bottom-descriptions.md](bottom-descriptions.md). Original wording: [legacy/](legacy/). This is a source map, not evidence that historical claims are correct.', '', '| Collection | Words | Basis | Legacy references |', '|---|---:|---|---|']
    for entry in entries:
        refs = ', '.join(f"[{s['file'].split('/')[-1]}]({s['file']})" for s in entry['sources']) or 'New copy; existing Shopify context'
        index.append(f"| {entry['title']} (`{entry['handle']}`) | {entry['wordCount']} | {entry['basis']} | {refs} |")
    index.extend(['', '## Deliberately unfilled', ''] + [f'- `{handle}`: {reason}' for handle, reason in EXCLUDED.items()])
    (CONTENT / 'INDEX.md').write_text('\n'.join(index) + '\n', encoding='utf-8')
    print(f"Built {len(entries)} descriptions; {sum(len(e['internalLinks']) for e in entries)} per-collection internal destinations; {min(e['wordCount'] for e in entries)}–{max(e['wordCount'] for e in entries)} words.")


if __name__ == '__main__':
    main()
