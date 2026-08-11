const API_BASE_URL = "http://localhost:8080";

const API_KEY = "library123";

async function apiRequest(endpoint, options = {}) {

    const config = {
        ...options,

        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            ...(options.headers || {})
        }
    };

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        config
    );

    if (!response.ok) {

        let errorMessage = `Request failed: ${response.status}`;

        try {
            const text = await response.text();

            if (text) {
                errorMessage = text;
            }

        } catch (error) {
            console.error(error);
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return response.text();
}


/* ================= BOOK API ================= */

async function getAllBooks() {

    return apiRequest("/books");
}


async function getBookById(id) {

    return apiRequest(`/books/${id}`);
}


async function addBook(book) {

    return apiRequest("/books", {

        method: "POST",

        body: JSON.stringify(book)
    });
}


async function updateBook(id, book) {

    return apiRequest(`/books/${id}`, {

        method: "PUT",

        body: JSON.stringify(book)
    });
}


async function deleteBook(id) {

    return apiRequest(`/books/${id}`, {

        method: "DELETE"
    });
}


async function searchBooks(title) {

    return apiRequest(
        `/books/search?title=${encodeURIComponent(title)}`
    );
}