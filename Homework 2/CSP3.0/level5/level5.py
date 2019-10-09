from flask import Flask
from flask import render_template_string, render_template
from flask import request, make_response
import html

app = Flask(__name__)
@app.route('/')
@app.route('/welcome')
def main():
    html_text = render_template('welcome.html')
    resp = make_response(html_text, 200)
    resp.headers['Content-Security-Policy'] = "connect-src 'self';"
    return resp

@app.route('/signup')
def signup():
    html_text = render_template('signup.html')
    resp = make_response(html_text, 200)
    resp.headers['Content-Security-Policy'] = "script-src 'self' 'nonce-2726c7f26c'; connect-src 'self';"
    return resp

@app.route('/confirm')
def confirm():
    html_text = render_template('confirm.html')
    resp = make_response(html_text, 200)
    resp.headers['Content-Security-Policy'] = "script-src 'self' 'nonce-2726c7f26c';"
    return resp

if __name__ == "__main__":
    Flask.run(app, debug=False)