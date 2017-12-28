![](https://i.imgur.com/t4zQycw.png)

# Qompile

**Build with Container Queries. Ship CSS.**

This tool converts Container Queries to CSS Media Queries by consuming an HTML input file and a CSS stylesheet.

Included in this compiler is a mixin for container queries, named `containerQuery()` which accepts three arguments: `selector`, `test`, and `stylesheet`:

- `selector` is a CSS selector list quoted as a string
- `test` is a JavaScript function that accepts a DOM node and returns true/false
- `stylesheet` is a CSS stylesheet quoted as a string, anywhere the selector `:self` is used it will be replaced with a selector targeting the matching element

To write a container query applying a green background to a `<div>` element when it is wider than 500px you could write a query in this format:

```css
${containerQuery('div', el => el.offsetWidth > 500, `
  :self {
    background: lime;
  }
`)}
```

## What does it do?

This plugin is capable of prerendering width-based container queries, as long as the width of the elements wit breakpoints is ultimately derived from the width of the viewport in the layout.

It is also possible to use a very limited set of element queries (like setting a style based on things present in your HTML) that are non-interactive and as long as they won't need updating after the page loads. Watch for more demos exploring what can be predicted in advance!

## What does it _not_ do?

It does not support any height-based container queries, nor any width-based container queries on element in layouts that change in ways not deriving from width of the viewport.

For example, if you have a collapsing sidebar that can be toggled without the viewport changing width, `qompile` wouldn't be able to predict the widths of elements in both states.

It is also impossible to predict elements that have been added to the page after the page has loaded.

If you're looking for realtime element & container queries that are able to adapt to new elements and events in the browser, check out a [CSS reprocessor](https://github.com/topics/css-reprocessor) like [EQCSS](https://github.com/eqcss/eqcss), [CSSplus](https://github.com/tomhodgins/cssplus), [reproCSS](https://github.com/tomhodgins/reprocss), [JS-in-CSS](https://github.com/tomhodgins/js-in-css), or [QSS](https://github.com/tomhodgins/qss).

## Usage

### Install Qompile from npm

```bash
npm -i qompile
```

### HTML Compiler

The simplest usage of Qompile on the command line outputs a test HTML and CSS to the console:

```bash
qompile
```

A normal usage where you are consuming a file named `input.html` and a stylesheet named `styles.css` and outputting them as a file named `output.html` might look like this:

```bash
qompile input.html -c styles.css -o output.html
```

#### Options

If you want to fine-tune the output more, here is a list of all supported options and a description of what they are used for:

```bash
qompile [-h|--html]* input.html [-c|-css] styles.css [-r|--range] 100:2000 [-s|--step] 100 [-o|--output] output.html [-e|--external] external.css [-v|--verbose]
```

##### -h | --html

The path name of the HTML file to be read

##### -c | --css

The path name of the stylesheet file to be read

##### -r | --range

A colon-separated pair of numbers setting the minimum and maximum widths. Default range is `1:2000`

##### -s | --step

A number defining the step size between snapshots. Default step is `100`

##### -o | --output

The path name of the HTML file to output

##### -e | --external

The path name of the external CSS file to output

##### -v | --verbose

Enables logging of the result to the console

##### -m | --minify

Enables rule de-duplication via CSSnano, and media query consolidation via css-mqpacker

#### --help

Dislpays help text

### Live Debugging

This compiler comes with a companion JavaScript runtime for debugging and previewing purposes. If you want to preview what the result of adding a 'Qompile' stylesheet to an HTML document will look like, include a link to the `preqompile.js` file in your HTML document like this:

```html
<script src=preqompile.js></script>
```

For a comparison between live container queries using `preqompile` and container queries flattened to CSS media queries using `qompile`, check out the following demos:

## Examples

### Widget Demo

- [Input HTML](https://github.com/tomhodgins/qompile/blob/master/test/src/widget.html)
- [Input Container Queries](https://github.com/tomhodgins/qompile/blob/master/test/src/widget.jic)
- [Live preview via `preqompile` runtime](https://tomhodgins.github.io/qompile/test/widget-live.html)
- [Compiled inline via `qompile`](https://tomhodgins.github.io/qompile/test/widget-inline.html)
- [Compiled with external stylesheet via `qompile`](https://tomhodgins.github.io/qompile/test/widget-external.html)

### Nested Components Demo

- [Input HTML](https://github.com/tomhodgins/qompile/blob/master/test/src/nested.html)
- [Input Container Queries](https://github.com/tomhodgins/qompile/blob/master/test/src/nested.jic)
- [Live preview via `preqompile` runtime](https://tomhodgins.github.io/qompile/test/nested-live.html)
- [Compiled inline via `qompile`](https://tomhodgins.github.io/qompile/test/nested-inline.html)
- [Compiled with external stylesheet via `qompile`](https://tomhodgins.github.io/qompile/test/nested-external.html)

### Calendar Demo

- [Input HTML](https://github.com/tomhodgins/qompile/blob/master/test/src/calendar.html)
- [Input Container Queries](https://github.com/tomhodgins/qompile/blob/master/test/src/calendar.jic)
- [Live preview via `preqompile` runtime](https://tomhodgins.github.io/qompile/test/calendar-live.html)
- [Compiled inline via `qompile`](https://tomhodgins.github.io/qompile/test/calendar-inline.html)
- [Compiled with external stylesheet via `qompile`](https://tomhodgins.github.io/qompile/test/calendar-external.html)

### Element Queries Demo

- [Input HTML](https://github.com/tomhodgins/qompile/blob/master/test/src/element.html)
- [Input Container Queries](https://github.com/tomhodgins/qompile/blob/master/test/src/element.jic)
- [Live preview via `preqompile` runtime](https://tomhodgins.github.io/qompile/test/element-live.html)
- [Compiled inline via `qompile`](https://tomhodgins.github.io/qompile/test/element-inline.html)
- [Compiled with external stylesheet via `qompile`](https://tomhodgins.github.io/qompile/test/element-external.html)