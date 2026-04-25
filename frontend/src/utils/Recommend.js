import crops from "../data/crops.json";

// ==============================
// NORMALIZE FUNCTION
// ==============================
const normalize = (value, min, max) => {
  if (value === undefined || min === undefined || max === undefined) return 0;

  if (max === min) return 1;
  if (value < min || value > max) return 0;

  const center = (min + max) / 2;
  const distance = Math.abs(value - center);
  const maxDistance = (max - min) / 2;

  return Math.max(0, 1 - distance / maxDistance);
};

// ==============================
// MAIN FUNCTION (NO DISTRICT)
// ==============================
export const recommendCrops = (conditions) => {
  if (!conditions) return [];

  const results = [];

  crops.forEach((row) => {

    // ❌ REMOVED DISTRICT FILTER

    // ==========================
    // 🔥 SCORES
    // ==========================
    const soilScore = normalize(
      conditions.soil_moisture,
      row.Soil_Moisture_Min,
      row.Soil_Moisture_Max
    );

    const tempScore = normalize(
      conditions.temperature,
      row.Temp_Min,
      row.Temp_Max
    );

    const humidityScore = normalize(
      conditions.humidity,
      row.Humidity_Min,
      row.Humidity_Max
    );

    const rainfallScore = normalize(
      conditions.rainfall,
      row.Rainfall_Min,
      row.Rainfall_Max
    );

    // ==========================
    // 🔥 HARD REJECTION
    // ==========================
    if (soilScore === 0 && tempScore === 0) return;

    // ==========================
    // 🔥 FINAL SCORE
    // ==========================
    const totalScore =
      0.35 * soilScore +
      0.30 * tempScore +
      0.20 * humidityScore +
      0.15 * rainfallScore;

    results.push({
      crop: row.crop,
      score: Number(totalScore.toFixed(3)),
      image: row.image
    });
  });

  // ==========================
  // 🔥 SORT RESULTS
  // ==========================
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 95);
};