export default async function handler(req, res) {
  const { key, type, term } = req.query;

  // ✅ API key check
  if (key !== "mynkz") {
    return res.status(401).json({
      success: false,
      result: [],
      message: "Invalid API Key"
    });
  }

  // ✅ required params
  if (!type || !term) {
    return res.status(400).json({
      success: false,
      result: [],
      message: "type and term required"
    });
  }

  // 🔁 backend APIs
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

  // 🔎 try APIs one by one
  for (const api of apis) {
    try {
      const response = await fetch(api);
      if (!response.ok) continue;

      const json = await response.json();

      if (json) {
        data = json;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  // ❌ no backend response
  if (!data) {
    return res.status(200).json({
      success: false,
      result: []
    });
  }

  // 🧹 remove unwanted tags
  delete data.credit;
  delete data.Credit;
  delete data.developer;
  delete data.Developer;
  delete data.LKSOCK;

  // 🔥 convert response → array format
  let finalResult = [];

  if (data?.data && Array.isArray(data.data)) {
    finalResult = data.data;
  } else if (data?.result?.data && Array.isArray(data.result.data)) {
    finalResult = data.result.data;
  } else if (Array.isArray(data.result)) {
    finalResult = data.result;
  } else if (Array.isArray(data)) {
    finalResult = data;
  }

  // ❌ empty data
  if (!finalResult || finalResult.length === 0) {
    return res.status(200).json({
      success: false,
      result: []
    });
  }

  // ✅ remove duplicate mobiles
  const seen = new Set();
  finalResult = finalResult.filter(item => {
    if (!item.mobile) return true;
    if (seen.has(item.mobile)) return false;
    seen.add(item.mobile);
    return true;
  });

  // ✅ FINAL BOT FRIENDLY OUTPUT
  return res.status(200).json({
    success: true,
    result: finalResult
  });
}
