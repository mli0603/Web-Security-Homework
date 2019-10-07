from flask import Flask
from flask import render_template_string
from flask import request, make_response
import html

app = Flask(__name__)

page_header = """
<!doctype html>
<html>
  <head>
    <!-- Internal game scripts/styles, mostly boring stuff -->
    <script src="/static/game-frame.js"></script>
    <link rel="stylesheet" href="/static/game-frame-styles.css" />
  </head>
 
  <body id="level1">
    <img src="/static/logos/level1.png">
      <div>
"""
 
page_footer = """
    </div>
  </body>
</html>
"""
 
main_page_markup = """
<form action="" method="GET">
  <input id="query" name="query" value="Enter query here..."
    onfocus="this.value=''">
  <input id="button" type="submit" value="Search">
</form>
"""

@app.route('/')
def main(methods=['GET']):
    query = request.args.get('query', None)
    if query is None:
        html_text = render_template_string(page_header + main_page_markup + page_footer)
    else:
        message = "Sorry, no results were found for <b>" + query + "</b>."
        message += " <a href='?'>Try again</a>."
        html_text = render_template_string(page_header + message + page_footer)
    resp = make_response(html_text, 200)
    resp.headers['X-XSS-Protection'] = '0'

    return resp

if __name__ == "__main__":
    Flask.run(app, debug=False)
