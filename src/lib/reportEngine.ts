import { prisma } from '@/lib/prisma';

const rawKeys = process.env.AI_API_KEYS || "";
const API_KEYS = rawKeys.split(",").map(key => key.trim()).filter(Boolean);

// ---------- STATIC FALLBACK (per bab, berdasarkan bahasa dan tier) ----------
const staticChapters = {
  en: [
    {
      title: "Chapter 1: Authentic Character Blueprint",
      content: `<p>Your dominant archetype is the <strong>Visionary Strategist</strong>. You see patterns others miss and are driven by a hunger for meaning. Your fatal flaw is over-idealism: you often expect others to operate at your level of integrity. Lucky colors: Deep Navy & Gold. Power number: 7.</p>`
    },
    {
      title: "Chapter 2: 5-Year Financial Map",
      content: `<p>Your wealth window opens in years 2-3, peaking at age 31-33. Best sectors: AI ethics, education technology, sustainable energy. Avoid leveraged speculation. Save 30% of windfalls. Lucky numbers: 4, 11, 22. Your financial guardian is your ability to connect abstract ideas to human needs.</p>`
    },
    {
      title: "Chapter 3: Soulmate & Relationship Secrets",
      content: `<p>Highest compatibility: individuals with life path 7, 9, or 11. They will calm your restless mind. Danger zones: partners who dismiss your need for solitude. Thursday evenings are your strongest bonding window. Colors to wear on dates: soft grey & teal.</p>`
    },
    {
      title: "Chapter 4: Life Danger Warnings",
      content: `<p>Your biggest trap is trusting charisma over evidence. Never enter verbal agreements; document everything. Risky months: March & October. Physical warning signs: sharp headaches before major betrayals. Avoid any investment promising "quick, guaranteed returns" – they are your kryptonite.</p>`
    },
    {
      title: "Chapter 5: Success Execution Strategy",
      content: `<p>For 30 days: (1) Wake 40 min earlier and write one page of raw thought – this unblocks your subconscious genius. (2) Cut one toxic relationship, even if it's just emotional distance. (3) Learn one monetizable skill via deep practice (4 hours/week). Your mantra: "Depth over distraction."</p>`
    }
  ],
  es: [
    {
      title: "Capítulo 1: Plano del Carácter Auténtico",
      content: `<p>Tu arquetipo dominante es el <strong>Estratega Visionario</strong>. Ves patrones ocultos y te impulsa una necesidad de significado. Tu punto débil: el idealismo excesivo. Colores de suerte: Azul Marino y Dorado. Número de poder: 7.</p>`
    },
    {
      title: "Capítulo 2: Mapa Financiero a 5 Años",
      content: `<p>Tu ventana de riqueza se abre en los años 2-3, con pico a los 31-33 años. Sectores ideales: tecnología ética, educación digital. Evita la especulación. Ahorra el 30% de ingresos inesperados. Números de suerte: 4, 11, 22.</p>`
    },
    {
      title: "Capítulo 3: Secretos de Pareja",
      content: `<p>Compatibilidad máxima: caminos de vida 7, 9 o 11. Calma tu mente inquieta. Riesgo: parejas que no respetan tu necesidad de soledad. Ventana de conexión: jueves al atardecer. Colores para citas: gris suave y verde azulado.</p>`
    },
    {
      title: "Capítulo 4: Advertencias de Peligro",
      content: `<p>Tu mayor trampa es confiar en el carisma sin evidencia. Nunca acuerdos verbales; documento todo. Meses riesgosos: marzo y octubre. Señal física: dolores de cabeza agudos antes de traiciones. Evita inversiones con promesas "rápidas y garantizadas".</p>`
    },
    {
      title: "Capítulo 5: Estrategia de Éxito",
      content: `<p>Durante 30 días: (1) Levántate 40 min antes y escribe una página de pensamiento en bruto. (2) Corta una relación tóxica. (3) Aprende una habilidad monetizable con práctica profunda. Mantra: "Profundidad sobre distracción".</p>`
    }
  ],
  id: [
    {
      title: "Bab 1: Blueprint Karakter Asli",
      content: `<p>Arketipe dominan Anda adalah <strong>Sang Visioner Strategis</strong>. Anda melihat pola yang terlewat orang lain dan digerakkan oleh dahaga makna. Kelemahan fatal: terlalu idealis dan mengharapkan orang lain sejujur Anda. Warna keberuntungan: Biru Dongker & Emas. Angka kekuatan: 7.</p>`
    },
    {
      title: "Bab 2: Peta Keuangan 5 Tahun",
      content: `<p>Jendela rezeki terbuka di tahun ke-2 hingga 3, puncak pada usia 31-33. Sektor terbaik: teknologi etis, pendidikan digital, energi berkelanjutan. Hindari spekulasi. Simpan 30% dana tak terduga. Angka hoki: 4, 11, 22.</p>`
    },
    {
      title: "Bab 3: Rahasia Jodoh & Hubungan",
      content: `<p>Kecocokan tertinggi: mereka dengan angka kehidupan 7, 9, atau 11. Mereka mampu menenangkan pikiran Anda yang tak pernah berhenti. Zona bahaya: pasangan yang meremehkan kebutuhan Anda akan kesendirian. Momen bonding terkuat: Kamis petang. Warna saat kencan: abu-abu lembut & teal.</p>`
    },
    {
      title: "Bab 4: Peringatan Bahaya Hidup",
      content: `<p>Jebakan terbesar: memercayai karisma tanpa bukti. Jangan pernah buat perjanjian lisan; catat semuanya. Bulan rawan: Maret & Oktober. Tanda fisik: sakit kepala tajam sebelum pengkhianatan besar. Hindari investasi berjanji "cepat dan pasti untung" – itu racun Anda.</p>`
    },
    {
      title: "Bab 5: Strategi Sukses Eksekusi",
      content: `<p>Selama 30 hari: (1) Bangun 40 menit lebih awal dan tulis satu halaman pikiran mentah – ini membuka genius bawah sadar. (2) Putuskan satu hubungan beracun, walau hanya jarak emosional. (3) Pelajari satu skill menghasilkan melalui latihan mendalam 4 jam/minggu. Mantra: "Kedalaman di atas gangguan."</p>`
    }
  ]
};

