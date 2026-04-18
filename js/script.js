let editingId = null;

const BASE_URL = "http://localhost:8080";


// ✅ Load students
function loadStudents() {
    fetch(BASE_URL + "/students")
        .then(res => res.json())
        .then(data => showData(data))
        .catch(() => showMessage("Failed to load students", "error"));
}


// ✅ Show data in table
function showData(data) {
    let table = "";

    if (data.length === 0) {
        table = `<tr><td colspan="6">No students found</td></tr>`;
    } else {
        data.forEach((s, index) => {
            table += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td>${s.course}</td>
                    <td>${s.phone ?? ""}</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${s.id}, \`${s.name}\`, \`${s.email}\`, \`${s.course}\`, \`${s.phone ?? ""}\`)">Edit</button>
                        <button class="delete-btn" onclick="deleteStudent(${s.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    document.getElementById("studentTable").innerHTML = table;
}


// ✅ Add OR Update student
function addStudent() {

    const student = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value.trim(),
    phone: document.getElementById("phone").value.trim()
    };

    // 🔴 Validation
    if (!student.name || !student.email || !student.course || !student.phone) {
        showMessage("Please fill all fields", "error");
        return;
    }

    // 📧 Email validation
    if (!student.email.includes("@")) {
        showMessage("Enter valid email", "error");
        return;
    }

    // 📱 Phone validation (basic)
    if (student.phone.length < 10) {
        showMessage("Enter valid phone number", "error");
        return;
    }

    // 🔄 UPDATE
    if (editingId !== null) {
        fetch(`${BASE_URL}/students/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        })
        .then(() => {
            showMessage("Student updated successfully!", "success");
            editingId = null;
            clearForm();
            loadStudents();
        })
        .catch(() => showMessage("Update failed", "error"));
    } 
    // ➕ ADD
    else {
        fetch(BASE_URL + "/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        })
        .then(() => {
            showMessage("Student added successfully!", "success");
            clearForm();
            loadStudents();
        })
        .catch(() => showMessage("Add failed", "error"));
    }
}


// ✅ Edit student
function editStudent(id, nameVal, emailVal, courseVal, phoneVal) {
    editingId = id;

    document.getElementById("name").value = nameVal;
    document.getElementById("email").value = emailVal;
    document.getElementById("course").value = courseVal;
    document.getElementById("phone").value = phoneVal;

    document.getElementById("submitBtn").innerText = "Update Student";
}


// ✅ Delete student
function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    fetch(BASE_URL + "/students/" + id, {
        method: "DELETE"
    })
    .then(() => {
        showMessage("Student deleted!", "success");
        loadStudents();
    })
    .catch(() => showMessage("Delete failed", "error"));
}


// 🔍 Search student
function searchStudent() {
    const name = document.getElementById("search").value.trim();

    if (!name) {
        loadStudents();
        return;
    }

    fetch(`${BASE_URL}/students/search?name=${name}`)
        .then(res => res.json())
        .then(data => showData(data))
        .catch(() => showMessage("Search failed", "error"));
}


// 🧹 Clear form
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";
    document.getElementById("phone").value = "";

    document.getElementById("submitBtn").innerText = "Add Student";
}


// 💬 Show message (UPGRADED)
function showMessage(text, type = "success") {
    const msg = document.getElementById("message");

    msg.innerText = text;
    msg.style.color = type === "error" ? "red" : "green";

    setTimeout(() => {
        msg.innerText = "";
    }, 2500);
}


// ⌨️ ENTER key search support
document.getElementById("search").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchStudent();
    }
});


// 🚀 Auto load
loadStudents();