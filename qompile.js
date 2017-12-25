#!/usr/bin/env node

/*

# Qompile
## version 0.0.6

Convert Container Queries to CSS Media Queries. This tool consumes an HTML input file and a CSS stylesheet that can makeuse of use JS interpolation anywhere via `${}`.

Included in this compiler is a mixin for container queries, named `containerQuery()` which accepts three arguments: `selector`, `test`, and `stylesheet`:

- `selector` is a CSS selector list quoted as a string
- `test` is a JavaScript function that accepts a DOM node and returns true/false
- `stylesheet` is a CSS stylesheet quoted as a string, anywhere the selector `$this` is used it will be replaced with a selector targeting the matching element

To write a container query applying a green background to a `<div>` element when it is wider than 500px you could write a query in this format:

```
${containerQuery('div', el => el.offsetWidth > 500, `
  $this {
    background: lime;
  }
`)}
```

### Usage

The simplest usage of Qompile on the command line outputs a test HTML and CSS to the console:

```
$ qompile
```

A normal usage where you are consuming a file named `input.html` and a stylesheet named `styles.css` and outputting them as a file named `output.html` might look like this:

```
$ qompile input.html -c styles.css -o output.html
```

### Options

If you want to fine-tune the output more, here is a list of all supported options and a description of what they are used for:

```
$ qompile [-h|--html]* input.html [-c|-css] styles.css [-r|--range] 100:2000 [-s|--step] 100 [-o|--output] output.html [-e|--external] external.css [-v|--verbose]
```

#### -h | --html

The path name of the HTML file to be read

#### -c | --css

The path name of the stylesheet file to be read

#### -r | --range

A colon-separated pair of numbers setting the minimum and maximum widths. Default range is `1:2000`

#### -s | --step

A number defining the step size between snapshots. Default step is `100`

#### -o | --output

The path name of the HTML file to output

#### -e | --external

The path name of the external CSS file to output

#### -v | --verbose

Enables logging of the result to the console

#### -m | --minify

Enables rule de-duplication via CSSnano, and media query consolidation via css-mqpacker

#### --help

Dislpays help text

### Info

- website: https://github.com/tomhodgins/qompile
- author: Tommy Hodgins
- license: MIT

*/

'use strict'

// Import modules
const fs = require('fs') // read/write files
const arg = require('minimist')(process.argv.slice(2)) // read arguments
const puppeteer = require('puppeteer') // control headless browser
const postcss = require('postcss') // run CSSnano and css-mqpacker

// Read arguments from console
const opts = {
  html: arg._[0] || arg.h || arg.html || null,
  css: arg.c || arg.css || null,
  range: arg.r || arg.range || '1:2000',
  step: arg.s || arg.step || 100,
  output: arg.o || arg.output || false,
  external: arg.e || arg.external || false,
  verbose: arg.v || arg.verbose || false,
  minify: arg.m || arg.minify || false,
  help: arg.help || false
}

// If help option present, output help text
if (opts.help) {
  console.log(`
Usage: qompile [file] [options]

Options:

  -h, --html      The path name of the HTML file to be read

  -c, --css       The path name of the stylesheet file to be read

  -r, --range     A colon-separated number pair for minimum and maximum widths
                  Default range is 1:2000

  -s, --step      A number defining the step size
                  Default step is 100

  -o, --output    The path name of the HTML file to output

  -e, --external  The path name of the external CSS file to output

  -v, --verbose   Output result to console

  -m, --minify    Enables rule de-duplication via CSSnano,
                  and media query consolidation via css-mqpacker

      --help      Displays this help text

`)
  process.exit()
}


// Enable verbose output if no output specified
if (!opts.output && !opts.external) {

  opts.verbose = true

}

// Split range into min & max
const min = parseInt(opts.range.split(':')[0])
const max = parseInt(opts.range.split(':')[1])

// Calculate steps
const steps = []

for (let i=0; (opts.step*i) < (max-min); i++) {

  steps.push(min + (opts.step * i))

}

steps.push(max)

// Load HTML & CSS from file
const loadedHTML = opts.html
                     ? fs.readFileSync(opts.html).toString()
                     : '<div>qompile demo</div>'

const loadedCSS = opts.css
                    ? fs.readFileSync(opts.css).toString()
                    : '${containerQuery("div", el => el.offsetWidth > 600, "$this{background:lime}")}'

// Prepare empty stylesheet
let generatedCSS = ''

// Launch headless browser via Pupetteer
puppeteer.launch().then(async browser => {

  // Load HTML into browser
  const page = await browser.newPage()

  await page.goto(
          `data:text/html;charset=utf8,${loadedHTML}`,
          {waitUntil: 'networkidle2'})

  // For each step in our range
  for (let i=0; i<steps.length; i++) {

    // Resize the viewport
    await page.setViewport({width: steps[i], height: 400})

    // Render styles at the current width
    generatedCSS += await page.evaluate((size, next, loadedCSS) => {

      let func = new Function('return `' + loadedCSS + '`')

      let stylesheet = func.call(

        containerQuery = (selector, test, stylesheet) => {

          const tag = document.querySelectorAll(selector)
          let style = ''
          let count = 0

          for (let i=0; i<tag.length; i++) {

            const attr = (selector+test+'at'+size).replace(/\W+/g, '')

            if (test(tag[i])) {

              const css = stylesheet.replace(/\$this/g, `[data-${attr}="${count}"]`)

              tag[i].setAttribute(`data-${attr}`, count)
              style += `@media(min-width: ${size}px)${next && ' and (max-width:' + next + 'px)' || ''}{${css}}`
              count++

            }

          }

          return style

        }

      )

      return stylesheet

    }, steps[i], steps[i+1], loadedCSS)

  }

  // Deduplicate rules & consolidate queries
  if (opts.minify) {

    await postcss([

      require('cssnano')(),
      require('css-mqpacker')()

    ]).process(generatedCSS).then(result => {

      generatedCSS = result.css

    })

  }

  // Add generated styles to DOM
  if (opts.external) {

    await page.evaluate(path => {

      path = path.split('/')

      let filename = path[path.length - 1]

      document.head.innerHTML += `<link href="${filename}" rel=stylesheet>`

    }, opts.external)

    fs.writeFileSync(opts.external, generatedCSS)

  } else {

    await page.evaluate(css => {

      document.head.innerHTML += `<style>${css}</style>`

    }, generatedCSS)

  }

  // Output final DOM
  const renderedHTML = await page.content()

  // White output to file
  if (opts.output) {

    fs.writeFileSync(opts.output, renderedHTML)

  }

  // Log output to console
  if (opts.verbose) {

    console.log(renderedHTML)

  }

  // Close the browser
  await browser.close()

})