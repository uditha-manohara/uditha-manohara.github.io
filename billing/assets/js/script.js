let receiptHistory = JSON.parse(localStorage.getItem('receiptHistory') || '[]');
let receiptCounter = parseInt(localStorage.getItem('receiptCounter') || '1000');
let businessSettings = JSON.parse(localStorage.getItem('businessSettings') || '{}');

// Load saved business settings
function loadBusinessSettings() {
    if (Object.keys(businessSettings).length > 0) {
        document.getElementById('businessName').value = businessSettings.name || '';
        document.getElementById('businessAddress').value = businessSettings.address || '';
        document.getElementById('businessPhone').value = businessSettings.phone || '';
        document.getElementById('businessEmail').value = businessSettings.email || '';
        document.getElementById('taxId').value = businessSettings.taxId || '';
        document.getElementById('taxRate').value = businessSettings.taxRate || '0';
    }
}

// Save business settings
function saveBusinessSettings() {
    businessSettings = {
        name: document.getElementById('businessName').value,
        address: document.getElementById('businessAddress').value,
        phone: document.getElementById('businessPhone').value,
        email: document.getElementById('businessEmail').value,
        taxId: document.getElementById('taxId').value,
        taxRate: document.getElementById('taxRate').value
    };
    localStorage.setItem('businessSettings', JSON.stringify(businessSettings));
}

function generateReceiptNumber() {
    receiptCounter++;
    localStorage.setItem('receiptCounter', receiptCounter);
    return 'RCP-' + receiptCounter.toString().padStart(6, '0');
}

function addItem() {
    const container = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    newItem.innerHTML = `
                <input type="text" placeholder="Item/Service description" class="item-desc">
                <input type="number" placeholder="Qty" class="item-qty" value="1" min="1">
                <input type="number" placeholder="Price" class="item-price" step="0.01" min="0">
                <button class="remove-btn" onclick="removeItem(this)">×</button>
            `;
    container.appendChild(newItem);

    // Add event listeners to new inputs
    newItem.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', generateReceipt);
        input.addEventListener('change', generateReceipt);
    });

    // Auto-focus on the new item description
    newItem.querySelector('.item-desc').focus();
}

function removeItem(btn) {
    const container = document.getElementById('itemsContainer');
    if (container.children.length > 1) {
        btn.parentElement.remove();
        generateReceipt();
    } else {
        alert('At least one item is required!');
    }
}

