"""
 Title: bulld.py

 Group: Scripts
 
 File: build.py
  Provides CLI frontend for glomming and compressing js files. All
  output is logged to the CWD under .build_log, output files are written to
  the base of the search path.
  
 Arguments
 
  - -x, --ignore - _string_ ingore files or dirs named
  - -o, --output - _string_ name for output file, 'out' is default
  
  OR
  
  - --config - _string_ path to config file in JSON format. Config files allow
               to define exactly what files in multiple places to glom and
               compress.
  
  Example config:
  (begin code)
   {
     "path": "/path/to/foo",
     "out": "my_js",
     "files": [
       # all paths are relative
       "./bar/baz.js",
       "./fork.js"
     ]
   }
  (end)
  
 Example:
  > ./build.py -x vendor -x attic -o gryphon > www/javascript
  
  Would create gryphon.js and gryphon.compressed.js in www/javascript
  
  
  
 Version:
  1.1
  
 Copyright:
  2004-2010 The State News, Inc
  
 Author:
  Mike Joseph <josephm5@msu.edu>
  
 License:
  GNU GPL 2.0 - http://opensource.org/licenses/gpl-2.0.php
"""

VERSION = '1.1'
LOGFILE = '.build_log'
DESCRIPTION = "Provides CLI frontend for glomming and compressing js files. All output is logged to the CWD under .build_log, output files are written to the base of the search path."
EPILOG = "(c) The State News, Inc."

import sys
import os
import httplib
import urllib
import commands
import json
import logging
import logging.handlers

from optparse import OptionParser
from time import time, localtime, strftime

# make sure file stats always return floats
os.stat_float_times(True)

"""
 Function: readFile
  Simple handle for reading files
 
 Parameters:
  file - _string_ file name
  
 Returns:
  _string_
"""
def readFile(file):
	handle = open(file)
	data = handle.read()
	handle.close()
	return data
# end readFile

"""
 Function: logOutput
  Log entry handler
 
 Parameters:
  string - _string_ message
  kwargs - _keyword arguments_ level="_string_"
  
 Returns:
  _void_
"""
def logOutput(string, **kwargs) :
	level = 'debug'
	if kwargs.get('level') :
		level = kwargs.get('level')
		
	if level == 'info' :
		logger.info(string)
	elif level == 'warning' :
		logger.warning(string)
	elif level == 'error' :
		logger.error(string)
	elif level == 'critical' :
		logger.critical(string)
	else :
		logger.debug(string)
	
	if level == 'warning' or level == 'notice' :
		print string
# endLogoutput


"""
 Function: main
  Main loop
 
 Parameters:
  searchPath - _string_
  outFile - _string_
  kwargs - _keyword arguments_
  
 Returns:
  _void_
"""
def main(searchPath, outFile, **kwargs) :

	if not os.access(searchPath, os.W_OK):
		logOutput('Could not read %s' % searchPath)
		exit(1)

	completeFile = os.path.join(searchPath, '%s.js' % outFile)
	compressedFile = os.path.join(searchPath, '%s.compressed.js' % outFile)
	
	allCode = ''
	
	if kwargs.get('usefiles') :
		for file in kwargs.get('usefiles') :
			allCode += "\n\n// %s\n\n" % os.path.join(searchPath, file)
			allCode += readFile(os.path.join(searchPath, file))

	else :	
		ignore = []
		if kwargs.get('ignore') :
			ignore = kwargs.get('ignore')
		
		for path, dirs, files in os.walk(searchPath) :
			# ignore directories	
			for dir in ignore :
				if dir in dirs :
					dirs.remove(dir)
	
			for file in files :
				# ignore files
				if not file.endswith('.js') or file in ignore :
					continue
				
				logOutput('Processing %s' % os.path.join(path, file))
	
				# glomming everything togehter
				allCode += "\n\n// %s\n\n" % os.path.join(path, file)
				allCode += readFile(os.path.join(path, file))
			
	handle = open(completeFile, 'w')
	handle.write(allCode)
	handle.close()
	
	logOutput("Wrote %s" % completeFile, level="notice")

	logOutput("Compressing via closure-compiler.appspot.com")
	
	# closeure-compiler to squish everything
	params = urllib.urlencode([
		('js_code', allCode),
		('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
		('output_format', 'text'),
		('output_info', 'compiled_code'),
	])
	
	headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}

	conn = httplib.HTTPConnection('closure-compiler.appspot.com')
	conn.request('POST', '/compile', params, headers);
	response = conn.getresponse()
	
	data = response.read()
	
	conn.close()

	if( data.isspace() ) :
		# if empty data was returned, that's usually an error, so we
		# query the compiler again but this time ask for error text.
		logOutput("Error compiling via colsure-compiler", level="warning")
		params = urllib.urlencode([
			('js_code', allCode),
			('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
			('output_format', 'text'),
			('output_info', 'errors'),
		])
		
		headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	
		conn = httplib.HTTPConnection('closure-compiler.appspot.com')
		conn.request('POST', '/compile', params, headers);
		response = conn.getresponse()
		
		data = response.read()
		
		logOutput(data, level="warning")
	

	handle = open(compressedFile, 'w')
	handle.write(data)
	handle.close()
	
	logOutput("Write %s" % compressedFile, level="notice")

# end main


logger = logging.getLogger('CompileJSLogger')

try :
	# setup the loggers
	logHandler = logging.handlers.RotatingFileHandler(LOGFILE,
		maxBytes=1024000,
		backupCount=6)

	logHandler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - "+
		"%(message)s"))
	logger.addHandler(logHandler)
	
except :
	print "Could not load logger."


parser = OptionParser(version='%prog ' + VERSION, description=DESCRIPTION,
						epilog=EPILOG, usage="usage: %prog [options] path")
parser.add_option('-o', '--out', dest='outfile', type='string',
					help='Base name of the output file')
parser.add_option('-x', '--ignore', dest='ignore', type='string',
					action='append', help='Ignore files containing')
parser.add_option('--config', dest='config', type='string',
					help='Use config file')
					
(options, args) = parser.parse_args()
logOutput('CompressJS Started')

if options.config :
	conf = json.loads(readFile(options.config))
	
	if not conf.get('path') :
		logOutput('No search path defined', level='error')
		parser.print_help()
		exit(3)

	outFile = 'out'	
	if conf.get('out') :
		outFile = conf.get('out')
		
	main(conf.get('path'), outFile, usefiles=conf.get('files'))

else :
	# the search path is required
	searchPath = False
	if len(args) > 0 :
		searchPath = args[0]
	
	# outfile defaults to 'out'
	outFile = options.outfile
	if not options.outfile :
		outFile = 'out'
		
	if not searchPath :
		logOutput('No search path defined', level='error')
		parser.print_help()
		exit(2)
		
	main(searchPath, outFile, ignore=options.ignore)