
document.getElementById("csvInput").addEventListener("change", handleFileSelect);
document.getElementById("textInput").addEventListener("input", handleTextInput);
document.getElementById("sampleDataBtn").addEventListener("click", insertSampleData);
document.getElementById("exportBtn").addEventListener("click", exportToCSV);

let tableData = [];
let tableHeaders = [];
let sortableInstance = null;

// Function to Handle File Selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => processParsedData(results.data),
            error: (error) => console.error("Error parsing CSV:", error),
        });
    }
}

// Function to Handle Text Input Parsing
function handleTextInput() {
    const inputText = document.getElementById("textInput").value;
    if (inputText.trim()) {
        const parsedData = Papa.parse(inputText, { header: true, skipEmptyLines: true });
        processParsedData(parsedData.data);
    }
}

// Function to Insert Sample Data into the Text Input
function insertSampleData() {
    const sampleData = `Name,Age,Occupation\nAlice,30,Engineer\nBob,25,Designer\nCharlie,35,Manager`;
    document.getElementById("textInput").value = sampleData;
    handleTextInput(); // Automatically parse and render the sample data
}

// Function to Process Parsed Data
function processParsedData(data) {
    if (data.length === 0) return;

    tableHeaders = Object.keys(data[0]).map((header) => header.trim());
    tableData = data.map((row) => {
        const cleanedRow = {};
        tableHeaders.forEach((header) => {
            cleanedRow[header] = (row[header] || "").trim();
        });
        return cleanedRow;
    });
    renderTable();
}

// Function to Render the Table
function renderTable() {
    const table = document.getElementById("dataTable");
    table.innerHTML = "";

    const headerRow = document.createElement("tr");
    tableHeaders.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    tableData.forEach((row) => {
        const dataRow = document.createElement("tr");
        tableHeaders.forEach((header) => {
            const td = document.createElement("td");
            td.textContent = row[header] || "";
            dataRow.appendChild(td);
        });
        table.appendChild(dataRow);
    });

    initializeDragAndDrop();
}

// Function to Initialize Drag-and-Drop
function initializeDragAndDrop() {
    if (sortableInstance) sortableInstance.destroy();
    sortableInstance = Sortable.create(document.querySelector("tr"), {
        animation: 150,
        onEnd: () => {
            tableHeaders = Array.from(document.querySelectorAll("th")).map((th) => th.textContent);
            renderTable();
        },
    });
}

// Function to Export Table Data to CSV
function exportToCSV() {
    const csvData = [tableHeaders.join(",")];
    tableData.forEach((row) => {
        csvData.push(tableHeaders.map((header) => row[header]).join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvData.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "modified_data.csv");
    link.click();
}
