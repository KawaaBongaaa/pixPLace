import crypto from "crypto";
import { google } from "googleapis";

// 🔒 Проверка подписи Telegram
function verifyTelegramAuth(initData) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.BOT_TOKEN)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return calculatedHash === hash;
}

export default async function handler(req, res) {
  // 🔧 CORS Headers для поддержки cross-origin запросов
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Обработка preflight OPTIONS запроса
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { user_id, username, first_name, last_name, initData, traffic_source } = req.body;

  if (!initData || !verifyTelegramAuth(initData)) {
    return res.status(401).json({ error: "Invalid Telegram signature" });
  }

  try {
    // 🔑 Авторизация Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GCP_PROJECT_ID,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GCP_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const now = new Date().toISOString();

    // 📋 Загружаем колонку telegram_user_id (M)
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Users!M:M",
    });

    const userIds = existing.data.values?.flat() || [];
    const existingRowIndex = userIds.findIndex(
      (id) => String(id) === String(user_id)
    );

    if (existingRowIndex === -1) {
      // 🆕 Добавляем нового пользователя
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Users!A:S",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            "trial",                           // STATUS
            20,                                // trial Img Gen Calls
            traffic_source || "webapp",        // Traffic from
            "pixPLace",                        // channel_name
            "309808",                          // channel_id (фикс)
            user_id,                           // user_id
            username || "",                    // Username
            first_name || "",                  // First Name
            last_name || "",                   // Last Name
            0,                                 // Premium Generations
            "ar",                              // Language
            "FALSE",                           // PREMIUM
            user_id,                           // telegram_user_id
            "no",                              // subscription_id
            "Tribute_link",                    // Tribute_link
            now,                               // Date
            now,                               // created_at
            "",                                // expires_at
            0,                                 // premium_upscale_calls
          ]],
        },
      });

      console.log("🆕 Added new trial user:", username);
      return res.status(200).json({ ok: true, newUser: true });
    } else {
      // 🔁 Если уже есть, обновляем STATUS и дату
      const row = existingRowIndex + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Users!A${row}:A${row}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [["trial"]] },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Users!P${row}:P${row}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[now]] },
      });

      console.log("✅ Updated existing user:", username);
      return res.status(200).json({ ok: true, newUser: false });
    }
  } catch (e) {
    console.error("❌ Sheets error:", e);
    res.status(500).json({ error: e.message });
  }
}