function generateReceipt() {
    // Save business settings
    saveBusinessSettings();

    // Update business info
    document.getElementById('previewBusinessName').textContent = document.getElementById('businessName').value;
    document.getElementById('previewBusinessAddress').innerHTML = document.getElementById('businessAddress').value.replace(/\n/g, '<br>');
    document.getElementById('previewBusinessPhone').textContent = document.getElementById('businessPhone').value;
    document.getElementById('previewBusinessEmail').textContent = document.getElementById('businessEmail').value;
    document.getElementById('previewTaxId').textContent = document.getElementById('taxId').value;

    // Update customer info
    document.getElementById('previewCustomerName').textContent = document.getElementById('customerName').value || 'Customer Name';
    document.getElementById('previewCustomerPhone').textContent = document.getElementById('customerPhone').value || 'Customer Phone';
    document.getElementById('previewCustomerEmail').textContent = document.getElementById('customerEmail').value || 'Customer Email';
    document.getElementById('previewCustomerAddress').innerHTML = (document.getElementById('customerAddress').value || 'Customer Address').replace(/\n/g, '<br>');

    // Update dates and receipt number
    const now = new Date();
    document.getElementById('previewDate').textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('previewTime').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('generatedDateTime').textContent = now.toLocaleString();

    const receiptNumber = generateReceiptNumber();
    document.getElementById('previewReceiptNumber').textContent = receiptNumber;

    // Update payment info
    const paymentSelect = document.getElementById('paymentMethod');
    document.getElementById('previewPaymentMethod').textContent = paymentSelect.options[paymentSelect.selectedIndex].text;
    document.getElementById('previewTransactionId').textContent = document.getElementById('transactionId').value || 'N/A';

    // Calculate items
    const itemsContainer = document.getElementById('itemsContainer');
    const items = itemsContainer.querySelectorAll('.item-row');
    const previewItems = document.getElementById('previewItems');

    previewItems.innerHTML = '';
    let subtotal = 0;

    items.forEach(item => {
        const desc = item.querySelector('.item-desc').value || 'Item';
        const qty = parseFloat(item.querySelector('.item-qty').value) || 1;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const total = qty * price;
        subtotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${desc}</td>
                    <td>${qty}</td>
                    <td>${price.toFixed(2)}</td>
                    <td>${total.toFixed(2)}</td>
                `;
        previewItems.appendChild(row);
    });

    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const tax = subtotal * (taxRate / 100);
    const discount = 0; // Can be extended for discount functionality
    const grandTotal = subtotal + tax - discount;

    document.getElementById('previewSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('previewTaxRate').textContent = taxRate;
    document.getElementById('previewTax').textContent = tax.toFixed(2);
    document.getElementById('previewDiscount').textContent = discount.toFixed(2);
    document.getElementById('previewTotal').textContent = grandTotal.toFixed(2);

    // Generate QR Code with comprehensive receipt data
    generateQRCode(receiptNumber, grandTotal);

    // Generate Barcode linking to website
    //generateBarcode();
}

function generateQRCode(receiptNumber, total) {
    const canvas = document.createElement('canvas');
    const receiptData = {
        receiptId: receiptNumber,
        business: document.getElementById('businessName').value,
        customer: document.getElementById('customerName').value || 'Customer',
        total: total.toFixed(2),
        date: new Date().toISOString(),
        website: 'https://uditha-manohara.github.io',
        verification: `Receipt ${receiptNumber} verified authentic`
    };

    const qr = new QRious({
        element: canvas,
        value: JSON.stringify(receiptData),
        size: 120,
        level: 'H',
        background: '#ffffff',
        foreground: '#2d3748'
    });

    const qrImage = document.createElement('img');
    qrImage.src = canvas.toDataURL('image/png');
    qrImage.alt = 'QR Code';
    qrImage.width = 120;
    qrImage.height = 120;

    const container = document.getElementById('qrcode');
    container.innerHTML = '';
    container.appendChild(qrImage);
}


//function generateBarcode() {
//const svg = document.getElementById('barcode');
//svg.innerHTML = ''; // Clear any existing

//JsBarcode(svg, "https://uditha-manohara.github.io", {
//   format: "CODE128",
//  width: 2,
// height: 80, // Increase for full visibility
// displayValue: false,
//background: "#ffffff",
//lineColor: "#2d3748",
//margin: 0
//});
//}


async function downloadPDF() {
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading"></span> Generating PDF...';
    button.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const receiptElement = document.getElementById('receiptPreview');

        // Create off-screen container for full render
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: -9999px;
            width: 800px;
            background: white;
            padding: 40px;
            z-index: -1;
        `;

        const clone = receiptElement.cloneNode(true);
        clone.style.width = '100%';
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';

        container.appendChild(clone);
        document.body.appendChild(container);

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 300));

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        document.body.removeChild(container);

        const imgWidth = 190;
        const pageHeight = 295;
        const canvasHeight = canvas.height;
        const canvasWidth = canvas.width;
        const imgHeight = (canvasHeight * imgWidth) / canvasWidth;

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        let position = 0;

        const pageCanvas = document.createElement('canvas');
        const ctx = pageCanvas.getContext('2d');

        const pageCanvasHeight = (pageHeight * canvasWidth) / imgWidth;
        pageCanvas.width = canvasWidth;
        pageCanvas.height = pageCanvasHeight;

        let remainingHeight = canvasHeight;

        let pageCount = 0;

        while (remainingHeight > 0) {
            ctx.clearRect(0, 0, canvasWidth, pageCanvasHeight);
            ctx.drawImage(
                canvas,
                0, pageCount * pageCanvasHeight,
                canvasWidth, pageCanvasHeight,
                0, 0,
                canvasWidth, pageCanvasHeight
            );

            const imgData = pageCanvas.toDataURL('image/png');
            if (pageCount > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, pageHeight - 20);

            remainingHeight -= pageCanvasHeight;
            pageCount++;
        }

        pdf.setProperties({
            title: `Receipt ${document.getElementById('previewReceiptNumber').textContent}`,
            subject: 'Business Receipt',
            author: document.getElementById('businessName').value,
            creator: 'JustReceipt Pro'
        });

        const filename = `receipt-${document.getElementById('previewReceiptNumber').textContent}-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

        // Success feedback
        button.classList.add('success-bounce');
        button.innerHTML = '✅ PDF Downloaded!';
        setTimeout(() => {
            button.classList.remove('success-bounce');
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('PDF generation error:', error);
        button.innerHTML = '❌ Error generating PDF';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}


function saveReceipt() {
    const receiptData = {
        id: document.getElementById('previewReceiptNumber').textContent,
        date: new Date().toISOString(),
        displayDate: document.getElementById('previewDate').textContent,
        customer: document.getElementById('customerName').value || 'Customer',
        customerPhone: document.getElementById('customerPhone').value || '',
        customerEmail: document.getElementById('customerEmail').value || '',
        total: parseFloat(document.getElementById('previewTotal').textContent),
        subtotal: parseFloat(document.getElementById('previewSubtotal').textContent),
        tax: parseFloat(document.getElementById('previewTax').textContent),
        paymentMethod: document.getElementById('previewPaymentMethod').textContent,
        transactionId: document.getElementById('transactionId').value || '',
        items: Array.from(document.getElementById('itemsContainer').querySelectorAll('.item-row')).map(item => ({
            desc: item.querySelector('.item-desc').value || 'Item',
            qty: parseFloat(item.querySelector('.item-qty').value) || 1,
            price: parseFloat(item.querySelector('.item-price').value) || 0
        })),
        business: {
            name: document.getElementById('businessName').value,
            address: document.getElementById('businessAddress').value,
            phone: document.getElementById('businessPhone').value,
            email: document.getElementById('businessEmail').value
        }
    };

    receiptHistory.unshift(receiptData);

    // Keep only last 100 receipts to prevent storage issues
    if (receiptHistory.length > 100) {
        receiptHistory = receiptHistory.slice(0, 100);
    }

    localStorage.setItem('receiptHistory', JSON.stringify(receiptHistory));
    displayHistory();
    updateStats();

    // Success feedback
    const button = event.target;
    const originalText = button.textContent;
    button.classList.add('success-bounce');
    button.innerHTML = '✅ Receipt Saved!';
    setTimeout(() => {
        button.classList.remove('success-bounce');
        button.innerHTML = originalText;
    }, 2000);
}

function displayHistory() {
    const historyDiv = document.getElementById('receiptHistory');
    if (receiptHistory.length === 0) {
        historyDiv.innerHTML = `
                    <p style="text-align: center; color: #718096; padding: 40px;">
                        No receipts saved yet. Generate and save your first professional receipt!
                    </p>
                `;
        return;
    }

    historyDiv.innerHTML = receiptHistory.map(receipt => `
                <div class="history-item">
                    <div>
                        <strong style="color: #2d3748; font-size: 16px;">${receipt.id}</strong><br>
                        <div style="color: #4a5568; margin: 5px 0;">
                            👤 ${receipt.customer} • 📅 ${receipt.displayDate}
                        </div>
                        <div style="color: #718096; font-size: 14px;">
                            💰 ${receipt.total.toFixed(2)} • 💳 ${receipt.paymentMethod}
                            ${receipt.transactionId ? ` • 🔖 ${receipt.transactionId}` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" style="padding: 8px 16px; font-size: 14px;" onclick="loadReceipt('${receipt.id}')">
                            📋 Load
                        </button>
                        <button class="btn" style="padding: 8px 16px; font-size: 14px; background: linear-gradient(135deg, #38a169, #2f855a);" onclick="duplicateReceipt('${receipt.id}')">
                            📄 Copy
                        </button>
                        <button class="btn" style="padding: 8px 16px; font-size: 14px; background: linear-gradient(135deg, #e53e3e, #c53030);" onclick="deleteReceipt('${receipt.id}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `).join('');
}

function updateStats() {
    const totalReceipts = receiptHistory.length;
    const totalRevenue = receiptHistory.reduce((sum, receipt) => sum + receipt.total, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyReceipts = receiptHistory.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear;
    }).length;

    const avgReceiptValue = totalReceipts > 0 ? totalRevenue / totalReceipts : 0;

    document.getElementById('totalReceipts').textContent = totalReceipts;
    document.getElementById('totalRevenue').textContent = `${totalRevenue.toFixed(2)}`;
    document.getElementById('monthlyReceipts').textContent = monthlyReceipts;
    document.getElementById('avgReceiptValue').textContent = `${avgReceiptValue.toFixed(2)}`;
}

