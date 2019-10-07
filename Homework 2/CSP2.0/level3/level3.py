from flask import Flask
from flask import render_template_string, render_template
from flask import request, make_response
import html

app = Flask(__name__)
@app.route('/')
def main():
    return render_template('index.html')

if __name__ == "__main__":
    Flask.run(app, debug=False)