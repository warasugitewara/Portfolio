import sys
from fontTools import subset
from fontTools.ttLib import TTFont

NF = [
    "F001", "F028", "F130", "F132", "F023", "F0AC", "F233", "F1C0", "F080", "F03D",
    "F02D", "F0C3", "F0C7", "F09E", "F11B", "F0A0", "F187", "F21E", "F306", "F17C",
    "F30C", "F308", "F0E7", "F013", "F085", "F02B",
    "F0C2", "F0E8", "F018", "F021", "F0EA", "F108",
    "F185", "F186", "F041",
]
LATIN = [
    "U+0020-007E", "U+00A0-00FF", "U+00B7", "U+00D7",
    "U+2013-2014", "U+2018-201D", "U+2022", "U+2026", "U+2190-2193",
    "U+21C4", "U+2500-2503", "U+25A0-25A1", "U+25B2", "U+25B6", "U+25B8", "U+25BC", "U+2713", "U+2717",
]

FAMILY = "Waras Console"


def build(src, out, style, weight):
    unicodes = ",".join(LATIN + ["U+" + h for h in NF])
    args = [
        src,
        f"--unicodes={unicodes}",
        "--layout-features=kern,liga,calt",
        "--flavor=woff2",
        "--no-hinting",
        "--desubroutinize",
        f"--output-file={out}",
    ]
    subset.main(args)

    font = TTFont(out)
    name = font["name"]
    full = f"{FAMILY} {style}" if style != "Regular" else FAMILY
    ps = full.replace(" ", "")
    for nid, value in ((1, FAMILY), (2, style), (3, f"{full};subset of HackGen Console NF"), (4, full), (6, ps), (16, FAMILY), (17, style)):
        for rec in list(name.names):
            if rec.nameID == nid:
                name.setName(value, nid, rec.platformID, rec.platEncID, rec.langID)
    name.setName(
        "Subset of HackGen Console NF (Copyright 2019 Yuko OTAWARA), SIL Open Font License 1.1. "
        "Renamed because HackGen is a Reserved Font Name.",
        10, 3, 1, 0x409,
    )
    font["OS/2"].usWeightClass = weight
    font.save(out)
    print(out, "glyphs:", len(font.getGlyphOrder()))


base = "hackgen/HackGen_NF_v2.10.0/HackGenConsoleNF-"
build(base + "Regular.ttf", "waras-console-regular.woff2", "Regular", 400)
build(base + "Bold.ttf", "waras-console-bold.woff2", "Bold", 700)
