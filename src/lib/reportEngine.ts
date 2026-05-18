const rawKeys = process.env.AI_API_KEYS || "";
const API_KEYS = rawKeys.split(",").map(key => key.trim()).filter(Boolean);

if (API_KEYS.length === 0) {
  console.warn("PERINGATAN: AI_API_KEYS kosong, menggunakan fallback statis.");
}

// Fallback statis disesuaikan dengan tier agar tidak membocorkan 5 bab untuk paket basic
function generateStaticReport(userName: string, toolName: string, lang: string, resultId: string, tier: string): string {
  const isEn = lang === "en";
  const isEs = lang === "es";

  const allStaticChapters = [
    {
      title: isEn ? "Chapter 1: Authentic Character Blueprint" : isEs ? "Capítulo 1: Plan de Carácter Auténtico" : "Bab 1: Blueprint Karakter Asli",
      content: isEn
        ? `<p>Based on your name, <strong>${userName}</strong>, and result <strong>${resultId}</strong>, your dominant personality archetype is strong. You see the big picture before others. Weakness: too idealistic. Lucky colors: Dark Blue & Gold.</p>`
        : isEs
        ? `<p>Según su nombre, <strong>${userName}</strong>, y resultado <strong>${resultId}</strong>, su arquetipo es fuerte. Ve el panorama general antes que otros. Debilidad: demasiado idealista. Colores de la suerte: Azul Marino y Oro.</p>`
        : `<p>Berdasarkan nama Anda, <strong>${userName}</strong>, dan hasil tes <strong>${resultId}</strong>, arketipe kepribadian Anda sangat kuat. Anda melihat gambaran besar. Kelemahan: terlalu idealis. Warna keberuntungan: Biru Dongker & Emas.</p>`,
    },
    {
      title: isEn ? "Chapter 2: Basic Financial Map" : isEs ? "Capítulo 2: Mapa Financiero Básico" : "Bab 2: Peta Keuangan Dasar",
      content: isEn
        ? `<p>You will reach a financial peak in year 3. Best sectors: technology, education. Avoid speculation. Save 20% for emergency. Lucky numbers: 7, 12, 33.</p>`
        : isEs
        ? `<p>Alcanzará un pico financiero en el año 3. Mejores sectores: tecnología, educación. Evite especulaciones. Ahorre el 20% para emergencias. Números de la suerte: 7, 12, 33.</p>`
        : `<p>Anda akan mencapai puncak keuangan di tahun ke-3. Sektor terbaik: teknologi, pendidikan. Hindari spekulasi. Simpan 20% untuk darurat. Angka keberuntungan: 7, 12, 33.</p>`,
    },
    {
      title: isEn ? "Chapter 3: Soulmate & Relationship Secrets" : isEs ? "Capítulo 3: Secretos de Pareja y Relaciones" : "Bab 3: Rahasia Jodoh & Hubungan",
      content: isEn
        ? `<p>Best match: weton neptu 9, 14, or 17. Improve communication on Thursdays & Saturdays. Lucky colors: Pink & White.</p>`
        : isEs
        ? `<p>Mejor compatibilidad: neptu weton 9, 14 o 17. Mejore la comunicación los jueves y sábados. Colores de la suerte: Rosa y Blanco.</p>`
        : `<p>Kecocokan terbaik: neptu weton 9, 14, atau 17. Tingkatkan komunikasi di hari Kamis & Sabtu. Warna keberuntungan: Pink & Putih.</p>`,
    },
    {
      title: isEn ? "Chapter 4: Life Danger Warnings" : isEs ? "Capítulo 4: Advertencias de Peligro Vital" : "Bab 4: Peringatan Bahaya Hidup",
      content: isEn
        ? `<p>Avoid trusting new people too fast. Never partner without written contract. Risky months: March & October.</p>`
        : isEs
        ? `<p>Evite confiar demasiado rápido en gente nueva. Nunca se asocie sin contrato escrito. Meses de riesgo: marzo y octubre.</p>`
        : `<p>Jangan terlalu cepat percaya pada orang baru. Hindari kerjasama tanpa kontrak tertulis. Bulan berisiko: Maret & Oktober.</p>`,
    },
    {
      title: isEn ? "Chapter 5: Success Execution Strategy" : isEs ? "Capítulo 5: Estrategia de Éxito" : "Bab 5: Strategi Sukses Eksekusi",
      content: isEn
        ? `<p>Starting tomorrow: (1) Wake 30 min earlier, (2) Limit social media, (3) Learn a new skill monthly.</p>`
        : isEs
        ? `<p>A partir de mañana: (1) Levántese 30 min antes, (2) Limite redes sociales, (3) Aprenda una habilidad nueva cada mes.</p>`
        : `<p>Mulai besok: (1) Bangun 30 menit lebih awal, (2) Batasi media sosial, (3) Belajar skill baru tiap bulan.</p>`,
    },
  ];

  // PEMOTONGAN TIER UNTUK FALLBACK
  const targetChapters = tier === "basic" ? allStaticChapters.slice(0, 2) : allStaticChapters;

  return targetChapters.map(ch => `<h3>${ch.title}</h3>${ch.content}`).join("");
}

