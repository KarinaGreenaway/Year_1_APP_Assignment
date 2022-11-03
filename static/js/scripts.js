/** 
* The event handlers 
*/
document.getElementById("bookEntries").addEventListener('click', populateBook);
document.getElementById("bookResults").addEventListener('click', populateBook);
document.getElementById("btnAddBook").addEventListener('click', addBook);
document.getElementById("btnDeleteBook").addEventListener('click', deleteBook);
document.getElementById("btnSaveBooks").addEventListener('click', uploadBooks);


/** 
* Initialise book list 
*/
document.addEventListener("DOMContentLoaded", function() {
    console.log("calling getBookEntries")
    getBookEntries();
});

/** 
* Utility functions 
*/
function getUniqueKey() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

/**
 * Fills in the book list.
 */
function getBookEntries() {
    console.log("getting book entries");
    let list = document.getElementById("bookEntries")

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        let response = ""

        if (this.readyState == 4 & this.status == 200) {
            
            response = JSON.parse(this.responseText).books;

            let htmlString = "";
            let counter = 0;
            for (item of response) {
                counter++;
                htmlString += "<li id='item" + counter + "' data-date='" + item.date + "' data-title='" + item.title + "' data-author='" + item.author + "' data-note='" + item.note + "'><i>" + item.date + " </i><strong>" + item.title + "</strong><i>" + item.author + " </i>" + item.note + "</li>";
            }
            list.innerHTML = htmlString;

        } else if (this.readyState == 4 & this.status != 200) {
            response = "Error: " + this.statusText;
            alert(response);
        }
    }

    request.open("GET", "/api/books", true);
    request.send();
}
/**
 * Clears the selected book.
 */
function clearBooks() {
    document.getElementById("idEntry").value = "";
    document.getElementById("dateEntry").value = "";
    document.getElementById("titleEntry").value = "";
    document.getElementById("authorEntry").value = "";
    document.getElementById("notesEntry").value = "";
}

/**
 * Clears the add book section.
 */
function clearAddBooks() {
    document.getElementById("idAdd").value = "";
    document.getElementById("dateAdd").value = "";
    document.getElementById("titleAdd").value = "";
    document.getElementById("authorAdd").value = "";
    document.getElementById("notesAdd").value = "";
}

/**
 * Populates the selected book section.
 * @param {Event} Event object - e
 */
function populateBook(e) {
  
    clearBooks();

    let id = e.target.id;
    let element = document.getElementById(id);

    document.getElementById("idEntry").value = id;
    document.getElementById("dateEntry").value = element.getAttribute("data-date");
    document.getElementById("titleEntry").value = element.getAttribute("data-title");
    document.getElementById("authorEntry").value = element.getAttribute("data-author");
    document.getElementById("notesEntry").value = element.getAttribute("data-note");
}
/**
 * Adds book to the book list.
 */
function addBook() {

    console.log("Add entry");
    let uid = getUniqueKey();
    let rawDate = new Date();
    let date = rawDate.getFullYear() + "-" + (rawDate.getMonth() + 1) + "-" + rawDate.getDate();
    let title = document.getElementById("titleAdd").value;
    let author = document.getElementById("authorAdd").value;
    let note = document.getElementById("notesAdd").value;

    let htmlString = "<li id='" + uid + "' data-date='" + date + "' data-title='" + title + "' data-author='" + author + "' data-note='" + note + "'><i>" + date + " </i><strong>" + title + "</strong><i>" + author + " </i>" + note + "</li>";

    let list = document.getElementById("bookEntries");
    list.innerHTML = list.innerHTML + htmlString;
    clearAddBooks();
    alert("Book added succesfully");
}

/**
 * Deletes book from the booklist.
 */
function deleteBook() {
    console.log("Delete entry");
    let id = document.getElementById("idEntry").value;

    document.getElementById(id).remove();

    clearBooks();
    alert("Book deleted succesfully");
}

/**
 * Uploads the book list, updating the JSON file.
 */
function uploadBooks() {
    console.log("Upload books");


    let list = document.getElementById("bookEntries");
    let items = list.getElementsByTagName("li");

    let jsonObject = {
        books: []
    }

    for (item of items) {
        let date = item.getAttribute("data-date");
        let title = item.getAttribute("data-title");
        let author = item.getAttribute("data-author");
        let note = item.getAttribute("data-note");

        let obj = {
            date: date,
            title: title,
            author: author,
            note: note
        };

        jsonObject.books.push(obj);
    }

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        let response = ""

        if (this.readyState == 4 & this.status == 200) {
            alert("Booklist saved successfully");
            clearBooks();

        } else if (this.readyState == 4 & this.status != 200) {
            response = "Error: " + this.statusText;
            alert(response);
        }
    }
    clearBooks();
    request.open("PUT", "/api/books", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(jsonObject));
}


/**
 * Searches for a book by title or author.
 */
function searchBook() {
    console.log("searching book entries");
    let list = document.getElementById("bookResults");

    let request = new XMLHttpRequest();

    let entry = document.getElementById("search").value;


    request.onreadystatechange = function() {

        let books = "";
        let htmlString = "";
        let isBookFound = "We can't find your book. Make sure you have searched by Title OR by Author."

        if (this.readyState == 4 & this.status == 200) {

            books = JSON.parse(this.responseText).books;

            for (item of books) {
                if (item.title.toUpperCase() === entry.toUpperCase() || item.author.toUpperCase() === entry.toUpperCase()) {
                    let uid = getUniqueKey();
                    htmlString += "<li id=" + uid + "' data-date='" + item.date + "' data-title='" + item.title + "' data-author='" + item.author + "' data-note='" + item.note + "'><i>" + item.date + " </i><strong>" + item.title + "</strong><i>" + item.author + " </i>" + item.note + "</li>";
                    isBookFound = "Book entry found! Your selected book will be shown in your search results."
                }
            }
            list.innerHTML = htmlString;
            alert(isBookFound);

        } else if (this.readyState == 4 & this.status != 200) {
            response = "Error: " + this.statusText;
            alert(response);
        }
    }

    request.open("GET", "/api/booksearch", true);
    request.send();
}