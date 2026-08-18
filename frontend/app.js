/* =========================================================
   LIBRARYOS â€” PROFESSIONAL FRONTEND
   API Gateway: http://localhost:8085
   ========================================================= */

const API = "http://localhost:8085";

const state = {
    books: [],
    users: [],
    borrows: [],
    notifications: []
};


/* =========================================================
   API KEY
   ========================================================= */

function getApiKey() {
    return localStorage.getItem("libraryApiKey") || "library123";
}


function setApiKey(value) {
    if (value && value.trim()) {
        localStorage.setItem("libraryApiKey", value.trim());
    }
}


function ensureApiKey() {

    let apiKey = getApiKey();

    if (!apiKey) {

        apiKey = prompt(
            "Enter your Library Management API Key:"
        );

        if (apiKey && apiKey.trim()) {
            setApiKey(apiKey);
            return apiKey.trim();
        }
    }

    return apiKey;
}


/* =========================================================
   HEADERS
   ========================================================= */

function headers(json = false) {

    const h = {};

    const apiKey = getApiKey();

    if (apiKey) {
        h["X-API-KEY"] = apiKey;
    }

    if (json) {
        h["Content-Type"] = "application/json";
    }

    return h;
}


/* =========================================================
   API REQUEST
   ========================================================= */

async function api(path, options = {}) {

    const isJson =
        options.body !== undefined &&
        !(options.body instanceof FormData);

    let apiKey = getApiKey();

    /*
     * Most protected endpoints require API key.
     * If none exists, ask once.
     */
    if (!apiKey && !path.startsWith("/auth/")) {
        apiKey = ensureApiKey();
    }

    const requestHeaders = {
        ...headers(isJson),
        ...(options.headers || {})
    };

    if (apiKey) {
        requestHeaders["X-API-KEY"] = apiKey;
    }

    const response = await fetch(API + path, {
        ...options,
        headers: requestHeaders
    });

    const text = await response.text();

    let data = text;

    try {
        data = text ? JSON.parse(text) : null;
    } catch (_) {
        // Response is plain text
    }

    if (!response.ok) {

        if (response.status === 401) {

            localStorage.removeItem("libraryApiKey");

            throw new Error(
                "Invalid or missing API Key. Please refresh and enter a valid key."
            );
        }

        if (response.status === 403) {
            throw new Error(
                "Access denied. Please check your API key and permissions."
            );
        }

        throw new Error(
            (data && data.message) ||
            (data && data.error) ||
            text ||
            `HTTP ${response.status}`
        );
    }

    return data;
}


/* =========================================================
   TOAST
   ========================================================= */

function toast(message) {

    const element =
        document.getElementById("toast");

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");

    setTimeout(() => {
        element.classList.remove("show");
    }, 2500);
}


/* =========================================================
   SECTION NAVIGATION
   ========================================================= */

function showSection(id) {

    document
        .querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    const target =
        document.getElementById(id);

    if (!target) return;

    target.classList.add("active");

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === id
            );
        });


    /*
     * Load data when entering a section
     */
    if (id === "dashboard") {
        loadDashboard();
    }

    if (id === "books") {
        loadBooks();
    }

    if (id === "users") {
        loadUsers();
    }

    if (id === "borrows") {
        loadBorrows();
    }

    if (id === "notifications") {
        loadNotifications();
    }

    /*
     * Close mobile sidebar
     */
    const sidebar =
        document.querySelector(".sidebar");

    if (sidebar) {
        sidebar.classList.remove("open");
    }
}


/* =========================================================
   NAVIGATION EVENTS
   ========================================================= */

document
    .querySelectorAll("[data-section]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const section =
                button.dataset.section;

            if (section) {
                showSection(section);
            }
        });
    });


/* =========================================================
   MOBILE MENU
   ========================================================= */

const mobileMenu =
    document.getElementById("mobileMenu");

if (mobileMenu) {

    mobileMenu.addEventListener("click", () => {

        document
            .querySelector(".sidebar")
            ?.classList.toggle("open");

    });
}


/* =========================================================
   REFRESH BUTTON
   ========================================================= */

const refreshBtn =
    document.getElementById("refreshBtn");

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async () => {

            toast("Refreshing library data...");

            await loadDashboard();

            toast("Dashboard refreshed");
        }
    );
}


/* =========================================================
   DASHBOARD
   ========================================================= */

