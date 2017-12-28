#!/bin/sh

# Rebuild Qompile Tests

echo "Building inline widget demo";
node ../../qompile.js widget.html -c widget.jic -o ../widget-inline.html -s 30 -m;

echo "Building external widget demo";
node ../../qompile.js widget.html -c widget.jic -o ../widget-external.html -e ../widget-external.css -s 30 -m;


echo "Building inline nested demo";
node ../../qompile.js nested.html -c nested.jic -o ../nested-inline.html -s 30 -m;

echo "Building external nested demo";
node ../../qompile.js nested.html -c nested.jic -o ../nested-external.html -e ../nested-external.css -s 30 -m;

echo "Building inline calendar demo";
node ../../qompile.js calendar.html -c calendar.jic -o ../calendar-inline.html -s 30 -m;

echo "Building external calendar demo";
node ../../qompile.js calendar.html -c calendar.jic -o ../calendar-external.html -e ../calendar-external.css -s 30 -m;

echo "Building inline element queries demo";
node ../../qompile.js element.html -c element.jic -o ../element-inline.html -s 2000 -m;

echo "Building external element queries demo";
node ../../qompile.js element.html -c element.jic -o ../element-external.html -e ../element-external.css -s 2000 -m;

echo "Build complete!";