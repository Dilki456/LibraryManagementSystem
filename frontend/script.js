let books = [];

let editingBookId = null;

let deletingBookId = null;

let searchTimeout = null;


/* ================= INITIAL LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {

    loadBooks();

});


/* ================= LOAD BOOKS ================= */

async function loadBooks() {

    try {

        setApiStatus("Connecting...");

        books = await getAllBooks();

        if (!Array.isArray(books)) {
            books = [];
        }

        renderBooks();

        updateDashboard();

        renderRecentBooks();

        setApiStatus("Connected");

    } catch (error) {

        console.error(error);

        setApiStatus("Connection failed");

        showToast(
            "Error",
            "Cannot connect to Book Service.",
            "error"
        );

        renderEmptyState(
            "Unable to load books. Make sure Book Service is running."
        );
    }
}


/* ================= API STATUS ================= */

function setApiStatus(status) {

    const element = document.getElementById("apiStatus");

    if (element) {
        element.textContent = status;
    }
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const total = books.length;

    const totalQuantity = books.reduce(
        (sum, book) =>
            sum + Number(book.quantity || 0),
        0
    );

    const available = books.reduce(
        (sum, book) =>
            sum + Number(book.availableCopies || 0),
        0
    );

    const categories = new Set(
        books
            .map(book => book.category)
            .filter(Boolean)
    );

    document.getElementById("totalBooks")
        .textContent = total;

    document.getElementById("totalQuantity")
        .textContent = totalQuantity;

    document.getElementById("availableCopies")
        .textContent = available;

    document.getElementById("totalCategories")
        .textContent = categories.size;
}


/* ================= RENDER BOOKS ================= */

