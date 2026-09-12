#!/usr/bin/env python3
# Real ZIP protocol regression; leaves its small, marked fixture for inspection.
from pathlib import Path
import subprocess,json,os,select,time,zipfile,hashlib,sys
base=Path('/home/flea-sandbox').resolve();assert base.is_dir() and base != Path.home() and Path.home() not in base.parents
root=base/('flea-zip-doubleclick-'+str(os.getpid()));root.mkdir();(root/'.flea-test-sandbox').write_text('flea test sandbox\n')
exe=sys.argv[1];results=[]
def request(archive,dest):
 p=subprocess.Popen([exe,'--backend'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE);p.stdin.write((json.dumps({'c':'archive','op':'extract-here','path':str(archive),'dest':str(dest)})+'\n').encode());p.stdin.flush();buf=b'';deadline=time.monotonic()+15;answer=None
 try:
  while time.monotonic()<deadline and answer is None:
   if not select.select([p.stdout],[],[],.2)[0]:continue
   buf+=os.read(p.stdout.fileno(),65536)
   while b'\n' in buf:
    line,buf=buf.split(b'\n',1)
    try:j=json.loads(line)
    except ValueError:continue
    if j.get('t')=='archivedone':answer=j
  assert answer is not None,'No completion'
  return answer
 finally:
  p.stdin.write(b'{"c":"quit"}\n');p.stdin.flush();p.communicate(timeout=5)
def archive(name,entries):
 d=root/name;d.mkdir();z=d/'My Archive.ZIP'
 with zipfile.ZipFile(z,'w') as f:
  for k,v in entries.items():f.writestr(k,v)
 return d,z
folder,z=archive('normal',{'hello.txt':'hello','nested/inside.txt':'world'});h=hashlib.sha256(z.read_bytes()).hexdigest();r=request(z,folder);assert r['ok'],r;assert (folder/'hello.txt').read_text()=='hello';assert (folder/'nested/inside.txt').read_text()=='world';assert hashlib.sha256(z.read_bytes()).hexdigest()==h;results.append(['real ZIP direct extraction',r])
r=request(z,folder);assert not r['ok'];assert (folder/'hello.txt').read_text()=='hello';results.append(['repeat preserves existing contents',r])
folder,z=archive('collision',{'a-new.txt':'new','z-existing.txt':'replace'});(folder/'z-existing.txt').write_text('KEEP');r=request(z,folder);assert not r['ok'];assert not (folder/'a-new.txt').exists();assert (folder/'z-existing.txt').read_text()=='KEEP';results.append(['preflight all entries',r])
folder,z=archive('hostile',{'../escape.txt':'bad'});r=request(z,folder);assert not r['ok'];assert not (root/'escape.txt').exists();assert not (folder/'escape.txt').exists();results.append(['path traversal blocked',r])
folder,z=archive('empty',{});r=request(z,folder);assert r['ok'];results.append(['empty ZIP',r])
folder,z=archive('damaged',{'a':'x'});z.write_bytes(b'not a zip');r=request(z,folder);assert not r['ok'];assert not (folder/'a').exists();results.append(['damaged ZIP',r])
print(json.dumps({'binary':exe,'fixture':str(root),'results':results},indent=2))