export async function generatePremiumReport(
  userName: string,
  toolName: string,
  lang: string = "id",
  resultId: string = "Unknown",
  tier: string = "premium"
) {
  const fetchChapterWithRetry = async (
    chapterTitle: string,
    promptInstruction: string,
    startIndex: number
  ): Promise<string | null> => {
    if (API_KEYS.length === 0) return null;

    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
      const keyIndex = (startIndex + attempt) % API_KEYS.length;
      const apiKey = API_KEYS[keyIndex];

      // SUNTIKAN RESULT ID KE DALAM PROMPT AGAR AI MENJAWAB SESUAI HASIL TES
      const resultContextEn = resultId !== "Unknown" ? `The user's specific test result is: ${resultId}. You MUST heavily base your analysis on this result.` : "";
      const resultContextEs = resultId !== "Unknown" ? `El resultado específico de la prueba del usuario es: ${resultId}. DEBES basar fuertemente tu análisis en este resultado.` : "";
      const resultContextId = resultId !== "Unknown" ? `Hasil tes spesifik pengguna adalah: ${resultId}. Anda WAJIB mendasarkan analisis Anda secara kuat pada hasil ini.` : "";

      let prompt = "";
      if (lang === "en") {
        prompt = `Act as a Metaphysics Expert and Clinical Psychologist. Write a premium editorial report for ${userName} using ${toolName}. ${resultContextEn} Focus: ${chapterTitle}. Instructions: ${promptInstruction}. Output pure HTML (only <h3>, <p>, <ul>, <li>, <strong>). No markdown, no styles. Start with <h3>${chapterTitle}</h3>. Write 250-350 words.`;
      } else if (lang === "es") {
        prompt = `Actúa como Experto en Metafísica y Psicólogo Clínico. Escribe un informe editorial premium para ${userName} usando ${toolName}. ${resultContextEs} Enfoque: ${chapterTitle}. Instrucciones: ${promptInstruction}. Salida HTML puro (solo <h3>, <p>, <ul>, <li>, <strong>). Sin markdown, sin estilos. Comienza con <h3>${chapterTitle}</h3>. Escribe 250-350 palabras.`;
      } else {
        prompt = `Bertindak sebagai Pakar Metafisika dan Psikolog Klinis. Tulis laporan editorial premium untuk ${userName} menggunakan ${toolName}. ${resultContextId} Fokus: ${chapterTitle}. Instruksi: ${promptInstruction}. Keluaran HTML murni (hanya <h3>, <p>, <ul>, <li>, <strong>). Tanpa markdown, tanpa gaya. Mulai dengan <h3>${chapterTitle}</h3>. Tulis 250-350 kata.`;
      }

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );
        const data = await response.json();

        if (data.error) {
          if (
            data.error.message.includes("high demand") ||
            data.error.message.includes("quota") ||
            data.error.message.includes("rate")
          ) {
            attempt++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          }
          return null;
        }

        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        if (rawText) {
          rawText = rawText.replace(/```html/gi, "").replace(/```/gi, "").replace(/style="[^"]*"/gi, "").trim();
          return rawText;
        }
        return null;
      } catch {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    return null;
  };

  const allChapters = [
    {
      title: lang === "en" ? "Chapter 1: Authentic Character Blueprint" : lang === "es" ? "Capítulo 1: Plan de Carácter Auténtico" : "Bab 1: Blueprint Karakter Asli",
      desc: lang === "en" ? "Hidden character and mental analysis." : lang === "es" ? "Análisis de carácter y mental ocultos." : "Analisis karakter dan mental yang tersembunyi.",
    },
    {
      title: lang === "en" ? "Chapter 2: 5-Year Financial Map" : lang === "es" ? "Capítulo 2: Mapa Financiero a 5 Años" : "Bab 2: Peta Keuangan 5 Tahun",
      desc: lang === "en" ? "Wealth prediction, suitable career, rich momentum." : lang === "es" ? "Predicción de riqueza, carrera adecuada, momento de riqueza." : "Prediksi rejeki, karir yang cocok, dan momentum kaya.",
    },
    {
      title: lang === "en" ? "Chapter 3: Soulmate & Relationship Secrets" : lang === "es" ? "Capítulo 3: Secretos de Pareja y Relaciones" : "Bab 3: Rahasia Jodoh & Hubungan",
      desc: lang === "en" ? "Lucky and unlucky partner types." : lang === "es" ? "Tipos de pareja de buena y mala suerte." : "Tipe pasangan pembawa hoki dan pembawa sial.",
    },
    {
      title: lang === "en" ? "Chapter 4: Life Danger Warnings" : lang === "es" ? "Capítulo 4: Advertencias de Peligro Vital" : "Bab 4: Peringatan Bahaya Hidup",
      desc: lang === "en" ? "Fatal mistakes and taboos to avoid." : lang === "es" ? "Errores fatales y tabúes a evitar." : "Kesalahan fatal dan pantangan yang harus dijauhi.",
    },
    {
      title: lang === "en" ? "Chapter 5: Success Execution Strategy" : lang === "es" ? "Capítulo 5: Estrategia de Éxito" : "Bab 5: Strategi Sukses Eksekusi",
      desc: lang === "en" ? "Concrete steps starting tomorrow morning." : lang === "es" ? "Pasos concretos a partir de mañana." : "Langkah pasti mulai besok pagi.",
    },
  ];

  // LOGIKA TIERING: Potong proses API sebesar 60% jika paket Basic
  const targetChapters = tier === "basic" ? allChapters.slice(0, 2) : allChapters;

  const aiResults: (string | null)[] = [];

  for (let i = 0; i < targetChapters.length; i++) {
    const result = await fetchChapterWithRetry(targetChapters[i].title, targetChapters[i].desc, i);
    aiResults.push(result);
    // Beri jeda antar pemanggilan agar tidak terkena Rate Limit Gemini
    if (i < targetChapters.length - 1) await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const allFailed = aiResults.every((r) => r === null);
  if (allFailed) {
    console.warn("All AI calls failed, using static fallback.");
    return generateStaticReport(userName, toolName, lang, resultId, tier);
  }

  const staticFull = generateStaticReport(userName, toolName, lang, resultId, tier);
  const staticParts = staticFull.split("<h3>").slice(1).map((part) => "<h3>" + part);

  const finalChapters = targetChapters.map((ch, idx) => {
    if (aiResults[idx]) return aiResults[idx]!;
    return idx < staticParts.length ? staticParts[idx] : `<h3>${ch.title}</h3><p>${lang === "en" ? "Temporary report could not be generated. Use your intuition." : lang === "es" ? "No se pudo generar el informe temporal. Usa tu intuición." : "Laporan sementara tidak dapat dihasilkan. Gunakan intuisi Anda."}</p>`;
  });

  return finalChapters.join("");
}