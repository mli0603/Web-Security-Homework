from flask import Flask
from flask import render_template_string, render_template
from flask import request, make_response
import html

app = Flask(__name__)
@app.route('/')
@app.route('/welcome')
def main():
    return render_template('welcome.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/confirm')
def confirm():
    return render_template('confirm.html')

if __name__ == "__main__":
    Flask.run(app, debug=False)