function renderBooks(bookList = books) {

    const tbody =
        document.getElementById("booksTableBody");

    if (!tbody) return;

    if (!bookList.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML = bookList.map(book => {

        const available =
            Number(book.availableCopies || 0);

        const quantity =
            Number(book.quantity || 0);

        const statusClass =
            available > 0
                ? "available"
                : "unavailable";

        const statusText =
            available > 0
                ? `${available} Available`
                : "Out of Stock";


        return `
            <tr>

                <td>
                    <div class="book-title">
                        ${escapeHtml(book.title || "-")}
                    </div>

                    <div class="book-author">
                        Book ID: ${escapeHtml(book.id || "-")}
                    </div>
                </td>


                <td>
                    ${escapeHtml(book.author || "-")}
                </td>


                <td>
                    <span class="badge">
                        ${escapeHtml(book.category || "-")}
                    </span>
                </td>


                <td>
                    ${escapeHtml(book.isbn || "-")}
                </td>


                <td>
                    ${quantity}
                </td>


                <td>
                    <span class="${statusClass}">
                        ${statusText}
                    </span>
                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="action-button"
                            onclick="openEditBookModal('${book.id}')"
                            title="Edit"
                        >
                            ✏️
                        </button>


                        <button
                            class="action-button delete"
                            onclick="openDeleteModal('${book.id}')"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");
}


/* ================= RECENT BOOKS ================= */

function renderRecentBooks() {

    const container =
        document.getElementById("recentBooks");

    if (!container) return;

    const recent =
        [...books].slice(-5).reverse();


    if (!recent.length) {

        container.innerHTML = `
            <div class="loading">
                No books available.
            </div>
        `;

        return;
    }


    container.innerHTML = recent.map(book => {

        return `
            <div class="recent-book">

                <div class="book-info">

                    <div class="book-cover">
                        📖
                    </div>

                    <div>
                        <strong>
                            ${escapeHtml(book.title || "-")}
                        </strong>

                        <span>
                            ${escapeHtml(book.author || "-")}
                        </span>
                    </div>

                </div>

                <span class="badge">
                    ${escapeHtml(book.category || "-")}
                </span>

            </div>
        `;

    }).join("");
}


/* ================= NAVIGATION ================= */

function showSection(sectionId, button = null) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    const section =
        document.getElementById(sectionId);

    if (section) {
        section.classList.add("active");
    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {
        button.classList.add("active");
    }


    const title =
        document.getElementById("pageTitle");

    const subtitle =
        document.getElementById("pageSubtitle");


    if (sectionId === "dashboard") {

        title.textContent = "Dashboard";

        subtitle.textContent =
            "Manage your library books efficiently.";

    } else {

        title.textContent = "Books";

        subtitle.textContent =
            "View, search and manage your books.";

        renderBooks();
    }
}


/* ================= ADD BOOK ================= */

function openAddBookModal() {

    editingBookId = null;

    document.getElementById("modalTitle")
        .textContent = "Add New Book";

    document.getElementById("modalSubtitle")
        .textContent = "Enter the book details below.";

    document.getElementById("saveButton")
        .textContent = "Save Book";

    document.getElementById("bookForm")
        .reset();

    document.getElementById("bookId")
        .value = "";

    document
        .getElementById("bookModal")
        .classList.add("show");
}


/* ================= EDIT BOOK ================= */

async function openEditBookModal(id) {

    try {

        const book = await getBookById(id);

        editingBookId = id;

        document.getElementById("modalTitle")
            .textContent = "Edit Book";

        document.getElementById("modalSubtitle")
            .textContent =
            "Update the book information.";

        document.getElementById("saveButton")
            .textContent = "Update Book";


        document.getElementById("bookId")
            .value = book.id || "";

        document.getElementById("title")
            .value = book.title || "";

        document.getElementById("author")
            .value = book.author || "";

        document.getElementById("category")
            .value = book.category || "";

        document.getElementById("isbn")
            .value = book.isbn || "";

        document.getElementById("quantity")
            .value = book.quantity ?? 0;

        document.getElementById("availableCopies")
            .value = book.availableCopies ?? 0;


        document
            .getElementById("bookModal")
            .classList.add("show");

    } catch (error) {

        console.error(error);

        showToast(
            "Error",
            "Unable to load book details.",
            "error"
        );
    }
}


/* ================= SAVE BOOK ================= */

async function saveBook(event) {

    event.preventDefault();

    const book = {

        title:
            document.getElementById("title")
                .value.trim(),

        author:
            document.getElementById("author")
                .value.trim(),

        category:
            document.getElementById("category")
                .value.trim(),

        isbn:
            document.getElementById("isbn")
                .value.trim(),

        quantity:
            Number(
                document.getElementById("quantity")
                    .value
            ),

        availableCopies:
            Number(
                document.getElementById("availableCopies")
                    .value
            )
    };


    if (book.availableCopies > book.quantity) {

        showToast(
            "Validation Error",
            "Available copies cannot exceed quantity.",
            "error"
        );

        return;
    }


    setLoading(true);


    try {

        if (editingBookId) {

            await updateBook(
                editingBookId,
                book
            );

            showToast(
                "Success",
                "Book updated successfully."
            );

        } else {

            await addBook(book);

            showToast(
                "Success",
                "Book added successfully."
            );
        }


        closeBookModal();

        await loadBooks();

    } catch (error) {

        console.error(error);

        showToast(
            "Error",
            error.message || "Operation failed.",
            "error"
        );

    } finally {

        setLoading(false);
    }
}


/* ================= DELETE ================= */

function openDeleteModal(id) {

    deletingBookId = id;

    document
        .getElementById("deleteModal")
        .classList.add("show");
}


function closeDeleteModal() {

    deletingBookId = null;

    document
        .getElementById("deleteModal")
        .classList.remove("show");
}


async function confirmDelete() {

    if (!deletingBookId) return;

    setLoading(true);


    try {

        await deleteBook(deletingBookId);

        showToast(
            "Success",
            "Book deleted successfully."
        );

        closeDeleteModal();

        await loadBooks();

    } catch (error) {

        console.error(error);

        showToast(
            "Error",
            error.message || "Unable to delete book.",
            "error"
        );

    } finally {

        setLoading(false);
    }
}


/* ================= CLOSE BOOK MODAL ================= */

function closeBookModal() {

    document
        .getElementById("bookModal")
        .classList.remove("show");

    document
        .getElementById("bookForm")
        .reset();

    editingBookId = null;
}


/* ================= SEARCH ================= */

function handleSearch() {

    const input =
        document.getElementById("searchInput");

    const title = input.value.trim();

    const clearButton =
        document.getElementById("clearSearch");


    clearButton.style.display =
        title ? "block" : "none";


    clearTimeout(searchTimeout);


    searchTimeout = setTimeout(
        async () => {

            if (!title) {

                renderBooks(books);

                return;
            }


            try {

                const result =
                    await searchBooks(title);

                books =
                    Array.isArray(result)
                        ? result
                        : [];

                renderBooks(books);

            } catch (error) {

                console.error(error);

                showToast(
                    "Search Error",
                    "Unable to search books.",
                    "error"
                );
            }

        },
        350
    );
}


function clearSearch() {

    document
        .getElementById("searchInput")
        .value = "";

    document
        .getElementById("clearSearch")
        .style.display = "none";

    loadBooks();
}


/* ================= HELPERS ================= */

function renderEmptyState(message) {

    const tbody =
        document.getElementById("booksTableBody");

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="loading">
                ${escapeHtml(message)}
            </td>
        </tr>
    `;
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ================= TOAST ================= */

function showToast(
    title,
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");

    const icon =
        document.getElementById("toastIcon");

    document.getElementById("toastTitle")
        .textContent = title;

    document.getElementById("toastMessage")
        .textContent = message;


    if (type === "error") {

        icon.textContent = "!";
        icon.style.color = "#ef4444";

    } else {

        icon.textContent = "✓";
        icon.style.color = "#22c55e";
    }


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);
}


/* ================= LOADING ================= */

function setLoading(status) {

    const loader =
        document.getElementById("globalLoading");

    if (status) {

        loader.classList.add("show");

    } else {

        loader.classList.remove("show");
    }
}


/* ================= MODAL CLICK OUTSIDE ================= */

document.addEventListener("click", event => {

    const bookModal =
        document.getElementById("bookModal");

    const deleteModal =
        document.getElementById("deleteModal");


    if (
        event.target === bookModal
    ) {

        closeBookModal();
    }


    if (
        event.target === deleteModal
    ) {

        closeDeleteModal();
    }

});