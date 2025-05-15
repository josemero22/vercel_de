async function consultarAPIs() {
  const nombre = document.getElementById('nombre').value.trim();
  const resultado = document.getElementById('resultado');
  
  if (!nombre) {
    resultado.innerHTML = `<div class="alert alert-warning">Por favor, escribe un nombre.</div>`;
    return;
  }

  resultado.innerHTML = `<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div> Consultando...`;

  try {
    const agifyURL = `https://api.agify.io/?name=${nombre}`;
    const genderizeURL = `https://api.genderize.io/?name=${nombre}`;
    const nationalizeURL = `https://api.nationalize.io/?name=${nombre}`;

    const [agifyRes, genderizeRes, nationalizeRes] = await Promise.all([
      fetch(agifyURL),
      fetch(genderizeURL),
      fetch(nationalizeURL)
    ]);

    const agifyData = await agifyRes.json();
    const genderizeData = await genderizeRes.json();
    const nationalizeData = await nationalizeRes.json();
    const generoMap = {
      male: "Masculino",
      female: "Femenino",
      null: "No disponible",
      undefined: "No disponible"
    };
    const generoEsp = generoMap[genderizeData.gender] ?? "No disponible";


    // Construir lista con banderas
    const paises = nationalizeData.country
      .map(pais => {
        // Flagcdn usa códigos en minúsculas
        const codeLower = pais.country_id.toLowerCase();
        const flagUrl = `https://flagcdn.com/w40/${codeLower}.png`;
        return `
          <li class="mb-1">
            <img src="${flagUrl}" alt="Bandera ${pais.country_id}" class="flag-icon" />
            <strong>${pais.country_id}</strong> - Probabilidad: ${(pais.probability * 100).toFixed(1)}%
          </li>
        `;
      })
      .join('');

    resultado.innerHTML = `
      <p><strong>Nombre:</strong> ${agifyData.name}</p>
      <p><strong>Edad estimada:</strong> ${agifyData.age ?? "No disponible"}</p>
      <p><strong>Género estimado:</strong> ${generoEsp} (${(genderizeData.probability * 100).toFixed(1)}%)</p>
      <!-- <p><strong>Género estimado:</strong> ${genderizeData.gender ?? "No disponible"} (${(genderizeData.probability * 100).toFixed(1)}%)</p> --> 
      <p><strong>Nacionalidades probables:</strong></p>
      <ul class="list-unstyled">${paises || "<li>No disponibles</li>"}</ul>
    `;
  } catch (error) {
    resultado.innerHTML = `<div class="alert alert-danger">Error al consultar las APIs.</div>`;
    console.error(error);
  }
}
