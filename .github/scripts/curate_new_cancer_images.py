from __future__ import annotations

import io
import pathlib
import time
import urllib.parse
import urllib.request

import cairosvg
from PIL import Image

ROOT = pathlib.Path.cwd()
OUTPUT = ROOT / "public/images/cancer-guides"
OUTPUT.mkdir(parents=True, exist_ok=True)

SOURCES = [
    ("Mesothelioma.PNG", "mesothelioma-pathology.webp", "photo"),
    ("Mitosis in a neuroendocrine tumor (original).jpg", "neuroendocrine-pathology.webp", "photo"),
    ("Gastrointestinal Stromal Tumor (GIST) of Stomach.jpg", "gist-pathology.webp", "photo"),
    ("Anatomy-human-appendix-in-colon.png", "appendix-anatomy.webp", "illustration"),
    ("Illu adrenal gland.jpg", "adrenal-anatomy.webp", "illustration"),
    ("Gray1037.png", "peritoneum-anatomy.webp", "illustration"),
    ("Uterus and nearby organs.jpg", "fallopian-tube-anatomy.webp", "illustration"),
    ("Metastasis illustration.jpg", "unknown-primary-metastasis.webp", "illustration"),
    ("Placenta.svg", "gestational-trophoblastic-anatomy.webp", "illustration"),
    ("Bone Marrow (NIH BioArt 56).svg", "mds-bone-marrow.webp", "illustration"),
    ("LMC-1.JPG", "mpn-pathology.webp", "photo"),
    ("Neuroblastoma (1).jpg", "neuroblastoma-pathology.webp", "photo"),
    ("Illu urinary system.svg", "urethra-anatomy.webp", "illustration"),
    ("Kidney and adrenal gland.jpg", "renal-pelvis-ureter-anatomy.webp", "illustration"),
    ("Illu quiz hn Ohne Text.JPG", "salivary-glands-anatomy.webp", "illustration"),
    ("Nose and nasal cavities.png", "nasal-sinus-anatomy.webp", "illustration"),
    ("Larynx and nearby structures.jpg", "larynx-dedicated-anatomy.webp", "illustration"),
    ("Illu thyroid parathyroid.jpg", "parathyroid-anatomy.webp", "illustration"),
]

HEADERS = {
    "User-Agent": "TuttiCancerWarriors/1.0 (medical image curation; https://tutticancerwarriors.org)"
}


def download(source_name: str) -> bytes:
    encoded = urllib.parse.quote(source_name, safe="")
    url = f"https://commons.wikimedia.org/wiki/Special:Redirect/file/{encoded}"
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(request, timeout=120) as response:
                data = response.read()
            if len(data) < 1000:
                raise RuntimeError(f"{source_name}: unexpectedly small download ({len(data)} bytes)")
            return data
        except Exception as error:
            last_error = error
            if attempt < 3:
                time.sleep(3 * (attempt + 1))
    raise RuntimeError(f"Could not download {source_name}: {last_error}")


def open_source(source_name: str, data: bytes) -> Image.Image:
    if source_name.lower().endswith(".svg") or b"<svg" in data[:5000].lower():
        data = cairosvg.svg2png(bytestring=data, output_width=1600)
    image = Image.open(io.BytesIO(data))
    image.load()
    if image.mode in {"RGBA", "LA"} or (image.mode == "P" and "transparency" in image.info):
        rgba = image.convert("RGBA")
        background = Image.new("RGBA", rgba.size, "white")
        background.alpha_composite(rgba)
        return background.convert("RGB")
    return image.convert("RGB")


for source_name, destination, presentation in SOURCES:
    image = open_source(source_name, download(source_name))
    image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    target = OUTPUT / destination
    image.save(target, "WEBP", quality=68 if presentation == "illustration" else 60, method=6)
    if target.stat().st_size < 1000:
        raise RuntimeError(f"{destination}: optimised file is unexpectedly small")
    print(f"{destination}: {image.width}x{image.height}, {target.stat().st_size:,} bytes")

registry_path = ROOT / "lib/cancer-images.ts"
code = registry_path.read_text(encoding="utf-8")

illustration_helper = """const illustration = (src: string): CancerGuideImage => ({
  src,
  presentation: 'illustration',
});
"""
photo_helper = """
const photo = (src: string): CancerGuideImage => ({
  src,
  presentation: 'photo',
});
"""
if "const photo = (src: string)" not in code:
    code = code.replace(illustration_helper, illustration_helper + photo_helper)

same_illustration_helper = """const sameIllustration = (src: string): CancerGuideImageSet => {
  const image = illustration(src);
  return { card: image, hero: image, overview: image };
};
"""
same_photo_helper = """
const samePhoto = (src: string): CancerGuideImageSet => {
  const image = photo(src);
  return { card: image, hero: image, overview: image };
};
"""
if "const samePhoto = (src: string)" not in code:
    code = code.replace(same_illustration_helper, same_illustration_helper + same_photo_helper)

