/*

# Preqompile
## version 1.1.1

Preqompile is a JS-in-CSS runtime that interprets the same containerQuery syntax as Qompile.

### Usage

To preview the result of adding a 'Qompile' stylesheet to an HTML document include a link to the `preqompile.js` file in your HTML document like this:

```
<script src=preqompile.js></script>
```

### Info

- website: https://github.com/tomhodgins/qompile
- author: Tommy Hodgins
- license: MIT

*/

function containerQuery(selector, test, stylesheet) {

  var tag = document.querySelectorAll(selector)
  var style = ''
  var count = 0

  for (var i=0; i<tag.length; i++) {

    var attr = (selector+test).replace(/\W+/g, '')

    if (test(tag[i])) {

      var css = stylesheet.replace(/:self|\$this/g, '[data-' + attr + '="' + count + '"]')

      tag[i].setAttribute('data-' + attr, count)
      style += css
      count++

    }

  }

  return style

}

// Interpolate JS from inside <style> and <link> tags with ${}
var JSinCSS = {}

JSinCSS.load = function() {

  document.querySelectorAll('style').forEach(tag => {

    if (tag.getAttribute('data-populated') == null) {

      tag.setAttribute('data-populated', true)
      JSinCSS.process(tag.innerHTML)

    }

  })

  document.querySelectorAll('link').forEach(tag => {

    if (tag.href
        && tag.rel == 'stylesheet'
        && tag.getAttribute('data-populated') == null) {

      tag.setAttribute('data-populated', true)

      ;(() => {

        var xhr = new XMLHttpRequest

        xhr.open('GET', tag.href, true)
        xhr.send(null)
        xhr.onload = function() {

          JSinCSS.process(xhr.responseText)

        }

      })()

    }

  })

}

JSinCSS.process = function(stylesheet) {

  if (stylesheet) {

    var events = ['resize', 'input', 'click']
    var css = new Function('return `' + stylesheet + '`')
    var style = document.createElement('style')

    style.setAttribute('data-populated', true)
    style.innerHTML = css()
    document.head.appendChild(style)

    events.forEach(event => {

      window.addEventListener(event, e => {

        style.innerHTML = css()

      })

    })

    style.innerHTML = css()

  }

}

window.addEventListener('load', JSinCSS.load)