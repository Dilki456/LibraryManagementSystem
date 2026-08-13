const API_URL = "/api/borrow";

const borrowForm = document.getElementById("borrowForm");
const borrowTableBody = document.getElementById("borrowTableBody");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");


/* Load all borrow records */

async function loadBorrowRecords() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load records");
        }

        const records = await response.json();

        displayRecords(records);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Cannot connect to Borrow Service.";

        message.style.color = "red";
    }
}


/* Display records */

function displayRecords(records) {

    borrowTableBody.innerHTML = "";

    if (records.length === 0) {

        borrowTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No borrow records found.
                </td>
            </tr>
        `;

        return;
    }


    records.forEach(record => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${record.userId}</td>

            <td>${record.bookId}</td>

            <td>${record.borrowDate}</td>

            <td>${record.dueDate}</td>

            <td>
                ${record.returnDate || "-"}
            </td>

            <td>
                ${record.status}
            </td>

            <td>

                ${
                    record.status === "BORROWED"
                    ?
                    `<button
                        class="return-button"
                        onclick="returnBook('${record.id}')">
                        Return
                    </button>`
                    :
                    "Completed"
                }

            </td>

        `;

        borrowTableBody.appendChild(row);

    });
}


/* Borrow Book */

borrowForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const borrowData = {

        userId:
            document.getElementById("userId").value,

        bookId:
            document.getElementById("bookId").value,

        borrowDate:
            document.getElementById("borrowDate").value,

        dueDate:
            document.getElementById("dueDate").value,

        returnDate: null,

        status: "BORROWED"

    };


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(borrowData)

        });


        if (!response.ok) {
            throw new Error("Borrow failed");
        }


        await response.json();


        message.textContent =
            "Book borrowed successfully!";

        message.style.color = "green";


        borrowForm.reset();

        loadBorrowRecords();


    } catch (error) {

        console.error(error);

        message.textContent =
            "Failed to borrow book.";

        message.style.color = "red";
    }

});


/* Return Book */

async function returnBook(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        if (!response.ok) {
            throw new Error("Record not found");
        }


        const record =
            await response.json();


        const updatedRecord = {

            userId: record.userId,

            bookId: record.bookId,

            borrowDate: record.borrowDate,

            dueDate: record.dueDate,

            returnDate:
                new Date()
                    .toISOString()
                    .split("T")[0],

            status: "RETURNED"

        };


        const updateResponse =
            await fetch(`${API_URL}/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(updatedRecord)

            });


        if (!updateResponse.ok) {
            throw new Error("Return failed");
        }


        message.textContent =
            "Book returned successfully!";

        message.style.color = "green";


        loadBorrowRecords();


    } catch (error) {

        console.error(error);

        message.textContent =
            "Failed to return book.";

        message.style.color = "red";
    }
}


/* Refresh */

refreshBtn.addEventListener(
    "click",
    loadBorrowRecords
);


/* Load records when page opens */

loadBorrowRecords();