replacements = {
    "mesothelioma: sameIllustration('/images/cancer-guides/lung-anatomy.jpg'),": "mesothelioma: samePhoto('/images/cancer-guides/mesothelioma-pathology.webp'),",
    "neuroendocrine: sameIllustration('/images/cancer-guides/digestive-system-anatomy.jpg'),": "neuroendocrine: samePhoto('/images/cancer-guides/neuroendocrine-pathology.webp'),",
    "gist: sameIllustration('/images/cancer-guides/digestive-system-anatomy.jpg'),": "gist: samePhoto('/images/cancer-guides/gist-pathology.webp'),",
    "appendix: sameIllustration('/images/cancer-guides/lower-digestive-anatomy.jpg'),": "appendix: sameIllustration('/images/cancer-guides/appendix-anatomy.webp'),",
    "adrenal: sameIllustration('/images/cancer-guides/kidney-anatomy.jpg'),": "adrenal: sameIllustration('/images/cancer-guides/adrenal-anatomy.webp'),",
    "'primary-peritoneal': sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),": "'primary-peritoneal': sameIllustration('/images/cancer-guides/peritoneum-anatomy.webp'),",
    "'fallopian-tube': sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),": "'fallopian-tube': sameIllustration('/images/cancer-guides/fallopian-tube-anatomy.webp'),",
    "'unknown-primary': sameIllustration('/images/cancer-guides/lymph-system-anatomy.jpg'),": "'unknown-primary': sameIllustration('/images/cancer-guides/unknown-primary-metastasis.webp'),",
    "'gestational-trophoblastic': sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),": "'gestational-trophoblastic': sameIllustration('/images/cancer-guides/gestational-trophoblastic-anatomy.webp'),",
    "mds: sameIllustration('/images/cancer-guides/blood-cell-development.jpg'),": "mds: sameIllustration('/images/cancer-guides/mds-bone-marrow.webp'),",
    "mpn: sameIllustration('/images/cancer-guides/blood-cell-development.jpg'),": "mpn: samePhoto('/images/cancer-guides/mpn-pathology.webp'),",
    "neuroblastoma: sameIllustration('/images/cancer-guides/kidney-anatomy.jpg'),": "neuroblastoma: samePhoto('/images/cancer-guides/neuroblastoma-pathology.webp'),",
    "urethral: sameIllustration('/images/cancer-guides/urinary-system-anatomy.jpg'),": "urethral: sameIllustration('/images/cancer-guides/urethra-anatomy.webp'),",
    "'renal-pelvis-ureter': sameIllustration('/images/cancer-guides/urinary-system-anatomy.jpg'),": "'renal-pelvis-ureter': sameIllustration('/images/cancer-guides/renal-pelvis-ureter-anatomy.webp'),",
    "'salivary-gland': sameIllustration('/images/cancer-guides/oral-cavity-anatomy.jpg'),": "'salivary-gland': sameIllustration('/images/cancer-guides/salivary-glands-anatomy.webp'),",
    "'nasal-sinus': sameIllustration('/images/cancer-guides/oral-cavity-anatomy.jpg'),": "'nasal-sinus': sameIllustration('/images/cancer-guides/nasal-sinus-anatomy.webp'),",
    "laryngeal: sameIllustration('/images/cancer-guides/larynx-anatomy.jpg'),": "laryngeal: sameIllustration('/images/cancer-guides/larynx-dedicated-anatomy.webp'),",
    "parathyroid: sameIllustration('/images/cancer-guides/thyroid-anatomy.jpg'),": "parathyroid: sameIllustration('/images/cancer-guides/parathyroid-anatomy.webp'),",
}

for old, new in replacements.items():
    if old in code:
        code = code.replace(old, new)
    elif new not in code:
        raise RuntimeError(f"Could not find expected mapping: {old}")
registry_path.write_text(code, encoding="utf-8")

docs_path = ROOT / "docs/cancer-guide-image-sources.md"
docs = docs_path.read_text(encoding="utf-8").replace(
    "The cancer guide image registry covers all 35 guides and all three placements in each guide:",
    "The cancer guide image registry covers all 53 guides and all three placements in each guide:",
)

