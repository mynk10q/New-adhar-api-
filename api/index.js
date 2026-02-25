export default async function handler(req, res) {
  const { key, type, term } = req.query;

  if (key !== "mynkz") {
    return res.status(401).json({
      success: false,
      result: [],
      message: "Invalid API Key"
    });
  }

  if (!type || !term) {
    return res.status(400).json({
      success: false,
      result: [],
      message: "type and term required"
    });
  }

  const apis = type === "id_number"
    ? [
        `https://aadharid.asapiservices.workers.dev/?id_num=${encodeURIComponent(term)}`,
        `https://codexvortex.vercel.app/api?key=Ravan&type=${type}&term=${term}`,
        `https://richswayam.vercel.app/api?key=Ravan&type=${type}&term=${term}`
      ]
    : [
        `https://codexvortex.vercel.app/api?key=Ravan&type=${type}&term=${term}`,
        `https://richswayam.vercel.app/api?key=Ravan&type=${type}&term=${term}`
      ];

  let data = null;

  for (const api of apis) {
    try {
      const response = await fetch(api);
      if (!response.ok) continue;

      const json = await response.json();

      if (json && Object.keys(json).length > 0) {
        data = json;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  // ❌ No data found
  if (!data) {
    return res.status(200).json({
      success: false,
      result: []
    });
  }

  // remove credits etc
  delete data.credit;
  delete data.Credit;
  delete data.developer;
  delete data.Developer;

  // ✅ FINAL RESPONSE (BOT FRIENDLY)
  return res.status(200).json({
    success: true,
    result: data
  });
}
