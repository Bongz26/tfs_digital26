import sys
import os
import fitz # PyMuPDF

def convert_pdf_to_images(pdf_path, output_dir):
    """
    Converts a PDF file to high-quality images (one per page).
    """
    print(f"Reading {pdf_path}...")
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    # Use a high DPI/zoom for professional, crisp images
    zoom_x = 3.0
    zoom_y = 3.0
    mat = fitz.Matrix(zoom_x, zoom_y)

    for i in range(len(doc)):
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        output_file = os.path.join(output_dir, f"page{i+1}.png")
        pix.save(output_file)
        print(f"Saved professional-quality image to: {output_file}")
        
    print(f"\nSuccessfully converted {len(doc)} pages! Your digital brochure is now updated.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_brochure.py <path_to_pdf_file>")
        print("Example: python convert_brochure.py my_brochure.pdf")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    output_dir = os.path.join(os.getcwd(), "client", "public", "images")
    convert_pdf_to_images(pdf_path, output_dir)
