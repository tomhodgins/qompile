#!/usr/bin/env node

/*

# Qompile
## version 0.0.1

Compile HTML with container queries into flat HTML & CSS. This tool consumes an HTML input file and a CSS stylesheet that can makeuse of use JS interpolation anywhere via `${}`.

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
$ qompile [-h|--html]* input.html [-c|-css] styles.css [-r|--range] 100:2000 [-s|--step] 100 [-o|--output] output.html [-v|--verbose]
```

#### -h | --html

The path name of the HTML file to be read

#### -c | --css

The path name of the stylesheet file to be read

#### -r | --range

A colon-separated pair of numbers setting the minimum and maximum widths. Default range is `0:2000`

#### -s | --step

A number defining the step size between snapshots. Defult step is `100`

#### -o | --output

The path name of the HTML file to output

#### -v | --verbose

Enables logging of the result to the console

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

// Read arguments from console
const html = arg._[0] || arg.h || arg.html || null
const css = arg.c || arg.css || null
const range = arg.r || arg.range || '0:2000'
const step = arg.s || arg.step || 100
const output = arg.o || arg.output || false
let verbose = arg.v || arg.verbose || false

// Enable verbose output if no output specified
if (!output && !verbose) {

  verbose = true

}

// Split range into min & max
const min = parseInt(range.split(':')[0])
const max = parseInt(range.split(':')[1])

// Calculate steps
const steps = []

for (let i=0; (step*i) < (max-min); i++) {

  steps.push(min + (step * i))

}

steps.push(max)

// Load HTML & CSS from file
const loadedHTML = html
                     ? fs.readFileSync(html).toString()
                     : '<!DOCTYPE html><title>preqompiled example</title>'
const loadedCSS = css
                    ? fs.readFileSync(css).toString()
                    : '\nhtml { background: lime; }'


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
    await page.setViewport({width: steps[i], height: 1000})

    let watchDog = page.waitForFunction('true')

    // Render styles at the current width
    generatedCSS += await page.evaluate((size, loadedCSS) => {

      let func = new Function(' return `' + loadedCSS + '`')

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
              style += `\n@media (min-width: ${size}px) { ${css} }`
              count++

            }

          }

          return style

        }

      )

      return stylesheet

    }, steps[i], loadedCSS)

  }

  // Add generated styles to DOM
  await page.evaluate(code => {

    document.head.innerHTML += `<style>${code}\n</style>`

  }, generatedCSS)

  // Output final DOM
  const renderedHTML = await page.content()

  // White output to file
  if (output) {

    fs.writeFileSync(output, renderedHTML)

  }

  // Log output to console
  if (verbose) {

    console.log(renderedHTML)

  }

  // Close the browser
  await browser.close()

})