dedicated = """## Dedicated sources for guides 36–53

These assets are downloaded into `public/images/cancer-guides/`, converted to optimised WebP files and served locally. They are not hotlinked. The same registered asset is used consistently for each guide's directory card, hero and overview placement. The urethral guide uses the complete SEER urinary-system illustration rather than an anatomical crop.

| Local asset | Used for | Source and licence |
| --- | --- | --- |
| `mesothelioma-pathology.webp` | Malignant mesothelioma | [Mesothelioma pathology](https://commons.wikimedia.org/wiki/File:Mesothelioma.PNG), released into the public domain by the author |
| `neuroendocrine-pathology.webp` | Neuroendocrine tumours | [Mitosis in a neuroendocrine tumour](https://commons.wikimedia.org/wiki/File:Mitosis_in_a_neuroendocrine_tumor_(original).jpg), CC0 1.0 public-domain dedication |
| `gist-pathology.webp` | Gastrointestinal stromal tumour | [GIST of stomach](https://commons.wikimedia.org/wiki/File:Gastrointestinal_Stromal_Tumor_(GIST)_of_Stomach.jpg), public-domain dedication by the author |
| `appendix-anatomy.webp` | Appendix cancer | [Human appendix in the colon](https://commons.wikimedia.org/wiki/File:Anatomy-human-appendix-in-colon.png), CC0 1.0 public-domain dedication |
| `adrenal-anatomy.webp` | Adrenocortical carcinoma | [Adrenal gland illustration](https://commons.wikimedia.org/wiki/File:Illu_adrenal_gland.jpg), U.S. National Cancer Institute / SEER public-domain work |
| `peritoneum-anatomy.webp` | Primary peritoneal cancer | [Peritoneum anatomy, Gray's Anatomy plate 1037](https://commons.wikimedia.org/wiki/File:Gray1037.png), public domain |
| `fallopian-tube-anatomy.webp` | Fallopian tube cancer | [Uterus and nearby organs](https://commons.wikimedia.org/wiki/File:Uterus_and_nearby_organs.jpg), U.S. National Cancer Institute public-domain work |
| `unknown-primary-metastasis.webp` | Cancer of unknown primary | [Metastasis illustration](https://commons.wikimedia.org/wiki/File:Metastasis_illustration.jpg), U.S. National Cancer Institute public-domain work |
| `gestational-trophoblastic-anatomy.webp` | Gestational trophoblastic disease | [Placenta anatomy](https://commons.wikimedia.org/wiki/File:Placenta.svg), public-domain Gray's Anatomy material |
| `mds-bone-marrow.webp` | Myelodysplastic syndromes | [Bone Marrow, NIH BioArt 56](https://commons.wikimedia.org/wiki/File:Bone_Marrow_(NIH_BioArt_56).svg), U.S. NIAID / NIH public-domain work |
| `mpn-pathology.webp` | Myeloproliferative neoplasms | [Chronic myeloid leukaemia blood smear](https://commons.wikimedia.org/wiki/File:LMC-1.JPG), released into the public domain by the author |
| `neuroblastoma-pathology.webp` | Neuroblastoma | [Neuroblastoma histology](https://commons.wikimedia.org/wiki/File:Neuroblastoma_(1).jpg), U.S. National Cancer Institute public-domain work |
| `urethra-anatomy.webp` | Urethral cancer | [Urinary system illustration](https://commons.wikimedia.org/wiki/File:Illu_urinary_system.svg), U.S. National Cancer Institute / SEER public-domain work |
| `renal-pelvis-ureter-anatomy.webp` | Renal pelvis and ureter cancer | [Kidney and adrenal gland](https://commons.wikimedia.org/wiki/File:Kidney_and_adrenal_gland.jpg), U.S. National Cancer Institute public-domain work |
| `salivary-glands-anatomy.webp` | Salivary gland cancer | [Head-and-neck salivary-gland anatomy](https://commons.wikimedia.org/wiki/File:Illu_quiz_hn_Ohne_Text.JPG), U.S. National Cancer Institute / SEER public-domain work |
| `nasal-sinus-anatomy.webp` | Nasal cavity and paranasal sinus cancer | [Nose and nasal cavities](https://commons.wikimedia.org/wiki/File:Nose_and_nasal_cavities.png), U.S. National Cancer Institute / SEER public-domain work |
| `larynx-dedicated-anatomy.webp` | Laryngeal cancer | [Larynx and nearby structures](https://commons.wikimedia.org/wiki/File:Larynx_and_nearby_structures.jpg), U.S. National Cancer Institute public-domain work |
| `parathyroid-anatomy.webp` | Parathyroid cancer | [Thyroid and parathyroid glands](https://commons.wikimedia.org/wiki/File:Illu_thyroid_parathyroid.jpg), U.S. National Cancer Institute / SEER public-domain work |

"""
marker = "## Dedicated sources for guides 36–53"
original_marker = "## Original project artwork"
if marker in docs:
    docs = docs.split(marker, 1)[0] + dedicated + original_marker + docs.split(original_marker, 1)[1]
else:
    docs = docs.replace(original_marker, dedicated + original_marker)
docs_path.write_text(docs, encoding="utf-8")

for temporary in [
    ROOT / ".github/workflows/fetch-dedicated-cancer-images.yml",
    ROOT / "docs/image-fetch-trigger.txt",
]:
    if temporary.exists():
        temporary.unlink()

expected = [destination for _, destination, _ in SOURCES]
missing = [name for name in expected if not (OUTPUT / name).is_file()]
if missing:
    raise RuntimeError(f"Missing generated assets: {missing}")

mapped = registry_path.read_text(encoding="utf-8")
unmapped = [name for name in expected if f"/images/cancer-guides/{name}" not in mapped]
if unmapped:
    raise RuntimeError(f"Assets missing from registry: {unmapped}")
