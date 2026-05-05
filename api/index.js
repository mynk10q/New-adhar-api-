export default async function handler(req, res) {

  // 🔥 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key, term } = req.query;

  // 🔐 Front key
  if (key !== "mynk") {
    return res.status(401).json({
      success: false,
      message: "Invalid API Key"
    });
  }

  if (!term) {
    return res.status(400).json({
      success: false,
      message: "term required"
    });
  }

  try {

    // 🔥 Hidden Zephrex API
    const REAL_KEY = "ZEPH-MAYANK";

    const url = `https://www.zephrexdigital.site/api?key=${REAL_KEY}&type=AADHAAR&term=${term}`;

    const response = await fetch(url);
    const data = await response.json();

    // 🔥 Remove original credit
    if (data.dev_credit) delete data.dev_credit;
    if (data.credit) delete data.credit;

    if (data.BUY_API) data.BUY_API = "@mynk_mynk_mynk";
    if (data.SUPPORT) data.SUPPORT = "@mynk_mynk_mynk";

    return res.status(200).json({
      ...data,
      BUY_API: "@mynk_mynk_mynk",
      SUPPORT: "@mynk_mynk_mynk",
      dev_credit: "@mynk_mynk_mynk",
      credit: "@mynk_mynk_mynk"
    });

  } catch (e) {

    return res.status(500).json({
      success: false,
      message: "API Down",
      error: String(e)
    });

  }
}
