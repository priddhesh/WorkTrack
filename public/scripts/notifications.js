let entries = document.getElementsByTagName('td');

for(let i=0;i<entries.length;i++)
{
    if (parseInt(entries[i].id) && document.getElementById(`status${entries[i].id}`).innerText!='pending')
    {
        document.getElementById(`approve${entries[i].id}`).style.display = 'none';
        document.getElementById(`reject${entries[i].id}`).style.display = 'none';
    }
}