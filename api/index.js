export default async function handler(req, res) {

  // 🔥 CORS FIX
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key, term } = req.query;

  if (key !== "1 month") {
    return res.status(401).json({
      success: false,
      result: [],
      message: "Invalid API Key"
    });
  }

  if (!term) {
    return res.status(400).json({
      success: false,
      result: [],
      message: "term required"
    });
  }

  // 🔥 API list (fallback system)
  const apis = [
    `https://uersxinfo-aadhar.vercel.app/secure/aadhaar?term=${term}&access_key=lund2`,
    `https://usersxinfo-adminn.vercel.app/get_data?key=demo&mobile=${term}`
  ];

  let data = null;

  for (let api of apis) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // ⏱️ 8 sec timeout

      const response = await fetch(api, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();

        if (json && (json.result || json.data)) {
          data = json;
          break; // 🔥 first working API use
        }
      }
    } catch (e) {
      continue;
    }
  }

  if (!data) {
    return res.status(200).json({
      success: false,
      result: [],
      message: "All APIs failed"
    });
  }

  let finalResult = [];

  if (Array.isArray(data.result)) {
    finalResult = data.result;
  } else if (Array.isArray(data.data)) {
    finalResult = data.data;
  }

  if (!finalResult.length) {
    return res.status(200).json({
      success: false,
      result: []
    });
  }

  // 🔥 duplicate remove
  const seen = new Set();
  finalResult = finalResult.filter(item => {
    if (!item.mobile) return true;
    if (seen.has(item.mobile)) return false;
    seen.add(item.mobile);
    return true;
  });

  // 🔥 normalize
  finalResult = finalResult.map(item => ({
    id: item.id || "",
    mobile: item.mobile || "",
    name: item.name || "",
    father_name: item.fname || item.father_name || "",
    address: item.address || "",
    alt_mobile: item.alt || "",
    circle: item.circle || "",
    id_number: item.id || "",
    email: item.email || ""
  }));

  return res.status(200).json({
    success: true,
    result: finalResult
  });
}
