"""Run the preserved workflow's run-blocks against the archived entrypoints.
The scientific snapshots and their original assertions are not rewritten.
"""
from pathlib import Path
import subprocess
lines=Path('scripts/legacy-site-qa.yml').read_text().splitlines()
i=0
while i<len(lines):
    if lines[i]=='        run: |':
        i+=1; block=[]
        while i<len(lines) and (lines[i].startswith('          ') or not lines[i].strip()):
            block.append(lines[i][10:]);i+=1
        script='\n'.join(block).replace('index.html','archive.html').replace('README.md','ARCHIVE_README.md')
        subprocess.run(['bash','-e','-c',script],check=True)
    else:i+=1
