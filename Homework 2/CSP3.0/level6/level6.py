from flask import Flask
from flask import render_template_string, render_template
from flask import request, make_response
import html

app = Flask(__name__)
@app.route('/')
def main():
    html_text = render_template('index.html')
    resp = make_response(html_text, 200)
    resp.headers['Content-Security-Policy'] = "script-src 'self' 'nonce-2726c7f26c';"
    return resp

if __name__ == "__main__":
    Flask.run(app, debug=False)