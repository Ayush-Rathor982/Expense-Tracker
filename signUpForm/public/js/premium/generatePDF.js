
function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get existing transaction table
    const tableBody = document.getElementById('transactionTable');
    const table = tableBody.closest('table');

    // Get selected period
    const activeTab = document.querySelector(
        '.transaction-tabs .tab.active'
    );

    const period = activeTab ? activeTab.dataset.type : 'daily';

    const periodName =
        period.charAt(0).toUpperCase() + period.slice(1);

    // Get table headings dynamically
    const headers = Array.from(
        table.querySelectorAll('thead th')
    ).map(th => th.textContent.trim());

    // --------------------------------
    // GET TABLE DATA
    // --------------------------------

    let total = 0;

    const rows = Array.from(
        tableBody.querySelectorAll('tr')
    ).map(tr => {

        const cells = Array.from(
            tr.querySelectorAll('td')
        ).map(td => td.textContent.trim());

        // Extract amount from the fourth column
        const rawAmount = cells[3] || '0';

        const amount = Math.abs(
            Number(rawAmount.replace(/[^0-9.-]/g, '')) || 0
        );

        total += amount;

        // Format amount
        cells[3] = `Rs. ${amount.toLocaleString('en-IN')}`;

        return cells;
    });

    // Check if table is empty
    if (rows.length === 0) {
        alert('No transactions available to download!');
        return;
    }

    // --------------------------------
    // COLORS
    // --------------------------------

    const primaryColor = [108, 99, 255];
    const darkColor = [40, 40, 60];
    const lightColor = [245, 245, 250];

    // --------------------------------
    // HEADER
    // --------------------------------

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(21);
    doc.setFont('helvetica', 'bold');

    doc.text('Expense Tracker', 14, 17);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text('Day to Day Expenses Report', 14, 27);

    // --------------------------------
    // REPORT INFORMATION
    // --------------------------------

    doc.setTextColor(...darkColor);
    doc.setFontSize(10);

    doc.text(`Report Period: ${periodName}`, 14, 49);

    doc.text(
        `Generated On: ${new Date().toLocaleDateString('en-IN')}`,
        14,
        56
    );

    // --------------------------------
    // TOTAL EXPENSE SUMMARY
    // --------------------------------

    doc.setFillColor(...lightColor);

    doc.roundedRect(
        14,
        64,
        182,
        25,
        3,
        3,
        'F'
    );

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);

    doc.text('Total Visible Expenses', 20, 74);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');

    doc.text(
        `Rs. ${total.toLocaleString('en-IN')}`,
        20,
        83
    );

    // --------------------------------
    // TRANSACTION TABLE
    // --------------------------------

    doc.autoTable({

        head: [headers],

        body: rows,

        // Add total row at the bottom
        foot: [[
            '',
            '',
            'Total Amount',
            `Rs. ${total.toLocaleString('en-IN')}`
        ]],

        showFoot: 'lastPage',

        startY: 98,

        theme: 'grid',

        // Header styling
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 10,
            cellPadding: 5
        },

        // Body styling
        bodyStyles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 5,
            textColor: darkColor
        },

        alternateRowStyles: {
            fillColor: lightColor
        },

        // Total row styling
        footStyles: {
            fillColor: [230, 228, 255],
            textColor: darkColor,
            fontStyle: 'bold',
            fontSize: 10,
            cellPadding: 6
        },

        columnStyles: {

            0: {
                halign: 'center',
                cellWidth: 20
            },

            1: {
                cellWidth: 50
            },

            2: {
                halign: 'center',
                cellWidth: 55
            },

            3: {
                halign: 'right',
                cellWidth: 40
            }

        },

        margin: {
            left: 14,
            right: 14,
            bottom: 20
        }

    });

    // --------------------------------
    // FOOTER
    // --------------------------------

    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {

        doc.setPage(i);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);

        doc.text(
            'Generated by Expense Tracker',
            14,
            290
        );

        doc.text(
            `Page ${i} of ${pageCount}`,
            196,
            290,
            { align: 'right' }
        );

    }

    // --------------------------------
    // DOWNLOAD PDF
    // --------------------------------

    doc.save(`Expense_Report_${period}.pdf`);

}

