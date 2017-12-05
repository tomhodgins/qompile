/*

# Preqompile
## version 0.0.3

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

      var css = stylesheet.replace(/\$this/g, '[data-' + attr + '="' + count + '"]')

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

  var style = document.getElementsByTagName('style')

  for (i = 0; i < style.length; i++) {

    JSinCSS.process(style[i], style[i].innerHTML)

  }

  var link = document.getElementsByTagName('link')

  for (i = 0; i < link.length; i++) {

    var currentLink = link[i]

    if (currentLink.href && link[i].rel == 'stylesheet') {

      (function() {

        var xhr = new XMLHttpRequest

        xhr.open('GET', currentLink.href, true)
        xhr.send(null)
        xhr.onreadystatechange = function() {

          JSinCSS.process(currentLink, xhr.responseText)

        }

      })()

    }

  }

}

JSinCSS.process = function(tag, stylesheet) {

  if (stylesheet) {

    var event = ['load', 'resize', 'input', 'click']
    var css = new Function('return `' + stylesheet + '`')

    for (var j=0; j<event.length; j++) {

      if (!tag.getAttribute('data-populated')) {

        var style = document.createElement('style')

        style.innerHTML = css()
        tag.setAttribute('data-populated', true)
        style.setAttribute('data-populated', true)
        document.head.appendChild(style)

      }

      window.addEventListener(event[j], function(e) {

        if (style) {

          style.innerHTML = css()

        }

      })

    }

  }

}

window.addEventListener('load', JSinCSS.load)