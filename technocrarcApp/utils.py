import io
import zipfile
import os

def zip_files(dir):
    outfile = io.BytesIO()
    with zipfile.ZipFile(outfile, 'w') as zf:
        files = [file for file in os.listdir(dir)]
        for f in files:
            path = os.path.join(dir, f)
            zf.write(path, os.path.basename(path))
    return outfile

def persist_zip(path, file):
    with open(path + '.zip', 'wb') as archive:
        archive.write(file.getvalue())
