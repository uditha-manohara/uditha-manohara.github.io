function unlock() {
  const pw = document.getElementById("password").value;
  const correct = "magebuwalla";
  const error = document.getElementById("error");

  if (pw === correct) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("letter").classList.remove("hidden");
  } else {
    error.textContent = "Wrong password, sudu 👀";
  }
}
