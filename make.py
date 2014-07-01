#!/usr/bin/python

import sys
import os

def Sources( find_path ):
    sources = []
    for root, dirs, files in os.walk( find_path ):
        for filename in files:
            file_path = os.path.join( root, filename )
            if os.path.splitext( filename )[1] == ".js":
                sources.append( file_path )
    return sources

def Cat( sources, output_file ):
    f = open( output_file, 'w' )
    for filename in sources:
        for line in open( filename, 'r' ):
            f.write( line )
        f.write('\n')
    f.close()

def Min( sources, output_file ):
    input_files = " ".join( sources )
    options = "--language_in=ECMASCRIPT5"
    command = "java -jar Bin/compiler.jar " + options + " --js " + input_files + " --js_output_file " + output_file
    os.system( command )

if __name__=='__main__':
    sources = Sources( "./Source/Core/" )
    Cat( sources, "Build/KVS.js" )
    Min( sources, "Build/KVS.min.js" )

    sources = Sources( "./Source/THREE/" )
    Cat( sources, "Build/KVS2THREE.js" )
    Min( sources, "Build/KVS2THREE.min.js" )
