
// --- COMPONENT LOADING ---
function loadComponent(containerId, filePath, callback) {
    fetch(filePath)
      .then(res => res.text())
      .then(html => {
        document.getElementById(containerId).innerHTML = html;
        if (callback) callback();
      });
  }
  
  // --- INITIALIZE COMPONENTS ---
  document.addEventListener("DOMContentLoaded", function() {
    loadComponent("navbar-container", "components/navbar.html");
    loadComponent("peptide-menu-container", "components/peptideMenu.html", renderPeptidesMenu);
  
    // Sort select functionality
    document.getElementById('sortSelect').addEventListener('change', function() {
      const dir = this.value === 'high' ? -1 : 1;
      window.peptideData[selectedIdx].vendors.sort((a, b) => (a.price - b.price) * dir);
      renderTable(selectedIdx);
    });
  });
  
  // --- PEPTIDE MENU CREATION ---
  function renderPeptidesMenu() {
    const peptides = window.peptideData;
    const container = document.getElementById("peptide-menu");
    if (!container) return;
    container.innerHTML = "";
    peptides.forEach((pep, idx) => {
      const btn = document.createElement("button");
      btn.className = "peptide-btn" + (idx === 0 ? " active" : "");
      btn.textContent = pep.name;
      btn.onclick = () => selectPeptide(idx);
      container.appendChild(btn);
    });
    renderTable(0); // Show first peptide
  }
  
  let selectedIdx = 0;
  function selectPeptide(idx) {
    selectedIdx = idx;
    const buttons = document.querySelectorAll("#peptide-menu .peptide-btn");
    buttons.forEach((btn, i) => btn.classList.toggle('active', i === idx));
    renderTable(idx);
  }
  
  function renderTable(idx) {
    const peptides = window.peptideData;
    if (!peptides[idx]) return;
    document.getElementById('peptideHeader').textContent = `Compare ${peptides[idx].name} Prices`;
    const tbody = document.querySelector('#compareTable tbody');
    tbody.innerHTML = '';
    peptides[idx].vendors.forEach(site => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${site.vendor}</td>
                      <td data-price="${site.price}">$${site.price}</td>
                      <td><a href="${site.url}" target="_blank">Visit</a></td>`;
      tbody.appendChild(tr);
    });
  }