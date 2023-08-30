const convertBtn = document.getElementById("convertBtn");
const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("currency");
const resultText = document.getElementById("result");
const chartCanvas = document.getElementById("chart");
let chart = null;

convertBtn.addEventListener("click", async () => {
  try {
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;

    if (isNaN(amount) || amount <= 0) {
      resultText.textContent = "Ingrese un monto válido.";
      return;
    }

    const response = await fetch(`https://mindicador.cl/api/${currency}`);
    const data = await response.json();

    if (data.serie && data.serie.length > 0) {
      const currentValue = data.serie[0].valor;
      resultText.textContent = `${amount} pesos chilenos son aproximadamente ${amount / currentValue} ${currency.toUpperCase()}`;

      if (chart) {
        chart.destroy();
      }

      const chartLabels = data.serie.slice(0, 10).map(entry => entry.fecha);
      const chartData = data.serie.slice(0, 10).map(entry => entry.valor);

      const ctx = chartCanvas.getContext("2d");
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartLabels.reverse(),
          datasets: [{
            label: `Valor de ${currency.toUpperCase()}`,
            data: chartData.reverse(),
            borderColor: "#3e95cd",
            fill: false
          }]
        },
        options: {
          responsive: true
        }
      });
    } else {
      resultText.textContent = "No se pudo obtener el valor de la moneda.";
    }
  } catch (error) {
    resultText.textContent = "Error al realizar la conversión.";
  }
});