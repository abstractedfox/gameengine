from flask import Flask
from flask import render_template
import os

app = Flask(__name__, static_folder = "static")

@app.route("/")
def index():
    return render_template("/index.html")

@app.route("/audio")
def getAudioFiles():
    result = []
    extensions = [".mp3", ".wav"]
    for file in os.listdir("./static/program"):
        if file[-4:] in extensions:
            result.append(file)
    output = ""
    for a in result:
        output += "|" + str(a)
    #result = [(str(x) + "|") for x in result]
    result = [(str(x)) for x in result]
    return output
