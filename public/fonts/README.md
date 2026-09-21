# Fonts

Self-hosted so the site never depends on a font CDN.

| File | Used for | Source |
|---|---|---|
| `waras-console-regular.woff2` / `-bold.woff2` | numbers, vmids, node names, icons | **subset of HackGen Console NF v2.10.0** |
| `ibm-plex-sans-latin-wght-normal.woff2` | prose and headings (latin) | IBM Plex Sans Variable 5.3.0, unmodified |

Japanese text is intentionally **not** bundled: it falls back to the system stack
(Hiragino Kaku Gothic ProN → Yu Gothic → Noto Sans JP), which keeps the payload
around 60KB instead of several megabytes.

## Why "Waras Console" and not "HackGen"

HackGen is licensed under the SIL Open Font License 1.1 **with the Reserved Font
Names "白源" and "HackGen"**. Subsetting produces a Modified Version, and the OFL
forbids a Modified Version from carrying a Reserved Font Name — so the subset is
renamed. It is otherwise unchanged, and the original copyright notice travels
with it inside the font and in `LICENSE-HackGen.txt`.

Original: <https://github.com/yuru7/HackGen> — Copyright 2019 Yuko OTAWARA.

## Regenerating the subset

`subset-waras-console.py` is the exact script used. It keeps latin, the
punctuation the UI needs, and the specific Nerd Font glyphs the site draws.

```bash
# from a directory holding HackGen_NF_v2.10.0/
uv run --with fonttools --with brotli python subset-waras-console.py
```

**Adding an icon means re-running this**: a glyph that is not in the subset
renders as a blank box. The codepoints live in the `NF` list at the top of the
script and must stay in sync with `src/utils/infraIcons.ts`.