function loadReceipt(id) {
    const receipt = receiptHistory.find(r => r.id === id);
    if (!receipt) return;

    // Load customer data
    document.getElementById('customerName').value = receipt.customer;
    document.getElementById('customerPhone').value = receipt.customerPhone || '';
    document.getElementById('customerEmail').value = receipt.customerEmail || '';
    document.getElementById('transactionId').value = receipt.transactionId || '';

    // Clear and rebuild items
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    receipt.items.forEach((item, index) => {
        if (index === 0) {
            // Use first item row
            addItem();
            const firstRow = container.querySelector('.item-row');
            firstRow.querySelector('.item-desc').value = item.desc;
            firstRow.querySelector('.item-qty').value = item.qty;
            firstRow.querySelector('.item-price').value = item.price;
        } else {
            addItem();
            const rows = container.querySelectorAll('.item-row');
            const currentRow = rows[rows.length - 1];
            currentRow.querySelector('.item-desc').value = item.desc;
            currentRow.querySelector('.item-qty').value = item.qty;
            currentRow.querySelector('.item-price').value = item.price;
        }
    });

    generateReceipt();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    alert(`Receipt ${id} loaded successfully! You can modify and save as a new receipt.`);
}

function duplicateReceipt(id) {
    loadReceipt(id);
    // Clear transaction ID for new receipt
    document.getElementById('transactionId').value = '';
    alert('Receipt duplicated! Modify as needed and save as a new receipt.');
}

