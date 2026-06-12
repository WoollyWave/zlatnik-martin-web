#!/usr/bin/env python3
"""Porovná HTML výstup dvou dist adresářů (whitespace-normalizovaně).

Použití: python3 scripts/diff-dist.py /tmp/dist-baseline dist [--page cesta]
Normalizace: sjednocení bílých znaků (HTML-safe — žádné <pre> na webu není).
Hashe assetů (_astro/*) se NEnormalizují — při shodném obsahu musí být shodné.
"""
import html as html_mod
import re
import sys
from pathlib import Path

def normalize(html: str) -> str:
    # HTML entity → znak ( &#39; vs ' — Astro escapuje výrazy, literály ne; render je shodný).
    # Unescape až PO odstranění tagů by bylo bezpečnější, ale entity v atributech
    # tady nehrozí kolizí (žádné < > v textech) — plošný unescape stačí.
    html = html_mod.unescape(html)
    # HTML komentáře se nerenderují — šablony nesou jednu (CS) sadu komentářů pro oba jazyky.
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    # CSP hash pořadí se může lišit při shodném obsahu skriptů — seřadit uvnitř meta
    def sort_csp(m):
        return 'content="' + ';'.join(sorted(m.group(1).split(';'))) + '"'
    html = re.sub(r'content="([^"]*script-src[^"]*)"', sort_csp, html, count=1)
    html = re.sub(r'\s+', ' ', html).strip()
    # Okrajové mezery textu hned za otevíracím / před zavíracím tagem nerenderují
    # (JSX výrazy je neemitují, literály ano). POZOR: maskuje to i mezery u inline
    # tagů (<em>) — mezislovní mezery uvnitř textů zůstávají kontrolované.
    html = re.sub(r'> ', '>', html)
    html = re.sub(r' <', '<', html)
    return html

def main():
    base_dir, new_dir = Path(sys.argv[1]), Path(sys.argv[2])
    only = sys.argv[4] if len(sys.argv) > 4 and sys.argv[3] == '--page' else None

    base_files = {p.relative_to(base_dir) for p in base_dir.rglob('*.html')}
    new_files = {p.relative_to(new_dir) for p in new_dir.rglob('*.html')}

    missing, added = base_files - new_files, new_files - base_files
    for f in sorted(missing): print(f'CHYBÍ v novém: {f}')
    for f in sorted(added):   print(f'NAVÍC v novém: {f}')

    diff_count = 0
    for f in sorted(base_files & new_files):
        if only and only not in str(f):
            continue
        a = normalize((base_dir / f).read_text())
        b = normalize((new_dir / f).read_text())
        if a != b:
            diff_count += 1
            # najdi první rozdíl pro kontext
            for i in range(min(len(a), len(b))):
                if a[i] != b[i]:
                    print(f'DIFF {f}\n  baseline: …{a[max(0,i-60):i+120]}…\n  nový:     …{b[max(0,i-60):i+120]}…')
                    break
            else:
                print(f'DIFF {f} (různá délka: {len(a)} vs {len(b)})')

    if not missing and not added and diff_count == 0:
        print('✓ IDENTICKÉ — žádný rozdíl v HTML výstupu')
        sys.exit(0)
    print(f'\n{len(missing)} chybí, {len(added)} navíc, {diff_count} odlišných')
    sys.exit(1)

if __name__ == '__main__':
    main()
