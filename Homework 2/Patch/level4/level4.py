from flask import Flask
from flask import render_template_string, render_template
from flask import request, make_response
import html

app = Flask(__name__)
@app.route('/')
def main(methods=['GET']):
    timer = request.args.get('timer', None)
    if timer is None:
        return render_template('index.html')
    else:
        return render_template('timer.html', timer=timer)

if __name__ == "__main__":
    Flask.run(app, debug=False)