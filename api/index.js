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
  if (!term) {
    return res.status(400).json({
      success: false,
      result: [],
      message: "term required"
    });
  }

  // 🔥 ONLY USERXINFO API
  const api = `https://uersxinfo-aadhar.vercel.app/secure/aadhaar?term=${term}&access_key=lund2`;

  let data = null;

  try {
    const response = await fetch(api);
    if (response.ok) {
      data = await response.json();
    }
  } catch (e) {}

  // ❌ no data
  if (!data) {
    return res.status(200).json({
      success: false,
      result: []
    });
  }

  // 🔄 extract array
  let finalResult = [];

  if (Array.isArray(data?.result)) {
    finalResult = data.result;
  } else if (Array.isArray(data?.data)) {
    finalResult = data.data;
  }

  // ❌ empty
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

  // 🔥 FINAL NORMALIZATION
  finalResult = finalResult.map(item => ({
    id: item.id || "",
    mobile: item.mobile || "",
    name: item.name || "",
    father_name: item.fname || "",
    address: item.address || "",
    alt_mobile: item.alt || "",
    circle: item.circle || "",
    id_number: item.id || "",
    email: item.email || ""
  }));

  // ✅ FINAL RESPONSE
  return res.status(200).json({
    success: true,
    result: finalResult
  });
}
