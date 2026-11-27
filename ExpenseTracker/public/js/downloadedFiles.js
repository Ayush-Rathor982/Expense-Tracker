
document.addEventListener('DOMContentLoaded', () => {
    getDownloadedFiles();
})



async function getDownloadedFiles() {
    try {
        const token = localStorage.getItem('token');

        const result = await axios.get(
            `http://localhost:3000/expenses/downloadedFiles`,
            {headers:{'Authorization' : token}}
        );

        const downloadedFiles = result.data.downloadedFiles;

        // Clear previous rows before displaying new data
        const table = document.getElementById('downloadedTable');
        table.innerHTML = '';

        downloadedFiles.forEach((file) => {
            displayReport(file);
        });

    } catch (error) {
        // console.error('Error fetching expense report:', error);
        // alert('Error fetching :', error)
    }
}


function displayReport(file) {

    const table = document.getElementById('downloadedTable');

    // Create table row
    const tr = document.createElement('tr');

    // Create period/date cell
    const dateTd = document.createElement('td');
    dateTd.textContent = file.date;

    // Create amount cell
    const linkTd = document.createElement('td');
    const a = document.createElement('a');
    a.href = file.fileURL
    a.textContent = file.fileURL
    linkTd.append(a);

    tr.appendChild(dateTd);
    tr.appendChild(linkTd);

    // Append row to table
    table.appendChild(tr);
}




async function downloadExpenses(){
    const token = localStorage.getItem('token');
    const res = await axios.get(
        `http://localhost:3000/expenses/download`,
        {headers:{'Authorization' : token}}
    )

    if(res.status == 200){
        var a = document.createElement('a');
        a.href = res.data.fileURL;
        a.download = "myexpense.txt";
        a.click();
    }

    console.log(res)
}