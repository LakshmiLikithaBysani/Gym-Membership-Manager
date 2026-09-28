const nameInput =
    document.getElementById("name");

const phoneInput =
    document.getElementById("phone");

const ageInput =
    document.getElementById("age");

const planInput =
    document.getElementById("plan");

const startDateInput =
    document.getElementById("startDate");

const paymentInput =
    document.getElementById("payment");

const addButton =
    document.getElementById("addButton");

const memberList =
    document.getElementById("memberList");

const searchInput =
    document.getElementById("search");

const total =
    document.getElementById("total");

const active =
    document.getElementById("active");

const expired =
    document.getElementById("expired");

const collected =
    document.getElementById("collected");

const resetButton =
    document.getElementById("resetButton");

const message =
    document.getElementById("message");


let members =
    JSON.parse(localStorage.getItem("gymMembers")) || [];


// Plan prices

const planPrices = {

    "Monthly": 1000,

    "3 Months": 2700,

    "6 Months": 5000,

    "Yearly": 9000

};


// Add member

addButton.addEventListener("click", () => {

    const name =
        nameInput.value.trim();

    const phone =
        phoneInput.value.trim();

    const age =
        ageInput.value;

    const plan =
        planInput.value;

    const startDate =
        startDateInput.value;

    const payment =
        paymentInput.value;


    if (
        name === "" ||
        phone === "" ||
        age === "" ||
        startDate === ""
    ) {

        message.textContent =
            "⚠️ Please fill all fields.";

        return;
    }


    const member = {

        id: Date.now(),

        name: name,

        phone: phone,

        age: age,

        plan: plan,

        price: planPrices[plan],

        startDate: startDate,

        payment: payment

    };


    members.push(member);


    saveData();

    displayMembers();

    updateStats();

    clearForm();


    message.textContent =
        "✅ Member added successfully.";

});


// Calculate expiry date

function getExpiryDate(startDate, plan) {

    const date =
        new Date(startDate);


    if (plan === "Monthly") {

        date.setMonth(
            date.getMonth() + 1
        );

    }

    else if (plan === "3 Months") {

        date.setMonth(
            date.getMonth() + 3
        );

    }

    else if (plan === "6 Months") {

        date.setMonth(
            date.getMonth() + 6
        );

    }

    else if (plan === "Yearly") {

        date.setFullYear(
            date.getFullYear() + 1
        );

    }


    return date;

}


// Check status

function getStatus(startDate, plan) {

    const expiryDate =
        getExpiryDate(
            startDate,
            plan
        );

    const today =
        new Date();

    if (today <= expiryDate) {

        return "Active";

    } else {

        return "Expired";

    }

}


// Display members

function displayMembers() {

    memberList.innerHTML = "";


    const searchText =
        searchInput.value.toLowerCase();


    const filteredMembers =
        members.filter(member =>
            member.name
                .toLowerCase()
                .includes(searchText)
        );


    if (filteredMembers.length === 0) {

        memberList.innerHTML =
            "<p>No members found.</p>";

        return;
    }


    filteredMembers.forEach(member => {

        const card =
            document.createElement("div");

        card.className =
            "member-card";


        const status =
            getStatus(
                member.startDate,
                member.plan
            );


        const expiryDate =
            getExpiryDate(
                member.startDate,
                member.plan
            );


        const formattedExpiry =
            expiryDate
                .toISOString()
                .split("T")[0];


        const statusClass =
            status === "Active"
            ? "active-status"
            : "expired-status";


        const paymentClass =
            member.payment === "Paid"
            ? "paid"
            : "pending";


        card.innerHTML = `

            <h2>👤 ${member.name}</h2>

            <p>
                <strong>Phone:</strong>
                ${member.phone}
            </p>

            <p>
                <strong>Age:</strong>
                ${member.age}
            </p>

            <p>
                <strong>Plan:</strong>
                ${member.plan}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${member.price}
            </p>

            <p>
                <strong>Start Date:</strong>
                ${member.startDate}
            </p>

            <p>
                <strong>Expiry Date:</strong>
                ${formattedExpiry}
            </p>

            <p class="${statusClass}">
                <strong>Status:</strong>
                ${status === "Active"
                    ? "✅ Active"
                    : "❌ Expired"}
            </p>

            <p class="${paymentClass}">
                <strong>Payment:</strong>
                ${member.payment === "Paid"
                    ? "✅ Paid"
                    : "⏳ Pending"}
            </p>

            <button
                class="delete-button"
                onclick="deleteMember(${member.id})">
                🗑️ Delete
            </button>

        `;


        memberList.appendChild(card);

    });

}


// Delete member

function deleteMember(id) {

    members =
        members.filter(
            member => member.id !== id
        );


    saveData();

    displayMembers();

    updateStats();


    message.textContent =
        "🗑️ Member deleted.";

}


// Update statistics

function updateStats() {

    const totalCount =
        members.length;


    const activeCount =
        members.filter(member =>
            getStatus(
                member.startDate,
                member.plan
            ) === "Active"
        ).length;


    const expiredCount =
        totalCount - activeCount;


    const collectedAmount =
        members
            .filter(
                member =>
                    member.payment === "Paid"
            )
            .reduce(
                (sum, member) =>
                    sum + member.price,
                0
            );


    total.textContent =
        totalCount;

    active.textContent =
        activeCount;

    expired.textContent =
        expiredCount;

    collected.textContent =
        "₹" + collectedAmount;

}


// Save data

function saveData() {

    localStorage.setItem(
        "gymMembers",
        JSON.stringify(members)
    );

}


// Clear form

function clearForm() {

    nameInput.value = "";

    phoneInput.value = "";

    ageInput.value = "";

    planInput.value = "Monthly";

    startDateInput.value = "";

    paymentInput.value = "Paid";

}


// Search

searchInput.addEventListener(
    "input",
    displayMembers
);


// Reset all

resetButton.addEventListener("click", () => {

    members = [];

    saveData();

    displayMembers();

    updateStats();


    message.textContent =
        "🔄 All members have been removed.";

});


// Initial display

displayMembers();

updateStats();