function getStaticChapters(lang: string): { title: string; content: string }[] {
  if (lang === 'en') return staticChapters.en;
  if (lang === 'es') return staticChapters.es;
  return staticChapters.id;
}

// ---------- PROMPT AI TERCANGGIH, PADAT, DAN BERDAMPAK ----------
function buildPrompt(
  chapterTitle: string,
  chapterDesc: string,
  lang: string,
  userName: string,
  toolName: string,
  resultId: string
): string {
  const resultContext = resultId !== "Unknown"
    ? (lang === "en" ? `The user's specific test result is: ${resultId}. Your analysis must be directly anchored to this result.` :
       lang === "es" ? `El resultado de la prueba es: ${resultId}. Ancla tu análisis directamente en este resultado.` :
       `Hasil tes spesifik pengguna: ${resultId}. Analisis Anda harus berakar kuat pada hasil ini.`)
    : "";

  const toneInstruction = lang === "en"
    ? `Write as an elite metaphysical psychologist. Every sentence must deliver a surprising, actionable insight. NO filler, NO "based on your name", NO generic life advice. Be razor-sharp, even controversial if true. Output pure HTML: only <h3> for the title and <p> for paragraphs. Use <strong> for key phrases. Strictly 180-250 words.`
    : lang === "es"
    ? `Escribe como psicólogo metafísico de élite. Cada oración debe entregar una visión sorprendente y accionable. SIN relleno, SIN "basado en tu nombre", SIN consejos genéricos. Sé filoso, incluso controversial si es verdad. HTML puro: solo <h3> para el título y <p>. Usa <strong> para frases clave. Estrictamente 180-250 palabras.`
    : `Tulislah sebagai psikolog metafisika elit. Setiap kalimat harus memberikan insight mengejutkan dan langsung bisa dieksekusi. TANPA basa-basi, TANPA "berdasarkan nama Anda", TANPA nasihat generik. Tajam, bahkan kontroversial jika memang benar. Output HTML murni: hanya <h3> untuk judul dan <p>. Gunakan <strong> untuk frasa kunci. Ketat 180-250 kata.`;

  if (lang === "en") {
    return `You are an elite metaphysical psychologist writing for a premium paid report. User: ${userName}, Tool: ${toolName}. ${resultContext}
Focus chapter: "${chapterTitle}". ${toneInstruction}
Start directly with <h3>${chapterTitle}</h3> followed by your razor-sharp analysis.`;
  } else if (lang === "es") {
    return `Eres un psicólogo metafísico de élite redactando un informe premium pagado. Usuario: ${userName}, Herramienta: ${toolName}. ${resultContext}
Enfoque: "${chapterTitle}". ${toneInstruction}
Comienza directamente con <h3>${chapterTitle}</h3> seguido de tu análisis filoso.`;
  } else {
    return `Anda adalah psikolog metafisika elit yang menulis laporan premium berbayar. Pengguna: ${userName}, Alat: ${toolName}. ${resultContext}
Fokus bab: "${chapterTitle}". ${toneInstruction}
Mulai langsung dengan <h3>${chapterTitle}</h3> diikuti analisis tajam Anda.`;
  }
}

