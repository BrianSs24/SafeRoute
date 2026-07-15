# -*- coding: utf-8 -*-
"""Corrige portada, captions y nombre en el DOCX de entrega."""
from pathlib import Path

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt

SRC = Path(r"c:\Users\joelt\Desktop\Trabajo Final Seminario 2.docx")
OUT_MAIN = SRC
OUT_NAMED = Path(r"c:\Users\joelt\Desktop\PI_Almonte_Joel.docx")


def make_paragraph(text, *, size=10, bold=False, italic=True, align="left", space_after=10):
    p = OxmlElement("w:p")
    pPr = OxmlElement("w:pPr")

    jc = OxmlElement("w:jc")
    jc_map = {"left": "left", "center": "center", "both": "both"}
    jc.set(qn("w:val"), jc_map.get(align, "left"))
    pPr.append(jc)

    spacing = OxmlElement("w:spacing")
    spacing.set(qn("w:after"), str(int(space_after * 20)))
    spacing.set(qn("w:line"), "360")
    spacing.set(qn("w:lineRule"), "auto")
    pPr.append(spacing)
    p.append(pPr)

    r = OxmlElement("w:r")
    rPr = OxmlElement("w:rPr")
    rFonts = OxmlElement("w:rFonts")
    rFonts.set(qn("w:ascii"), "Times New Roman")
    rFonts.set(qn("w:hAnsi"), "Times New Roman")
    rFonts.set(qn("w:eastAsia"), "Times New Roman")
    rPr.append(rFonts)

    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), str(size * 2))
    rPr.append(sz)
    szCs = OxmlElement("w:szCs")
    szCs.set(qn("w:val"), str(size * 2))
    rPr.append(szCs)

    if bold:
        rPr.append(OxmlElement("w:b"))
    if italic:
        rPr.append(OxmlElement("w:i"))
    r.append(rPr)

    t = OxmlElement("w:t")
    t.set(qn("xml:space"), "preserve")
    t.text = text
    r.append(t)
    p.append(r)
    return p


def para_text(p_elem):
    return "".join(t.text or "" for t in p_elem.findall(".//" + qn("w:t")))


def replace_paragraph_text(p_elem, new_text):
    texts = p_elem.findall(".//" + qn("w:t"))
    if not texts:
        r = OxmlElement("w:r")
        t = OxmlElement("w:t")
        t.set(qn("xml:space"), "preserve")
        t.text = new_text
        r.append(t)
        p_elem.append(r)
        return
    texts[0].text = new_text
    for t in texts[1:]:
        t.text = ""


def main():
    doc = Document(str(SRC))
    body = doc.element.body

    tables = [c for c in body.iterchildren() if c.tag == qn("w:tbl")]
    print("tables found:", len(tables))

    captions = {
        1: "Tabla 2. Criterios operativos adicionales (elaboración propia).",
        2: "Tabla 3. Puente entre tema C18, conceptos ISW-411 y SafeRoute (elaboración propia).",
        3: "Tabla 4. Ventajas del enfoque geoespacial (elaboración propia).",
        4: "Tabla 5. Desventajas (elaboración propia).",
        5: "Tabla 6. Riesgos (elaboración propia).",
        6: "Tabla 7. Diario de investigación (elaboración propia).",
    }

    for idx in sorted(captions.keys(), reverse=True):
        text = captions[idx]
        tbl = tables[idx]
        nxt = tbl.getnext()
        if nxt is not None and nxt.tag == qn("w:p") and text[:18] in para_text(nxt):
            print("skip existing", text[:40])
            continue
        caption = make_paragraph(text, size=10, italic=True, align="left", space_after=12)
        tbl.addnext(caption)
        print("added", text[:55])

    # Figura 1 before explanatory text of model
    for c in list(body.iterchildren()):
        if c.tag != qn("w:p"):
            continue
        if not para_text(c).startswith("Dibuj"):
            continue
        prev = c.getprevious()
        if prev is not None and prev.tag == qn("w:p") and "Figura 1" in para_text(prev):
            print("Figura 1 already present")
            break
        cap = make_paragraph(
            "Figura 1. Modelo original de evolución geoespacial para SafeRoute (elaboración propia).",
            size=10,
            italic=True,
            align="center",
            space_after=10,
        )
        c.addprevious(cap)
        print("added Figura 1 caption")
        break

    # Cover header
    first = None
    for c in body.iterchildren():
        if c.tag == qn("w:p"):
            first = c
            break

    whole = "\n".join(
        para_text(c) for c in body.iterchildren() if c.tag == qn("w:p")
    )
    if "UNIVERSIDAD ABIERTA PARA ADULTOS" not in whole and first is not None:
        cover_lines = [
            ("UNIVERSIDAD ABIERTA PARA ADULTOS (UAPA)", 14, True, "center"),
            ("Escuela de Ingeniería en Informática / Software", 12, False, "center"),
            ("Seminario de Proyecto II (ISW-411) | Periodo 2026-32", 12, False, "center"),
            ("Archivo de entrega: PI_Almonte_Joel.docx", 11, False, "center"),
            ("Santo Domingo, República Dominicana — Julio 2026", 11, False, "center"),
            (" ", 12, False, "center"),
        ]
        for text, size, bold, align in reversed(cover_lines):
            p = make_paragraph(
                text,
                size=size,
                bold=bold,
                italic=False,
                align=align,
                space_after=4,
            )
            first.addprevious(p)
        print("added cover header")
    else:
        print("cover already present")

    for c in body.iterchildren():
        if c.tag != qn("w:p"):
            continue
        t = para_text(c)
        if t.strip() == "Seminario de Proyectos II":
            replace_paragraph_text(c, "Seminario de Proyecto II (ISW-411)")
            print("fixed asignatura name")
        if "PI_Torres_Joel" in t:
            replace_paragraph_text(
                c,
                "Archivo nombrado PI_Almonte_Joel.docx.",
            )
            print("fixed checklist filename")
        if t.strip() == "Joel Almonte 100044155":
            replace_paragraph_text(c, "Joel Almonte | Matrícula: 100044155")
            print("normalized participante")

    doc.save(str(OUT_MAIN))
    doc.save(str(OUT_NAMED))
    print("OK", OUT_MAIN)
    print("OK", OUT_NAMED)


if __name__ == "__main__":
    main()
