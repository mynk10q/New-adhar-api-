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

    // 🔥 NEW BACKEND API
    const url =
      `https://users-xinfo-admin-eight.vercel.app/api?key=lljeliye&type=adhar&term=${term}`;

    const response = await fetch(url);
    const data = await response.json();

    // ❌ Agar blank ya invalid data aaye
    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Data Found"
      });
    }

    // ✅ Branding
    data.BUY_API = "@mynk_mynk_mynk";
    data.SUPPORT = "@mynk_mynk_mynk";

    // ✅ Final Response
    return res.status(200).json({
      success: true,
      developer: "@mynk_mynk_mynk",
      result: data
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });

  }
}
