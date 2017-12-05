# Qompile

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