async function loadDashboard() {

    try {

        /*
         * Load each service independently.
         *
         * This prevents one failed microservice
         * from breaking the entire dashboard.
         */

        const results =
            await Promise.allSettled([

                api("/books"),

                api("/users"),

                api("/api/borrow"),

                api("/api/notifications")

            ]);


        state.books =
            results[0].status === "fulfilled"
                ? results[0].value || []
                : [];

        state.users =
            results[1].status === "fulfilled"
                ? results[1].value || []
                : [];

        state.borrows =
            results[2].status === "fulfilled"
                ? results[2].value || []
                : [];

        state.notifications =
            results[3].status === "fulfilled"
                ? results[3].value || []
                : [];


        updateDashboardCounts();


        /*
         * Show API problems only when needed.
         */

        const failed =
            results.filter(
                item => item.status === "rejected"
            );

        if (failed.length === 4) {

            toast(
                "Unable to connect to API Gateway :8085"
            );

        } else if (failed.length > 0) {

            console.warn(
                "Some services could not be loaded:",
                failed
            );
        }


    } catch (error) {

        console.error(error);

        toast(
            "Dashboard error: " +
            error.message
        );
    }
}


/* =========================================================
   DASHBOARD COUNTS
   ========================================================= */

function updateDashboardCounts() {

    const bookCount =
        document.getElementById("bookCount");

    const userCount =
        document.getElementById("userCount");

    const borrowCount =
        document.getElementById("borrowCount");

    const notificationCount =
        document.getElementById("notificationCount");


    if (bookCount) {
        bookCount.textContent =
            state.books.length;
    }

    if (userCount) {
        userCount.textContent =
            state.users.length;
    }

    if (borrowCount) {
        borrowCount.textContent =
            state.borrows.length;
    }

    if (notificationCount) {
        notificationCount.textContent =
            state.notifications.length;
    }


    const sideBookCount =
        document.getElementById("sideBookCount");

    if (sideBookCount) {
        sideBookCount.textContent =
            state.books.length;
    }


    const sideNotificationCount =
        document.getElementById(
            "sideNotificationCount"
        );

    if (sideNotificationCount) {
        sideNotificationCount.textContent =
            state.notifications.length;
    }
}


/* =========================================================
   BOOKS
   ========================================================= */

