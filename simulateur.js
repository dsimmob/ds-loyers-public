
const communesConnues = new Set(); // alimenté à l'init

async function chargerCommunes() {
  const urls = {
    t1_t2: "https://cdn.jsdelivr.net/gh/dsimmob/ds-loyers-public/loyers_t1_t2.json",
    t3_plus: "https://cdn.jsdelivr.net/gh/dsimmob/ds-loyers-public/loyers_t3_plus.json",
    maison: "https://cdn.jsdelivr.net/gh/dsimmob/ds-loyers-public/loyers_maison.json"
  };

  let toutes = new Set();

  for (const url of Object.values(urls)) {
    const data = await fetch(url).then(r => r.json());
    data.forEach(x => {
      if (x.commune) toutes.add(x.commune.trim());
    });
  }

  const datalist = document.getElementById("liste-communes");
  datalist.innerHTML = "";
  toutes.forEach(c => {
    communesConnues.add(c.toLowerCase());
    datalist.innerHTML += `<option value="${c}">`;
  });
}

async function estimerLoyer() {
  const typologie = document.getElementById("typologie").value;
  const commune = document.getElementById("commune").value.trim();
  const surface = parseFloat(document.getElementById("surface").value);
  const resultEl = document.getElementById("resultat-loyer");

  if (!commune || isNaN(surface)) {
    resultEl.innerHTML = "<span style='color:red;'>Veuillez renseigner une commune et une surface.</span>";
    document.getElementById("form-contact").style.display = "none";
    return;
  }

  if (!communesConnues.has(commune.toLowerCase())) {
    resultEl.innerHTML = "<span style='color:red;'>Commune non trouvée dans notre base de données.</span>";
    document.getElementById("form-contact").style.display = "none";
    return;
  }

  const url = `https://cdn.jsdelivr.net/gh/dsimmob/ds-loyers-public/loyers_${typologie}.json`;
  const data = await fetch(url).then(r => r.json());
  const ligne = data.find(x => x.commune.toLowerCase() === commune.toLowerCase());

  if (!ligne) {
    resultEl.innerHTML = "<span style='color:red;'>Données absentes pour cette commune.</span>";
    return;
  }

  const prix = ligne.prix_m2;
  const loyer = (prix * surface).toFixed(0);

  resultEl.innerHTML = `💰 Loyer estimé : <strong>${loyer} €</strong> / mois<br><small>(${prix.toFixed(2)} €/m²)</small>`;
  document.getElementById("form-contact").style.display = "block";

  const whatsappMessage = encodeURIComponent(`Bonjour, je souhaite louer un ${typologie.toUpperCase()} à ${commune} de ${surface} m². Loyer estimé : ${loyer} €/mois.`);
  document.getElementById("whatsapp-link").href = `https://wa.me/33612345678?text=${whatsappMessage}`;
}

// lancer au chargement
window.addEventListener('DOMContentLoaded', chargerCommunes);
