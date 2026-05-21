export default async function handler(req, res) {

  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // ✅ OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ QUERY
  const { key, term } = req.query;

  // 🔐 API KEY CHECK
  if (key !== "mynk") {
    return res.status(401).json({
      success: false,
      message: "Invalid API Key"
    });
  }

  // ❌ TERM REQUIRED
  if (!term) {
    return res.status(400).json({
      success: false,
      message: "term required"
    });
  }

  try {

    // 🔥 BACKEND API
    const response = await fetch(
      `https://users-xinfo-admin-eight.vercel.app/api?key=lljeliye&type=adhar&term=${term}`
    );

    const data = await response.json();

    // ❌ REMOVE TAG
    delete data.tag;

    // ❌ REMOVE USERXINFO BRANDING
    delete data.BUY_API;
    delete data.SUPPORT;

    // ✅ CUSTOM BRANDING
    data.BUY_API = "@mynk_mynk_mynk";
    data.SUPPORT = "@mynk_mynk_mynk";

    // ✅ FINAL RESPONSE
    return res.status(200).json(data);

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });

  }
}
