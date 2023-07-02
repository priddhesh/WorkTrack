function test() {
  let val = document.getElementById("pass-check").checked;
  if (val) {
    document.getElementById("pass-box").style.display = "block";
  } else {
    document.getElementById("pass-box").style.display = "none";
  }
}