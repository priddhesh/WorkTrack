function test()
{
    let val = document.getElementById("pass-check").checked; 
    if(val)
    {
      document.getElementById("pass-box").style.display = "block";
    }else{  
        document.getElementById("pass-box").style.display = "none";
    }
}
function update(e)
{
  let val = e[1];
  let desc =  document.getElementById(`desc${val}`).innerText;
  let type = document.getElementById(`type${val}`).innerText;
  let st_time = document.getElementById(`st_time${val}`).innerText;
  let time = document.getElementById(`time${val}`).innerText;
  document.getElementById(`udesc${val}`).value = desc;
  document.getElementById(`prevdesc${val}`).value = desc;
  document.getElementById(`utype${val}`).value = type;
  document.getElementById(`ust_time${val}`).value = st_time;
  document.getElementById(`utime_taken${val}`).value = time;
}

function remove(e)
{
  let val = e[1];
  let desc = document.getElementById(`desc${val}`).innerText;
  let type = document.getElementById(`type${val}`).innerText;
  let st_time = document.getElementById(`st_time${val}`).innerText;
  let time = document.getElementById(`time${val}`).innerText;

  document.getElementById("ddesc").value = desc;
  document.getElementById("dtype").value = type;
  document.getElementById("dst_time").value = st_time;
  document.getElementById("dtime").value = time;

  document.getElementById("deleteForm").submit();
}