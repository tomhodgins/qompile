# Qompile

Compile HTML with container queries into flat HTML & CSS. This tool consumes an HTML input file and a CSS stylesheet that can make use of use JS interpolation anywhere via `${}`.

Included in this compiler is a mixin for container queries, named `containerQuery()` which accepts three arguments: `selector`, `test`, and `stylesheet`:

- `selector` is a CSS selector list quoted as a string
- `test` is a JavaScript function that accepts a DOM node and returns true/false
- `stylesheet` is a CSS stylesheet quoted as a string, anywhere the selector `$this` is used it will be replaced with a selector targeting the matching element

To write a container query applying a green background to a `<div>` element when it is wider than 500px you could write a query in this format:

```css
${containerQuery('div', el => el.offsetWidth > 500, `
  $this {
    background: lime;
  }
`)}
```

### Usage

### HTML Compiler

The simplest usage of Qompile on the command line outputs a test HTML and CSS to the console:

```bash
$ qompile
```

A normal usage where you are consuming a file named `input.html` and a stylesheet named `styles.css` and outputting them as a file named `output.html` might look like this:

```bash
$ qompile input.html -c styles.css -o output.html
```

### Options

If you want to fine-tune the output more, here is a list of all supported options and a description of what they are used for:

```bash
$ qompile [-h|--html]* input.html [-c|-css] styles.css [-r|--range] 100:2000 [-s|--step] 100 [-o|--output] output.html [-e|--external] external.css [-v|--verbose]
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

#### -e | --external

The path name of the external CSS file to output

#### -v | --verbose

Enables logging of the result to the console

### Live Debugging

This compiler comes with a companion JavaScript runtime for debugging and previewing purposes. If you want to preview what the result of adding a 'Qompile' stylesheet to an HTML document will look like, include a link to the `preqompile.js` file in your HTML document like this:

```html
<script src=preqompile.js></script>
```

For a comparison between live container queries using `preqompile` and container queries flattened to CSS media queries using `qompile`, check out the following two demo files:

- [Live demo with `preqompile`](https://tomhodgins.github.io/qompile/test/widget-live.html)

- [Compiled demo using inlined CSS with `qompile`](https://tomhodgins.github.io/qompile/test/widget-flattened.html)

```bash
$ qompile -h test/src/widget.html -c test/src/widget.css -o test/widget-flattened.html
```

- [Compiled demo using external CSS with `qompile`](https://tomhodgins.github.io/qompile/test/widget-external.html)

```bash
$ qompile -h test/src/widget.html -c test/src/widget.css -o test/widget-external.html -e test/external.css
```