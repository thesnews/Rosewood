import httplib
import urllib
import sys
import os

def readFile(file):
	handle = open(file)
	data = handle.read()
	handle.close()
	return data

if len(sys.argv) <= 1:
	print 'No infile'
	sys.exit(1)

if not os.access(sys.argv[1], os.W_OK):
	print "Error reading %s" % sys.argv[1]
	sys.exit(1)

completeFile = os.path.join(sys.argv[1], 'rosewood.js')
compiledFile = os.path.join(sys.argv[1], 'rosewood.compiled.js')

allCode = ''

for path, dirs, files in os.walk( sys.argv[1] ):
	for file in files:
		if( file.endswith( '.js' ) and 'rosewood' not in file ):
			print "Found %s" % file
			allCode += readFile( os.path.join( path, file ) )

params = urllib.urlencode([
	('js_code', allCode ),
	('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
	('output_format', 'text'),
	('output_info', 'compiled_code'),
])

headers = {
	'Content-Type': 'application/x-www-form-urlencoded'
}

print "\nCompiling via closure-compiler.appspot.com..."

conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers);
response = conn.getresponse()

data = response.read()

conn.close()

print "Writing output... "

handle = open( completeFile, 'w' )
handle.write( allCode )
handle.close()

handle = open( compiledFile, 'w' )
handle.write( data )
handle.close()
