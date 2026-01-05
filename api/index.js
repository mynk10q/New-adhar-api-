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

  try {
    // 🔁 Backend API
    const backendURL =
      `https://codexvortex.vercel.app/api?key=Ravan&type=${encodeURIComponent(type)}&term=${encodeURIComponent(term)}`;

    const response = await fetch(backendURL);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Backend returned invalid JSON",
        developer: "@mynk_mynk_mynk"
      });
    }

    // 🧹 Remove unwanted credits/tags
    delete data.credit;
    delete data.Credit;
    delete data.developer;
    delete data.Developer;
    delete data.LKSOCK;

    // ✅ Final response
    return res.status(200).json({
      success: true,
      result: data,
      developer: "@mynk_mynk_mynk"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Upstream API error",
      error: error.message,
      developer: "@mynk_mynk_mynk"
    });
  }
}
