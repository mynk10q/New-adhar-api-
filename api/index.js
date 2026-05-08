export default async function handler(req, res) {

  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key, term } = req.query;

  // 🔐 API KEY
  if (key !== "mynk") {
    return res.status(401).json({
      success: false,
      message: "Invalid API Key"
    });
  }

  // ❌ No term
  if (!term) {
    return res.status(400).json({
      success: false,
      message: "term required"
    });
  }

  try {

    // 🔥 Hidden API
    const REAL_KEY = "ZEPH-MAYANK";

    const url =
      `https://www.zephrexdigital.site/api?key=${REAL_KEY}&type=AADHAAR&term=${term}`;

    const response = await fetch(url);
    const data = await response.json();

    // ✅ Correct Result Fetch
    let raw = [];

    if (Array.isArray(data.result)) {
      raw = data.result;
    }
    else if (data.data && Array.isArray(data.data.result)) {
      raw = data.data.result;
    }

    // ✅ Clean Format
    const result = raw.map((x) => ({
      id: x.id || "",
      mobile: x.mobile || "",
      name: x.name || "",
      father_name: x.father_name || x.fname || "",
      address: x.address || "",
      alt_mobile: x.alt_mobile || x.alt || "",
      circle: x.circle || "",
      email: x.email || ""
    }));

    // ✅ Final Response
    return res.status(200).json({
      success: true,
      count: result.length,
      result
    });

  } catch (e) {

    return res.status(500).json({
      success: false,
      message: "API Down",
      error: String(e)
    });

  }
}