function deleteReceipt(id) {
    if (confirm(`Are you sure you want to permanently delete receipt ${id}?`)) {
        receiptHistory = receiptHistory.filter(r => r.id !== id);
        localStorage.setItem('receiptHistory', JSON.stringify(receiptHistory));
        displayHistory();
        updateStats();
    }
}

// Advanced search and filter functionality
function searchReceipts(query) {
    const filtered = receiptHistory.filter(receipt =>
        receipt.id.toLowerCase().includes(query.toLowerCase()) ||
        receipt.customer.toLowerCase().includes(query.toLowerCase()) ||
        receipt.paymentMethod.toLowerCase().includes(query.toLowerCase())
    );
    // Display filtered results (can be extended)
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    loadBusinessSettings();
    generateReceipt();
    displayHistory();
    updateStats();

    // Add event listeners for real-time updates
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', generateReceipt);
        input.addEventListener('change', generateReceipt);
    });

    // Auto-save business settings
    setInterval(saveBusinessSettings, 30000); // Save every 30 seconds
});

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                saveReceipt();
                break;
            case 'p':
                e.preventDefault();
                downloadPDF();
                break;
            case 'n':
                e.preventDefault();
                addItem();
                break;
        }
    }
});

// Export data functionality
function exportData() {
    const data = {
        receipts: receiptHistory,
        businessSettings: businessSettings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payproof-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Print receipt functionality
function printReceipt() {
    const printWindow = window.open('', '_blank');
    const receiptHTML = document.getElementById('receiptPreview').outerHTML;

    printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Receipt ${document.getElementById('previewReceiptNumber').textContent}</title>
                    <style>
                        body { font-family: 'Courier New', monospace; margin: 20px; }
                        .receipt-preview { background: white !important; }
                        @media print { 
                            body { margin: 0; }
                            .receipt-preview { box-shadow: none !important; }
                        }
                    </style>
                </head>
                <body>
                    ${receiptHTML}
                </body>
                </html>
            `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}
