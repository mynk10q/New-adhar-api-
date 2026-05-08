export default async function handler(req, res) {

  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key, term } = req.query;

  // 🔐 API Key Check
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

    // 🔥 Hidden Main API
    const REAL_KEY = "ZEPH-MAYANK";

    const url =
      `https://www.zephrexdigital.site/api?key=${REAL_KEY}&type=AADHAAR&term=${term}`;

    const response = await fetch(url);
    const data = await response.json();

    // ✅ Result Safe
    const results = Array.isArray(data.result)
      ? data.result.map((x) => ({
          id: x.id || "",
          mobile: x.mobile || "",
          name: x.name || "",
          father_name: x.father_name || "",
          address: x.address || "",
          alt_mobile: x.alt_mobile || "",
          circle: x.circle || "",
          email: x.email || ""
        }))
      : [];

    // ✅ Final Clean Response
    return res.status(200).json({
      success: true,
      count: results.length,
      result: results
    });

  } catch (e) {

    return res.status(500).json({
      success: false,
      message: "API Down",
      error: String(e)
    });

  }
}
