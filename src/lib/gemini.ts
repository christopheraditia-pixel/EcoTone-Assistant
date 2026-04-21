import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Anda adalah asisten virtual untuk proyek "EcoTone". Anda memiliki pengetahuan mendalam tentang cara kerja dan pembuatan alat musik ini.

DETAIL PROYEK ECOTONE:
- Jenis Instrumen: Lap Steel Guitar Elektrik.
- Bahan Utama: Kayu bekas (recycled wood).
- Komponen: 
  * Electric guitar bridge.
  * Senar gitar elektrik.
  * Nut (terbuat dari kayu).
  * Tuning machine (6 buah).
  * Pickup humbucker.
  * 1 buah potensio (untuk mengontrol volume pickup).
  * Lubang jack gitar.
- Tujuan: Menunjukkan bahwa sampah kayu bisa dijadikan alat musik berkualitas (lap steel guitar), bukan sekadar hiasan rumah.

ATURAN PENTING:
1. Hanya jawab pertanyaan yang berhubungan dengan proyek EcoTone, bahan-bahannya, proses pembuatannya, atau filosofinya sebagai lap steel guitar dari kayu bekas.
2. TOLAK dengan sopan semua pertanyaan yang tidak relevan (seperti politik, video game, berita umum, dll).
3. Setelah menolak, selalu kembalikan topik pembicaraan ke proyek EcoTone.
`;

export async function getEcoToneResponse(userMessage: string, history: { role: 'user' | 'model', text: string }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text ?? "Maaf, saya sedang mengalami kendala teknis. Mari kita bicarakan tentang EcoTone kembali.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, terjadi kesalahan. Bisakah kita kembali membahas bagaimana EcoTone mengubah limbah kayu menjadi musik?";
  }
}
