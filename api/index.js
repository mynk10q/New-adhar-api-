export default async function handler(req, res) {
  const { key, type, term } = req.query;

  // ✅ API key check
  if (key !== "loda") {
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

  // 🔁 backend APIs (with backup)
  const apis = type === "id_number"
    ? [
        `https://aadharid.asapiservices.workers.dev/?id_num=${encodeURIComponent(term)}`,
        `https://codexvortex.vercel.app/api?key=Ravan&type=${type}&term=${term}`,
        `https://richswayam.vercel.app/api?key=Ravan&type=${type}&term=${term}`,
        `https://uersxinfo-aadhar.vercel.app/secure/aadhaar?term=${term}&access_key=lund2`
      ]
    : [
        `https://codexvortex.vercel.app/api?key=Ravan&type=${type}&term=${term}`,
        `https://richswayam.vercel.app/api?key=Ravan&type=${type}&term=${term}`,
        `https://uersxinfo-aadhar.vercel.app/secure/aadhaar?term=${term}&access_key=lund2`
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

  // ❌ no response
  if (!data) {
    return res.status(200).json({
      success: false,
      result: []
    });
  }

  // 🧹 remove unwanted keys
  delete data.credit;
  delete data.Credit;
  delete data.developer;
  delete data.Developer;
  delete data.LKSOCK;

  // 🔄 extract array safely
  let finalResult = [];

  if (Array.isArray(data?.data)) {
    finalResult = data.data;
  } else if (Array.isArray(data?.result?.data)) {
    finalResult = data.result.data;
  } else if (Array.isArray(data?.result)) {
    finalResult = data.result;
  } else if (Array.isArray(data)) {
    finalResult = data;
  }

  // ❌ empty check
  if (!finalResult.length) {
    return res.status(200).json({
      success: false,
      result: []
    });
  }

  // ✅ remove duplicate mobiles
  const seenMobile = new Set();
  finalResult = finalResult.filter(item => {
    if (!item.mobile) return true;
    if (seenMobile.has(item.mobile)) return false;
    seenMobile.add(item.mobile);
    return true;
  });

  // ✅ remove duplicate id_number
  const seenId = new Set();
  finalResult = finalResult.filter(item => {
    const id = item.id || item.id_number;
    if (!id) return true;
    if (seenId.has(id)) return false;
    seenId.add(id);
    return true;
  });

  // 🔥 FINAL NORMALIZATION (MAIN FIX)
  finalResult = finalResult.map(item => ({
    id: item.id || item.id_number || "",
    mobile: item.mobile || "",
    name: item.name || "",
    father_name: item.fname || item.father_name || "",
    address: item.address || "",
    alt_mobile: item.alt || item.alt_mobile || "",
    circle: item.circle || "",
    id_number: item.id || item.id_number || "",
    email: item.email || ""
  }));

  // ✅ FINAL RESPONSE
  return res.status(200).json({
    success: true,
    result: finalResult
  });
}
