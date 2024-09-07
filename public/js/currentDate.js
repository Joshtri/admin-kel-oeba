
// Function to set today's date
function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    document.getElementById('tanggal_kegiatan').value = formattedDate;
}

// Call the function when the page loads
window.onload = setTodayDate;