async function loadBooks() {

    const container =
        document.getElementById("booksTable");

    if (!container) return;

    container.innerHTML = `
        <div style="padding:25px;text-align:center;color:#8a9790">
            Loading books...
        </div>
    `;


    try {

        const search =
            document
                .getElementById("bookSearch")
                ?.value
                ?.trim() || "";


        let books;


        if (search) {

            books =
                await api(
                    "/books/search?title=" +
                    encodeURIComponent(search)
                );

        } else {

            books =
                await api("/books");
        }


        state.books =
            Array.isArray(books)
                ? books
                : [];


        updateDashboardCounts();

        renderBooks();


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div style="
                padding:25px;
                color:#b13e45;
            ">
                Could not load books:
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


/* =========================================================
   RENDER BOOKS
   ========================================================= */

function renderBooks() {

    const container =
        document.getElementById("booksTable");

    if (!container) return;


    const rows =
        state.books
            .map(book => {

                const available =
                    Number(book.availableCopies || 0);

                const quantity =
                    Number(book.quantity || 0);


                let status = "Available";

                if (available <= 0) {
                    status = "Unavailable";
                } else if (
                    available < quantity
                ) {
                    status = "Limited";
                }


                return `
                    <tr>

                        <td>
                            <b>
                                ${escapeHtml(book.title)}
                            </b>

                            <br>

                            <small>
                                ${escapeHtml(
                                    book.author || ""
                                )}
                            </small>
                        </td>


                        <td>
                            ${escapeHtml(
                                book.category || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                book.isbn || "-"
                            )}
                        </td>


                        <td>
                            ${quantity}
                        </td>


                        <td>
                            <span class="tag">
                                ${available} available
                            </span>
                        </td>


                        <td>
                            <span class="tag">
                                ${status}
                            </span>
                        </td>


                        <td>

                            <div class="row-actions">

                                <button
                                    class="small-btn"
                                    onclick="editBook('${book.id}')"
                                >
                                    Edit
                                </button>


                                <button
                                    class="small-btn danger"
                                    onclick="deleteBook('${book.id}')"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            })
            .join("");


    container.innerHTML = `

        <table class="data-table">

            <thead>

                <tr>

                    <th>Book</th>

                    <th>Category</th>

                    <th>ISBN</th>

                    <th>Qty</th>

                    <th>Available</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

            </thead>


            <tbody>

                ${
                    rows ||
                    `
                    <tr>
                        <td colspan="7">
                            No books found.
                        </td>
                    </tr>
                    `
                }

            </tbody>

        </table>
    `;
}


/* =========================================================
   BOOK MODAL
   ========================================================= */

function openBookModal(book = null) {

    const modal =
        document.getElementById("bookModal");

    if (!modal) return;


    document.getElementById("bookId").value =
        book?.id || "";


    document.getElementById("bookTitle").value =
        book?.title || "";


    document.getElementById("bookAuthor").value =
        book?.author || "";


    document.getElementById("bookCategory").value =
        book?.category || "";


    document.getElementById("bookIsbn").value =
        book?.isbn || "";


    document.getElementById("bookQuantity").value =
        book?.quantity ?? 0;


    document.getElementById("bookAvailable").value =
        book?.availableCopies ?? 0;


    modal.showModal();
}


/* =========================================================
   ADD BOOK
   ========================================================= */

const addBookBtn =
    document.getElementById("addBookBtn");

if (addBookBtn) {

    addBookBtn.addEventListener(
        "click",
        () => openBookModal()
    );
}


/* =========================================================
   EDIT BOOK
   ========================================================= */

function editBook(id) {

    const book =
        state.books.find(
            item => item.id === id
        );

    if (book) {
        openBookModal(book);
    }
}


/* =========================================================
   SAVE BOOK
   ========================================================= */

const bookForm =
    document.getElementById("bookForm");

if (bookForm) {

    bookForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                document.getElementById(
                    "bookId"
                ).value.trim();


            const body = {

                title:
                    document
                        .getElementById(
                            "bookTitle"
                        )
                        .value
                        .trim(),

                author:
                    document
                        .getElementById(
                            "bookAuthor"
                        )
                        .value
                        .trim(),

                category:
                    document
                        .getElementById(
                            "bookCategory"
                        )
                        .value
                        .trim(),

                isbn:
                    document
                        .getElementById(
                            "bookIsbn"
                        )
                        .value
                        .trim(),

                quantity:
                    Number(
                        document
                            .getElementById(
                                "bookQuantity"
                            )
                            .value
                    ),

                availableCopies:
                    Number(
                        document
                            .getElementById(
                                "bookAvailable"
                            )
                            .value
                    )
            };


            try {

                await api(
                    id
                        ? "/books/" + id
                        : "/books",
                    {
                        method:
                            id ? "PUT" : "POST",

                        body:
                            JSON.stringify(body)
                    }
                );


                closeModal("bookModal");

                toast(
                    id
                        ? "Book updated successfully"
                        : "Book added successfully"
                );


                await loadBooks();


            } catch (error) {

                toast(
                    "Book save failed: " +
                    error.message
                );
            }
        }
    );
}


/* =========================================================
   DELETE BOOK
   ========================================================= */

async function deleteBook(id) {

    if (
        !confirm(
            "Are you sure you want to delete this book?"
        )
    ) {
        return;
    }


    try {

        await api(
            "/books/" + id,
            {
                method: "DELETE"
            }
        );


        toast(
            "Book deleted successfully"
        );


        await loadBooks();


    } catch (error) {

        toast(
            "Delete failed: " +
            error.message
        );
    }
}


/* =========================================================
   BOOK SEARCH
   ========================================================= */

const bookSearchBtn =
    document.getElementById("bookSearchBtn");

if (bookSearchBtn) {

    bookSearchBtn.addEventListener(
        "click",
        loadBooks
    );
}


const bookSearch =
    document.getElementById("bookSearch");

if (bookSearch) {

    bookSearch.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                loadBooks();
            }
        }
    );
}


/* =========================================================
   MEMBERS
   ========================================================= */

async function loadUsers() {

    const container =
        document.getElementById("usersTable");

    if (!container) return;


    container.innerHTML = `
        <div style="
            padding:25px;
            text-align:center;
            color:#8a9790
        ">
            Loading members...
        </div>
    `;


    try {

        const users =
            await api("/users");


        state.users =
            Array.isArray(users)
                ? users
                : [];


        updateDashboardCounts();

        renderUsers();


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div style="
                padding:25px;
                color:#b13e45
            ">
                Could not load members:
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


/* =========================================================
   RENDER MEMBERS
   ========================================================= */

function renderUsers() {

    const container =
        document.getElementById("usersTable");

    if (!container) return;


    const rows =
        state.users
            .map(user => {

                return `
                    <tr>

                        <td>
                            <b>
                                ${escapeHtml(
                                    user.fullName ||
                                    "Unknown"
                                )}
                            </b>
                        </td>


                        <td>
                            ${escapeHtml(
                                user.email || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                user.phone || "-"
                            )}
                        </td>


                        <td>

                            <span class="tag">
                                ${escapeHtml(
                                    user.role ||
                                    "MEMBER"
                                )}
                            </span>

                        </td>


                        <td>

                            <button
                                class="small-btn danger"
                                onclick="deleteUser('${user.id}')"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>
                `;
            })
            .join("");


    container.innerHTML = `

        <table class="data-table">

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Role</th>

                    <th>Action</th>

                </tr>

            </thead>


            <tbody>

                ${
                    rows ||
                    `
                    <tr>
                        <td colspan="5">
                            No members found.
                        </td>
                    </tr>
                    `
                }

            </tbody>

        </table>
    `;
}


/* =========================================================
   REFRESH MEMBERS
   ========================================================= */

const refreshUsersBtn =
    document.getElementById(
        "refreshUsersBtn"
    );

if (refreshUsersBtn) {

    refreshUsersBtn.addEventListener(
        "click",
        loadUsers
    );
}


/* =========================================================
   DELETE MEMBER
   ========================================================= */

async function deleteUser(id) {

    if (
        !confirm(
            "Are you sure you want to delete this member?"
        )
    ) {
        return;
    }


    try {

        await api(
            "/users/" + id,
            {
                method: "DELETE"
            }
        );


        toast(
            "Member deleted successfully"
        );


        await loadUsers();


    } catch (error) {

        toast(
            "Delete failed: " +
            error.message
        );
    }
}


/* =========================================================
   BORROWING
   ========================================================= */

async function loadBorrows() {

    const container =
        document.getElementById(
            "borrowsTable"
        );

    if (!container) return;


    container.innerHTML = `
        <div style="
            padding:25px;
            text-align:center;
            color:#8a9790
        ">
            Loading borrow records...
        </div>
    `;


    try {

        const borrows =
            await api("/api/borrow");


        state.borrows =
            Array.isArray(borrows)
                ? borrows
                : [];


        updateDashboardCounts();

        renderBorrows();


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div style="
                padding:25px;
                color:#b13e45
            ">
                Could not load borrow records:
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


/* =========================================================
   RENDER BORROWS
   ========================================================= */

function renderBorrows() {

    const container =
        document.getElementById(
            "borrowsTable"
        );

    if (!container) return;


    const rows =
        state.borrows
            .map(borrow => {

                return `
                    <tr>

                        <td>
                            <small>
                                ${escapeHtml(
                                    borrow.id || "-"
                                )}
                            </small>
                        </td>


                        <td>
                            ${escapeHtml(
                                borrow.userId || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                borrow.bookId || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                borrow.borrowDate || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                borrow.dueDate || "-"
                            )}
                        </td>


                        <td>
                            <span class="tag">
                                ${escapeHtml(
                                    borrow.status ||
                                    "UNKNOWN"
                                )}
                            </span>
                        </td>


                        <td>
                            ${
                                borrow.returnDate
                                    ? escapeHtml(borrow.returnDate)
                                    : borrow.status === "BORROWED"
                                        ? `
                                            <button
                                                class="btn btn-small"
                                                onclick="returnBorrow('${borrow.id}')">
                                                Return
                                            </button>
                                          `
                                        : "—"
                            }
                        </td>

                    </tr>
                `;
            })
            .join("");


    container.innerHTML = `

        <table class="data-table">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>User</th>

                    <th>Book</th>

                    <th>Borrowed</th>

                    <th>Due</th>

                    <th>Status</th>

                    <th>Returned</th>

                </tr>

            </thead>


            <tbody>

                ${
                    rows ||
                    `
                    <tr>
                        <td colspan="7">
                            No borrow records.
                        </td>
                    </tr>
                    `
                }

            </tbody>

        </table>
    `;
}


/* =========================================================
   RETURN BORROW
   ========================================================= */

async function returnBorrow(id) {

    if (!id) {
        toast("Invalid borrow record");
        return;
    }

    const borrow =
        state.borrows.find(
            item => item.id === id
        );

    if (!borrow) {
        toast("Borrow record not found");
        return;
    }

    if (borrow.status === "RETURNED") {
        toast("This book has already been returned");
        return;
    }

    if (!confirm("Are you sure you want to return this book?")) {
        return;
    }

    try {

        const body = {

            userId: borrow.userId,

            bookId: borrow.bookId,

            borrowDate: borrow.borrowDate,

            dueDate: borrow.dueDate,

            returnDate:
                new Date()
                    .toISOString()
                    .slice(0, 10),

            status: "RETURNED"
        };

        await api(
            "/api/borrow/" + id,
            {
                method: "PUT",
                body: JSON.stringify(body)
            }
        );

        toast("Book returned successfully");

        await loadBorrows();

        await loadBooks();

    } catch (error) {

        toast(
            "Return failed: " +
            error.message
        );
    }
}


/* =========================================================
   NEW BORROW
   ========================================================= */

function openBorrowModal() {

    const modal =
        document.getElementById(
            "borrowModal"
        );

    if (!modal) return;


    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    const borrowDate =
        document.getElementById(
            "borrowDate"
        );

    if (borrowDate) {
        borrowDate.value = today;
    }


    modal.showModal();
}


const addBorrowBtn =
    document.getElementById(
        "addBorrowBtn"
    );

if (addBorrowBtn) {

    addBorrowBtn.addEventListener(
        "click",
        openBorrowModal
    );
}


/* =========================================================
   BORROW FORM
   ========================================================= */

const borrowForm =
    document.getElementById(
        "borrowForm"
    );

if (borrowForm) {

    borrowForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const body = {

                userId:
                    document
                        .getElementById(
                            "borrowUserId"
                        )
                        .value
                        .trim(),

                bookId:
                    document
                        .getElementById(
                            "borrowBookId"
                        )
                        .value
                        .trim(),

                borrowDate:
                    document
                        .getElementById(
                            "borrowDate"
                        )
                        .value,

                dueDate:
                    document
                        .getElementById(
                            "dueDate"
                        )
                        .value,

                status:
                    document
                        .getElementById(
                            "borrowStatus"
                        )
                        .value
            };


            try {

                await api(
                    "/api/borrow",
                    {
                        method: "POST",
                        body:
                            JSON.stringify(body)
                    }
                );


                closeModal(
                    "borrowModal"
                );


                toast(
                    "Borrow record created successfully"
                );


                await loadBorrows();


            } catch (error) {

                toast(
                    "Borrow failed: " +
                    error.message
                );
            }
        }
    );
}


/* =========================================================
   REFRESH BORROWS
   ========================================================= */

const refreshBorrowsBtn =
    document.getElementById(
        "refreshBorrowsBtn"
    );

if (refreshBorrowsBtn) {

    refreshBorrowsBtn.addEventListener(
        "click",
        loadBorrows
    );
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

async function loadNotifications() {

    const container =
        document.getElementById(
            "notificationsList"
        );

    if (!container) return;


    container.innerHTML = `
        <div style="
            padding:25px;
            text-align:center;
            color:#8a9790
        ">
            Loading notifications...
        </div>
    `;


    try {

        const notifications =
            await api(
                "/api/notifications"
            );


        state.notifications =
            Array.isArray(notifications)
                ? notifications
                : [];


        updateDashboardCounts();

        renderNotifications();


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div style="
                padding:25px;
                color:#b13e45
            ">
                Could not load notifications:
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


/* =========================================================
   RENDER NOTIFICATIONS
   ========================================================= */

function renderNotifications() {

    const container =
        document.getElementById(
            "notificationsList"
        );

    if (!container) return;


    if (!state.notifications.length) {

        container.innerHTML = `
            <div class="panel"
                style="padding:25px">
                No notifications available.
            </div>
        `;

        return;
    }


    container.innerHTML =
        state.notifications
            .map(notification => {

                return `

                    <div class="notification">

                        <strong>
                            ${escapeHtml(
                                notification.message ||
                                "Library notification"
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                notification.type ||
                                "INFO"
                            )}

                            Â· User

                            ${escapeHtml(
                                notification.userId ||
                                "System"
                            )}
                        </span>

                    </div>

                `;
            })
            .join("");
}


/* =========================================================
   REFRESH NOTIFICATIONS
   ========================================================= */

const refreshNotificationsBtn =
    document.getElementById(
        "refreshNotificationsBtn"
    );

if (refreshNotificationsBtn) {

    refreshNotificationsBtn.addEventListener(
        "click",
        loadNotifications
    );
}


/* =========================================================
   LOGIN
   ========================================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            try {

                const data =
                    await api(
                        "/auth/login",
                        {
                            method: "POST",

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })
                        }
                    );


                /*
                 * JWT is saved separately from API key.
                 */
                if (data?.token) {

                    localStorage.setItem(
                        "libraryToken",
                        data.token
                    );
                }


                const result =
                    document.getElementById(
                        "authResult"
                    );


                if (result) {

                    result.textContent =
                        `Logged in as ${
                            data?.email ||
                            email
                        }${
                            data?.role
                                ? " (" +
                                  data.role +
                                  ")"
                                : ""
                        }.`;
                }


                toast(
                    "Login successful"
                );
                showSection("dashboard");

            } catch (error) {

                const result =
                    document.getElementById(
                        "authResult"
                    );
             

                if (result) {

                    result.textContent =
                        "Login failed: " +
                        error.message;
                }


                toast(
                    "Login failed"
                );
            }
        }
    );
}


/* =========================================================
   REGISTER
   ========================================================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const body = {

                fullName:
                    document
                        .getElementById(
                            "regName"
                        )
                        .value
                        .trim(),

                email:
                    document
                        .getElementById(
                            "regEmail"
                        )
                        .value
                        .trim(),

                password:
                    document
                        .getElementById(
                            "regPassword"
                        )
                        .value,

                phone:
                    document
                        .getElementById(
                            "regPhone"
                        )
                        .value
                        .trim(),

                role:
                    document
                        .getElementById(
                            "regRole"
                        )
                        .value
            };


            try {

                const data =
                    await api(
                        "/auth/register",
                        {
                            method: "POST",

                            body:
                                JSON.stringify(body)
                        }
                    );


                const result =
                    document.getElementById(
                        "authResult"
                    );


                if (result) {

                    result.textContent =
                        `Account created for ${
                            data?.fullName ||
                            body.fullName
                        }.`;
                }


                toast(
                    "Registration successful"
                );


                registerForm.reset();


            } catch (error) {

                const result =
                    document.getElementById(
                        "authResult"
                    );


                if (result) {

                    result.textContent =
                        "Registration failed: " +
                        error.message;
                }


                toast(
                    "Registration failed"
                );
            }
        }
    );
}


/* =========================================================
   CLOSE MODALS
   ========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {
        modal.close();
    }
}


document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                closeModal(
                    button.dataset.close
                );

            }
        );
    });


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        character => {

            const map = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return map[character];
        }
    );
}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

const globalSearch =
    document.getElementById(
        "globalSearch"
    );

if (globalSearch) {

    globalSearch.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Enter") {
                return;
            }


            const query =
                globalSearch.value
                    .trim()
                    .toLowerCase();


            if (!query) return;


            /*
             * Search books first.
             */

            const matchingBook =
                state.books.find(book => {

                    return (
                        String(
                            book.title || ""
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            book.author || ""
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            book.isbn || ""
                        )
                        .toLowerCase()
                        .includes(query)
                    );
                });


            if (matchingBook) {

                showSection("books");

                const search =
                    document.getElementById(
                        "bookSearch"
                    );

                if (search) {
                    search.value =
                        globalSearch.value;
                }

                loadBooks();

                return;
            }


            /*
             * Search members.
             */

            const matchingUser =
                state.users.find(user => {

                    return (
                        String(
                            user.fullName || ""
                        )
                        .toLowerCase()
                        .includes(query)

                        ||

                        String(
                            user.email || ""
                        )
                        .toLowerCase()
                        .includes(query)
                    );
                });


            if (matchingUser) {

                showSection("users");

                toast(
                    "Member found"
                );

                return;
            }


            toast(
                "No matching record found"
            );
        }
    );
}


/* =========================================================
   KEYBOARD SHORTCUT
   Ctrl + /
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "/"
        ) {

            event.preventDefault();

            globalSearch?.focus();
        }
    }
);


/* =========================================================
   API KEY SETUP
   ========================================================= */

window.setLibraryApiKey =
    function(apiKey) {

        if (!apiKey) {
            return;
        }

        setApiKey(apiKey);

        toast(
            "API key saved"
        );
    };


/* =========================================================
   INITIAL LOAD
   ========================================================= */

window.addEventListener(
    "load",
    async () => {

        console.log(
            "LibraryOS frontend started"
        );

        console.log(
            "API Gateway:",
            API
        );


        await loadDashboard();

    }
);
