export default async function handler(req, res) {
  const { key, type, term } = req.query;

  // 🔐 Front API Key Check
  if (key !== "mynkz") {
    return res.status(401).json({
      success: false,
      message: "Invalid API Key",
      developer: "@mynk_mynk_mynk"
    });
  }

  // ❗ Required params
  if (!type || !term) {
    return res.status(400).json({
      success: false,
      message: "type and term parameter required",
      example:
        "https://your-vercel-api.vercel.app/api?key=mynkz&type=id_number&term=519722471006",
      developer: "@mynk_mynk_mynk"
    });
  }

  // 🔁 Backend APIs (Main + Backup)
  const apis = [
    `https://codexvortex.vercel.app/api?key=Ravan&type=${encodeURIComponent(type)}&term=${encodeURIComponent(term)}`,
    `https://richswayam.vercel.app/api?key=Ravan&type=${encodeURIComponent(type)}&term=${encodeURIComponent(term)}`
  ];

  let data = null;
  let lastError = null;

  for (const api of apis) {
    try {
      const response = await fetch(api, { timeout: 10000 });

      if (!response.ok) continue;

      const text = await response.text();

      data = JSON.parse(text);
      break; // ✅ Success → loop stop

    } catch (err) {
      lastError = err.message;
      continue; // ❌ Fail → try next API
    }
  }

  // ❌ All APIs failed
  if (!data) {
    return res.status(500).json({
      success: false,
      message: "All backend APIs are down",
      error: lastError,
      developer: "@mynk_mynk_mynk"
    });
  }

  // 🧹 Remove unwanted credits/tags
  delete data.credit;
  delete data.Credit;
  delete data.developer;
  delete data.Developer;
  delete data.LKSOCK;

  // ✅ Final response (Same Format)
  return res.status(200).json({
    success: true,
    result: data,
    developer: "@mynk_mynk_mynk"
  });
}
