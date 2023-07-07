let entries = document.getElementsByTagName('td');

for (let i = 0; i < entries.length; i++) {
    if (parseInt(entries[i].id) && document.getElementById(`status${entries[i].id}`).innerText != 'pending') {
        document.getElementById(`update${entries[i].id}`).style.display = 'none';
        document.getElementById(`delete${entries[i].id}`).style.display = 'none';
    }
}

function applicationInfo(e)
{
    let id = e.substring(6,7);
    document.getElementById("prevReason").value = document.getElementById(`reason${id}`).innerText;
    document.getElementById("ureason").value = document.getElementById(`reason${id}`).innerText;
    let d = document.getElementById(`from${id}`).innerText;
    let d2 = document.getElementById(`to${id}`).innerText;
    const date2 = new Date(d2);

    const year2 = date2.getFullYear();
    const month2 = String(date2.getMonth() + 1).padStart(2, "0"); 
    const day2 = String(date2.getDate()).padStart(2, "0");

    const formattedDate2 = `${year2}-${month2}-${day2}`;

    const date = new Date(d);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    document.getElementById("ufrom").value = formattedDate;
    document.getElementById("uto").value = formattedDate2;
}