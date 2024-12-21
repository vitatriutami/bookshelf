const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

// Fungsi untuk mengecek dukungan localStorage
function isStorageAvailable() {
  return typeof Storage !== "undefined";
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
  if (isStorageAvailable()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } else {
    alert("Browser Anda tidak mendukung local storage.");
  }
}

// Fungsi untuk memuat data dari localStorage
function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
}

// Fungsi untuk membuat elemen buku
function createBookElement(book) {
  const { id, title, author, isCompleted } = book;

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;

  const authorElement = document.createElement("p");
  authorElement.textContent = `Penulis: ${author}`;

  const container = document.createElement("div");
  container.classList.add("book-item");
  container.append(titleElement, authorElement);
  container.setAttribute("data-id", id);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("actions");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("p-2 bg-red-500 text-white")
  deleteButton.textContent = "Hapus";
  deleteButton.addEventListener("click", () => {
    removeBook(id);
  });

  buttonContainer.append(deleteButton);

  if (!isCompleted) {
    const markCompleteButton = document.createElement("button");
    markCompleteButton.textContent = "Selesai";
    markCompleteButton.addEventListener("click", () => {
      markBookAsCompleted(id);
    });
    buttonContainer.append(markCompleteButton);
  } else {
    const markUncompleteButton = document.createElement("button");
    markUncompleteButton.textContent = "Belum Selesai";
    markUncompleteButton.addEventListener("click", () => {
      markBookAsUncompleted(id);
    });
    buttonContainer.append(markUncompleteButton);
  }

  container.append(buttonContainer);
  return container;
}

// Fungsi untuk menampilkan buku
function renderBooks() {
  const uncompletedBookList = document.getElementById("incompleteBookList");
  const completedBookList = document.getElementById("completeBookList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isCompleted) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
}

// Fungsi untuk menambahkan buku baru
function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const id = +new Date();

  const newBook = {
    id,
    title,
    author,
    isCompleted: false,
  };

  books.push(newBook);
  saveData();
  renderBooks();

  // Reset form
  document.getElementById("bookForm").reset();
}

// Fungsi untuk menghapus buku
function removeBook(id) {
  books = books.filter((book) => book.id !== id);
  saveData();
  renderBooks();
}

// Fungsi untuk menandai buku selesai
function markBookAsCompleted(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isCompleted = true;
    saveData();
    renderBooks();
  }
}

// Fungsi untuk mengembalikan buku ke status belum selesai
function markBookAsUncompleted(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isCompleted = false;
    saveData();
    renderBooks();
  }
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
  // Year picker
  const input = document.getElementById("bookFormYear");
  const yearDropdown = document.createElement("select");
  yearDropdown.className = input.className;

  const currentYear = new Date().getFullYear();
  for (let year = 1900; year <= currentYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearDropdown.appendChild(option);
  }

  input.replaceWith(yearDropdown);

  //   BOOK FORM
  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", addBook);

  if (isStorageAvailable()) {
    loadData();
  }
  renderBooks();
});

//
//
//
//
