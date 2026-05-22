import PyPDF2
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def extract_pdf(filepath):
    try:
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for i, page in enumerate(reader.pages):
                text += f"\n--- PAGE {i+1} ---\n"
                extracted = page.extract_text() or "[No text extracted]"
                text += extracted
            return text
    except Exception as e:
        return f"ERROR: {e}"

# Reference documents
ref_dir = os.path.join("docs", "reference")
for fname in sorted(os.listdir(ref_dir)):
    if fname.endswith('.pdf'):
        print(f"\n{'='*80}")
        print(f"FILE: {fname}")
        print(f"{'='*80}")
        print(extract_pdf(os.path.join(ref_dir, fname)))

# Old documentation
old_dir = os.path.join("docs", "documentacion vieja")
for fname in sorted(os.listdir(old_dir)):
    if fname.endswith('.pdf'):
        print(f"\n{'='*80}")
        print(f"FILE: {fname}")
        print(f"{'='*80}")
        print(extract_pdf(os.path.join(old_dir, fname)))
