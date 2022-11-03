from flask import Flask, render_template, jsonify, make_response, request
import json, os

app = Flask("scripts")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/booklist/add")
def booklist_add():
    return make_response(jsonify({"status": True}))


@app.route("/api/books", methods=["GET"])
def books():
    """
    Reads the entries in the file containing the book list entries in the data
    folder then formats the results into a JSON response object and returns the
    JSON response object
    """
    print("getting books on api")

    root_path = os.path.realpath(os.path.dirname(__file__))
    file_path = os.path.join(root_path, "data", "books.json")

    with open(file_path, "r") as file:
        file_contents = json.load(file)

        response = make_response(file_contents, 200)
        return response

    return "Error reading file"


@app.route("/api/books", methods=["PUT"])
def upload():
    """
    Receives json data from the request object
    and saves it into the journal.json file then
    returns the JSON response object
    """
    print("saving Books on api")

    json_data = request.json

    root_path = os.path.realpath(os.path.dirname(__file__))
    file_path = os.path.join(root_path, "data", "books.json")

    with open(file_path, "w") as file:
        json.dump(json_data, file)

        return make_response("Complete", 200)

    return "Error reading file", 500


@app.route("/api/booksearch", methods=["GET"])
def searchBooks():
    """
    Reads the entries in the file containing the book list entries in the data
    folder then formats the results into a JSON response object and returns the
    JSON response object
    """
    print("searching books on api")

    root_path = os.path.realpath(os.path.dirname(__file__))
    file_path = os.path.join(root_path, "data", "books.json")

    with open(file_path, "r") as file:
        file_contents = json.load(file)

        response = make_response(file_contents, 200)
        return response

    return "Error reading file"


app.run(host="0.0.0.0", port=8080)
