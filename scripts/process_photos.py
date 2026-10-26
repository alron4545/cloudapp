#!/usr/bin/env python3
"""Make web-ready copies of the photos in photos-src/.

Every folder under photos-src/ that contains images becomes an album. For each
image this writes two files to public/photos/<album>/:

  <name>.jpg        full photo (long edge capped at FULL_MAX) used for downloads
  <name>-thumb.jpg  small version shown in the gallery grid

The copies are re-encoded without EXIF data, so GPS location, camera details
and other metadata in the originals are NOT published. The color profile is
kept so colors look the same.

It also writes src/data/photos.json, which the Photos page reads. Captions you
type into photos.json are kept when the script runs again.

Usage (from the project root):
    python3 scripts/process_photos.py

Requires Pillow:  python3 -m pip install Pillow
"""

import json
import re
import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-src"
OUT = ROOT / "public" / "photos"
MANIFEST = ROOT / "src" / "data" / "photos.json"

FULL_MAX = 2560
THUMB_MAX = 900
QUALITY = 82
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
DATE_TAG = 36867  # EXIF DateTimeOriginal
EXIF_IFD = 0x8769


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def display_name(folder_name):
    # Finder shows "/" in a folder name, but it is stored on disk as ":".
    return folder_name.replace(":", "/")


def taken_date(im):
    try:
        exif = im.getexif()
        raw = exif.get_ifd(EXIF_IFD).get(DATE_TAG) or exif.get(DATE_TAG)
        return datetime.strptime(raw, "%Y:%m:%d %H:%M:%S").date().isoformat()
    except (TypeError, ValueError):
        return None


def save_resized(im, path, max_edge, icc):
    copy = im.copy()
    copy.thumbnail((max_edge, max_edge), Image.LANCZOS)
    # No exif= argument: the saved file carries no EXIF/GPS metadata.
    copy.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True, icc_profile=icc)
    return copy.size


def load_captions():
    if not MANIFEST.exists():
        return {}
    data = json.loads(MANIFEST.read_text())
    return {
        photo["src"]: photo.get("caption", "")
        for album in data.get("albums", [])
        for photo in album["photos"]
    }


def main():
    if not SRC.exists():
        raise SystemExit(f"No {SRC.relative_to(ROOT)}/ folder found.")

    captions = load_captions()

    # Start clean so deleted or renamed originals do not leave stale copies.
    for child in OUT.iterdir() if OUT.exists() else []:
        if child.is_dir():
            shutil.rmtree(child)
    OUT.mkdir(parents=True, exist_ok=True)

    albums = []
    folders = sorted({p.parent for p in SRC.rglob("*") if p.suffix.lower() in IMAGE_EXTS})

    for folder in folders:
        rel_parts = folder.relative_to(SRC).parts
        album_slug = "/".join(slugify(part) for part in rel_parts) or "photos"
        album_out = OUT / album_slug
        album_out.mkdir(parents=True, exist_ok=True)

        photos = []
        for src in sorted(folder.iterdir()):
            if src.suffix.lower() not in IMAGE_EXTS:
                continue

            with Image.open(src) as original:
                taken = taken_date(original)
                icc = original.info.get("icc_profile")
                im = ImageOps.exif_transpose(original).convert("RGB")

            stem = slugify(src.stem)
            width, height = save_resized(im, album_out / f"{stem}.jpg", FULL_MAX, icc)
            save_resized(im, album_out / f"{stem}-thumb.jpg", THUMB_MAX, icc)

            web_src = f"/photos/{album_slug}/{stem}.jpg"
            photos.append(
                {
                    "src": web_src,
                    "thumb": f"/photos/{album_slug}/{stem}-thumb.jpg",
                    "file": f"{src.stem}.jpg",
                    "width": width,
                    "height": height,
                    "taken": taken,
                    "caption": captions.get(web_src, ""),
                }
            )
            print(f"  {src.relative_to(SRC)} -> {web_src}")

        photos.sort(key=lambda p: (p["taken"] or "", p["file"]))
        albums.append(
            {
                "id": album_slug.replace("/", "-"),
                "group": " / ".join(display_name(p) for p in rel_parts[:-1]),
                "name": display_name(rel_parts[-1]) if rel_parts else "Photos",
                "photos": photos,
            }
        )

    MANIFEST.write_text(json.dumps({"albums": albums}, indent=2) + "\n")
    total = sum(len(a["photos"]) for a in albums)
    print(f"Wrote {total} photos in {len(albums)} album(s) to {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
