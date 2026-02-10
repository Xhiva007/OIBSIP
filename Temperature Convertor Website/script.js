function updateHistoryDisplay() {
  const historyList = document.getElementById("historyList");
  const emptyMsg = document.getElementById("emptyMsg");
  // Show message only if there are no list items
  emptyMsg.style.display = historyList.children.length === 0 ? "block" : "none";
}

function showOutput() {
  const outputElement = document.getElementById("output");
  outputElement.style.animation = "fadeIn 0.5s forwards";
  outputElement.style.opacity = 1;
}

function clearCurrentInput() {
  document.getElementById("inputTemperature").value = "";
  const output = document.getElementById("output");
  output.innerHTML = "";
  output.style.opacity = 0;
}

function convertTemperature() {
  const inputVal = document.getElementById("inputTemperature").value;
  const inputUnit = document.getElementById("inputUnit").value;
  
  if (inputVal === "" || isNaN(inputVal)) return;

  const temp = parseFloat(inputVal);
  let outputText = "";

  if (inputUnit === "C") {
    outputText = `${temp}°C = ${(temp * 9/5 + 32).toFixed(2)}°F = ${(temp + 273.15).toFixed(2)}K`;
  } else if (inputUnit === "F") {
    outputText = `${temp}°F = ${((temp - 32) * 5/9).toFixed(2)}°C = ${((temp - 32) * 5/9 + 273.15).toFixed(2)}K`;
  } else {
    outputText = `${temp}K = ${(temp - 273.15).toFixed(2)}°C = ${((temp - 273.15) * 9/5 + 32).toFixed(2)}°F`;
  }

  document.getElementById("output").innerHTML = outputText;
  showOutput();

  // Add to History UI
  const historyList = document.getElementById("historyList");
  const li = document.createElement("li");
  li.innerText = outputText;
  historyList.prepend(li);
  if (historyList.children.length > 5) historyList.removeChild(historyList.lastChild);
  
  updateHistoryDisplay();

  // Save to LocalStorage
  const saved = JSON.parse(localStorage.getItem("conversions")) || [];
  saved.push(outputText);
  localStorage.setItem("conversions", JSON.stringify(saved));
}

function clearHistory() {
  if (confirm("Delete all conversion history?")) {
    localStorage.removeItem("conversions");
    document.getElementById("historyList").innerHTML = "";
    updateHistoryDisplay();
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  document.getElementById("themeToggle").innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

document.addEventListener("DOMContentLoaded", () => {
  // Theme initialization
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggle").innerText = "☀️ Light Mode";
  }

  // History initialization
  const saved = JSON.parse(localStorage.getItem("conversions")) || [];
  const historyList = document.getElementById("historyList");
  if (saved.length > 0) {
    document.getElementById("output").innerHTML = saved[saved.length - 1];
    showOutput();
    saved.slice(-5).reverse().forEach(text => {
      const li = document.createElement("li");
      li.innerText = text;
      historyList.appendChild(li);
    });
  }
  updateHistoryDisplay();
});