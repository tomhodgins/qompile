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

echo "Building inline order form demo";
node ../../qompile.js order-form.html -c order-form.jic -o ../order-form-inline.html -m;

echo "Building external order form demo";
node ../../qompile.js order-form.html -c order-form.jic -o ../order-form-external.html -e ../order-form-external.css -m;

echo "Building inline tables demo";
node ../../qompile.js tables.html -c tables.jic -o ../tables-inline.html -m;

echo "Building external tables demo";
node ../../qompile.js tables.html -c tables.jic -o ../tables-external.html -e ../tables-external.css -m;

echo "Building inline grid demo";
node ../../qompile.js grid.html -c grid.jic -o ../grid-inline.html -m;

echo "Building external grid demo";
node ../../qompile.js grid.html -c grid.jic -o ../grid-external.html -e ../grid-external.css -m;

echo "Build complete!";