// ---------- FETCH DENGAN RETRY & ROTASI KUNCI (PARALEL-READY) ----------
async function fetchChapterWithRetry(
  chapterIndex: number,
  totalChapters: number,
  chapterTitle: string,
  chapterDesc: string,
  lang: string,
  userName: string,
  toolName: string,
  resultId: string
): Promise<string | null> {
  if (API_KEYS.length === 0) return null;

  let attempt = 0;
  const maxRetries = 5;
  // Rotasi kunci berdasarkan chapter index + attempt
  while (attempt < maxRetries) {
    const keyIndex = (chapterIndex + attempt) % API_KEYS.length;
    const apiKey = API_KEYS[keyIndex];
    const prompt = buildPrompt(chapterTitle, chapterDesc, lang, userName, toolName, resultId);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();

      if (data.error) {
        const msg = data.error.message || "";
        if (msg.includes("high demand") || msg.includes("quota") || msg.includes("rate")) {
          attempt++;
          await new Promise(r => setTimeout(r, 2000)); // tunggu 2 detik sebelum retry
          continue;
        }
        return null;
      }

      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        rawText = rawText.replace(/```html/gi, "").replace(/```/gi, "").replace(/style="[^"]*"/gi, "").trim();
        return rawText;
      }
      return null;
    } catch (e) {
      attempt++;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

// ---------- FUNGSI UTAMA (PARALEL, TIERING, FALLBACK) ----------
export async function generatePremiumReport(
  userName: string,
  toolName: string,
  lang: string = "id",
  resultId: string = "Unknown",
  tier: string = "premium"
) {
  // Definisi bab (judul + deskripsi untuk prompt)
  const allChapters = [
    { 
      title: lang === "en" ? "Chapter 1: Authentic Character Blueprint" : lang === "es" ? "Capítulo 1: Plano del Carácter Auténtico" : "Bab 1: Blueprint Karakter Asli",
      desc: lang === "en" ? "Deep personality architecture and hidden strengths/weaknesses." : lang === "es" ? "Arquitectura profunda de personalidad y fortalezas/debilidades ocultas." : "Arsitektur kepribadian mendalam serta kekuatan/kelemahan tersembunyi."
    },
    { 
      title: lang === "en" ? "Chapter 2: 5-Year Financial Map" : lang === "es" ? "Capítulo 2: Mapa Financiero a 5 Años" : "Bab 2: Peta Keuangan 5 Tahun",
      desc: lang === "en" ? "Wealth trajectory, best sectors, and timing." : lang === "es" ? "Trayectoria de riqueza, mejores sectores y sincronización." : "Lintasan rezeki, sektor terbaik, dan momentum."
    },
    { 
      title: lang === "en" ? "Chapter 3: Soulmate & Relationship Secrets" : lang === "es" ? "Capítulo 3: Secretos de Pareja y Relaciones" : "Bab 3: Rahasia Jodoh & Hubungan",
      desc: lang === "en" ? "Compatibility signatures and relational traps." : lang === "es" ? "Firmas de compatibilidad y trampas relacionales." : "Pola kecocokan dan jebakan hubungan."
    },
    { 
      title: lang === "en" ? "Chapter 4: Life Danger Warnings" : lang === "es" ? "Capítulo 4: Advertencias de Peligro Vital" : "Bab 4: Peringatan Bahaya Hidup",
      desc: lang === "en" ? "Fatal mistakes, taboos, and danger months." : lang === "es" ? "Errores fatales, tabúes y meses de peligro." : "Kesalahan fatal, pantangan, dan bulan rawan."
    },
    { 
      title: lang === "en" ? "Chapter 5: Success Execution Strategy" : lang === "es" ? "Capítulo 5: Estrategia de Éxito" : "Bab 5: Strategi Sukses Eksekusi",
      desc: lang === "en" ? "Concrete morning routine and 30-day transformation." : lang === "es" ? "Rutina matutina concreta y transformación en 30 días." : "Rutin pagi konkret dan transformasi 30 hari."
    }
  ];

  // Potong berdasarkan tier (basic = 2 bab)
  const targetChapters = tier === "basic" ? allChapters.slice(0, 2) : allChapters;

  // PANGGIL SEMUA BAB SECARA PARALEL
  const aiResults = await Promise.all(
    targetChapters.map((ch, i) =>
      fetchChapterWithRetry(i, targetChapters.length, ch.title, ch.desc, lang, userName, toolName, resultId)
    )
  );

  // Ambil konten statis sebagai fallback per bab (sesuai bahasa)
  const staticChaptersList = getStaticChapters(lang);
  // Potong static sesuai tier juga
  const targetStatic = tier === "basic" ? staticChaptersList.slice(0, 2) : staticChaptersList;

  // Gabungkan: jika AI sukses pakai AI, jika tidak pakai static chapter yang sesuai
  const finalChapters = targetChapters.map((ch, i) => {
    if (aiResults[i]) return aiResults[i]!;
    // Fallback: gunakan konten statis untuk bab ini (indeks sama)
    const fallback = targetStatic[i];
    if (fallback) {
      return `<h3>${fallback.title}</h3>${fallback.content}`;
    }
    // Jika tidak ada, berikan placeholder (seharusnya tidak terjadi)
    return `<h3>${ch.title}</h3><p>${lang === "en" ? "Insight temporarily unavailable." : lang === "es" ? "Información no disponible temporalmente." : "Wawasan sementara tidak tersedia."}</p>`;
  });

  return finalChapters.join("");
}