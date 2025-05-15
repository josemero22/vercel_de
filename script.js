async function consultarAPIs() {
  const nombre = document.getElementById('nombre').value.trim();
  const resultado = document.getElementById('resultado');
  
  if (!nombre) {
    resultado.innerHTML = "<p>Por favor, escribe un nombre.</p>";
    return;
  }

  resultado.innerHTML = "Consultando...";

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

    const paises = nationalizeData.country
      .map(pais => `<li>${pais.country_id} - Probabilidad: ${(pais.probability * 100).toFixed(1)}%</li>`)
      .join('');

    resultado.innerHTML = `
      <p><strong>Nombre:</strong> ${agifyData.name}</p>
      <p><strong>Edad estimada:</strong> ${agifyData.age ?? "No disponible"}</p>
      <p><strong>Género estimado:</strong> ${genderizeData.gender ?? "No disponible"} (${(genderizeData.probability * 100).toFixed(1)}%)</p>
      <p><strong>Nacionalidades probables:</strong></p>
      <ul>${paises || "<li>No disponibles</li>"}</ul>
    `;
  } catch (error) {
    resultado.innerHTML = "<p>Error al consultar las APIs.</p>";
    console.error(error);
  }
}
