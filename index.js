document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(event) {
  console.log("File selected");
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    // var data = e.target.result;
    /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
    // var workbook = XLSX.read(e.target.result);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log("JSON Data:", jsonData);

    const averages = computeAverages(jsonData);
    displayAverages(averages);
  };

  reader.readAsArrayBuffer(file);
}

function computeAverages(data) {
  let totalOEE = 0;
  let totalProductivity = 0;
  let totalQuality = 0;
  let totalAvailability = 0;

  data.forEach((row) => {
    totalOEE += parseFloat(row["oee"]);
    totalProductivity += parseFloat(row["productivity"]);
    totalQuality += parseFloat(row["quality"]);
    totalAvailability += parseFloat(row["availability"]);
  });

  const numRecords = data.length;
  return {
    oee: totalOEE / numRecords,
    productivity: totalProductivity / numRecords,
    quality: totalQuality / numRecords,
    availability: totalAvailability / numRecords,
  };
}

function displayAverages(averages) {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = `
        <h2>Average Metrics</h2>
        <p>OEE: ${averages.oee.toFixed(2)}</p>
        <p>Productivity: ${averages.productivity.toFixed(2)}</p>
        <p>Quality: ${averages.quality.toFixed(2)}</p>
        <p>Availability: ${averages.availability.toFixed(2)}</p>
    `;
}
