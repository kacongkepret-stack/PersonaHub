"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// =====================================================================
// ⚠️ SAKLAR DEV BYPASS (Ubah ke FALSE sebelum deploy ke Production!) ⚠️
// =====================================================================
const ENABLE_DEV_BYPASS = false; 
// =====================================================================

// ========== MULTI-LANGUAGE DICTIONARY DENGAN SISTEM TIER ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Pilih Kedalaman Analisis Anda",
    subtitle: "Buka rahasia takdir Anda sesuai dengan kebutuhan.",
    packages: {
      basic: {
        id: "basic",
        name: "Laporan Esensial",
        price: 5000,
        priceLabel: "Rp 5.000",
        benefits: [
          { text: "Bab 1: Blueprint Karakter", inc: true },
          { text: "Bab 2: Peta Keuangan Dasar", inc: true },
          { text: "Bab 3: Rahasia Jodoh", inc: false },
          { text: "Bab 4: Peringatan Bahaya", inc: false },
          { text: "Bab 5: Strategi Sukses", inc: false }
        ]
      },
      premium: {
        id: "premium",
        name: "Blueprint VVIP (Full)",
        price: 10000,
        priceLabel: "Rp 10.000",
        benefits: [
          { text: "Bab 1: Blueprint Karakter", inc: true },
          { text: "Bab 2: Peta Keuangan 5 Tahun", inc: true },
          { text: "Bab 3: Rahasia Jodoh & Hubungan", inc: true },
          { text: "Bab 4: Peringatan Bahaya Hidup", inc: true },
          { text: "Bab 5: Strategi Sukses Eksekusi", inc: true }
        ]
      }
    },
    cta: "🔓 Buka Laporan Sekarang",
    processing: "Memproses...",
    modalTitle: "Konfirmasi Pembayaran",
    modalDesc: "Anda memilih paket",
    payButton: "Bayar",
    closeButton: "Tutup",
    footer: "Transaksi aman • Akses instan setelah bayar",
    toastSuccess: "Akses berhasil dibuka! Laporan Anda siap.",
    loadingText: "Menyusun analisis AI tingkat lanjut...",
    errorText: "Gagal memuat laporan. Silakan coba lagi.",
    cover: {
      blueprint: "AI Blueprint Report",
      print: "CETAK DOKUMEN",
      service: "PersonaHub Intelligence",
      logo: "P",
      title: "Dokumen Analisis Pribadi",
      subtitle: "Berdasarkan Metrik Psikologi Terapan",
      analyzedFor: "Dianalisis Khusus Untuk",
      quote: "Mengenal diri sendiri adalah awal dari semua kebijaksanaan.",
      footer: "PersonaHub AI Architecture • {year}",
      confidentiality: "Strictly Confidential • Authorized Personnel Only"
    },
  },
  en: {
    title: "Choose Your Analysis Depth",
    subtitle: "Unlock your destiny secrets according to your needs.",
    packages: {
      basic: {
        id: "basic",
        name: "Essential Report",
        price: 5000,
        priceLabel: "Rp 5.000",
        benefits: [
          { text: "Ch 1: Character Blueprint", inc: true },
          { text: "Ch 2: Basic Financial Map", inc: true },
          { text: "Ch 3: Soulmate Secrets", inc: false },
          { text: "Ch 4: Danger Warnings", inc: false },
          { text: "Ch 5: Success Strategy", inc: false }
        ]
      },
      premium: {
        id: "premium",
        name: "VVIP Blueprint (Full)",
        price: 10000,
        priceLabel: "Rp 10.000",
        benefits: [
          { text: "Ch 1: Character Blueprint", inc: true },
          { text: "Ch 2: 5-Year Financial Map", inc: true },
          { text: "Ch 3: Soulmate & Relationship", inc: true },
          { text: "Ch 4: Life Danger Warnings", inc: true },
          { text: "Ch 5: Success Execution Strategy", inc: true }
        ]
      }
    },
    cta: "🔓 Unlock Report Now",
    processing: "Processing...",
    modalTitle: "Payment Confirmation",
    modalDesc: "You selected the",
    payButton: "Pay",
    closeButton: "Close",
    footer: "Secure transaction • Instant access",
    toastSuccess: "Access granted! Your report is ready.",
    loadingText: "Compiling advanced AI analysis...",
    errorText: "Failed to load report. Please try again.",
    cover: {
      blueprint: "AI Blueprint Report",
      print: "PRINT DOCUMENT",
      service: "PersonaHub Intelligence",
      logo: "P",
      title: "Personal Analysis Document",
      subtitle: "Based on Applied Psychology Metrics",
      analyzedFor: "Specifically Analyzed For",
      quote: "Knowing yourself is the beginning of all wisdom.",
      footer: "PersonaHub AI Architecture • {year}",
      confidentiality: "Strictly Confidential • Authorized Personnel Only"
    },
  },
  es: {
    title: "Elige la Profundidad de tu Análisis",
    subtitle: "Desbloquea los secretos de tu destino según tus necesidades.",
    packages: {
      basic: {
        id: "basic",
        name: "Informe Esencial",
        price: 5000,
        priceLabel: "Rp 5.000",
        benefits: [
          { text: "Cap 1: Plano de Carácter", inc: true },
          { text: "Cap 2: Mapa Financiero Básico", inc: true },
          { text: "Cap 3: Secretos de Amor", inc: false },
          { text: "Cap 4: Advertencias de Peligro", inc: false },
          { text: "Cap 5: Estrategia de Éxito", inc: false }
        ]
      },
      premium: {
        id: "premium",
        name: "Blueprint VVIP (Completo)",
        price: 10000,
        priceLabel: "Rp 10.000",
        benefits: [
          { text: "Cap 1: Plano de Carácter", inc: true },
          { text: "Cap 2: Mapa Financiero 5 Años", inc: true },
          { text: "Cap 3: Amor y Relaciones", inc: true },
          { text: "Cap 4: Advertencias de Peligro Vital", inc: true },
          { text: "Cap 5: Estrategia de Ejecución", inc: true }
        ]
      }
    },
    cta: "🔓 Desbloquear Informe Ahora",
    processing: "Procesando...",
    modalTitle: "Confirmación de Pago",
    modalDesc: "Has seleccionado el paquete",
    payButton: "Pagar",
    closeButton: "Cerrar",
    footer: "Transacción segura • Acceso instantáneo",
    toastSuccess: "¡Acceso concedido! Tu informe está listo.",
    loadingText: "Compilando análisis de IA avanzado...",
    errorText: "Error al cargar el informe. Inténtalo de nuevo.",
    cover: {
      blueprint: "AI Blueprint Report",
      print: "IMPRIMIR DOCUMENTO",
      service: "PersonaHub Intelligence",
      logo: "P",
      title: "Documento de Análisis Personal",
      subtitle: "Basado en Métricas de Psicología Aplicada",
      analyzedFor: "Analizado Específicamente Para",
      quote: "Conocerte a ti mismo es el comienzo de toda sabiduría.",
      footer: "PersonaHub AI Architecture • {year}",
      confidentiality: "Strictly Confidential • Authorized Personnel Only"
    },
  },
};

export default function PremiumPaywall({ userName = "Klien VVIP", toolName = "Kartu Takdir Semesta", resultId = "premium" }) {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [selectedTier, setSelectedTier] = useState<"basic" | "premium">("premium");
  const [isPaid, setIsPaid] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (isPaid && !reportContent && !isLoadingReport) {
      setIsLoadingReport(true);
      setFetchError(false);
      // PENTING: MENGIRIM TIER KE BACKEND UNTUK AI PROMPT
      fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, toolName, lang, resultId, tier: selectedTier })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.report) {
            setReportContent(data.report);
          } else {
            throw new Error("Invalid response");
          }
        })
        .catch(err => {
          console.error(err);
          setFetchError(true);
          alert(dict.errorText);
        })
        .finally(() => setIsLoadingReport(false));
    }
  }, [isPaid, reportContent, isLoadingReport, userName, toolName, lang, resultId, selectedTier]);

  const handlePayment = async () => {
    const selectedPkg = dict.packages[selectedTier];

    // ========== LOGIKA BYPASS ==========
    if (ENABLE_DEV_BYPASS) {
      setIsProcessing(true);
      setTimeout(() => {
        console.log(`BYPASS MODE: Active. Membuka laporan tier: ${selectedTier}`);
        setShowModal(false);
        setIsProcessing(false);
        setIsPaid(true);
      }, 800);
      return; 
    }
    // ===================================

    if (!(window as any).snap) {
      alert("Sistem pembayaran sedang dimuat. Silakan tunggu sebentar atau refresh halaman.");
      return;
    }

    setIsProcessing(true);
    try {
      // PENTING: MENGIRIM AMOUNT DINAMIS KE MIDTRANS API
      const response = await fetch("/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          toolName,
          amount: selectedPkg.price,
          orderId: `PRM-${selectedTier.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        }),
      });
      const data = await response.json();
      if (!data.token) throw new Error("Token tidak tersedia");

      (window as any).snap.pay(data.token, {
        onSuccess: (result: any) => {
          setTimeout(() => {
            setShowModal(false);
            setIsProcessing(false);
            setIsPaid(true);
            alert(dict.toastSuccess);
          }, 700);
        },
        onPending: (result: any) => {
          setTimeout(() => {
            alert("Pembayaran pending, silakan selesaikan.");
            setIsProcessing(false);
          }, 500);
        },
        onError: (result: any) => {
          setTimeout(() => {
            alert("Pembayaran gagal.");
            setIsProcessing(false);
          }, 500);
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
      setIsProcessing(false);
    }
  };

  const styleInjected = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;700;900&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-mystic { font-family: 'Cinzel Decorative', serif; }
    .font-lora { font-family: 'Lora', serif; }
    @media print {
      .page-break { page-break-before: always; }
      body { background: white !important; }
    }
  `;

  // Helper var
  const pkgBasic = dict.packages.basic;
  const pkgPremium = dict.packages.premium;
  const activePkg = dict.packages[selectedTier];

  // ========== ZERO-UNMOUNT ARCHITECTURE ==========
  return (
    <div suppressHydrationWarning className="w-full relative">
      <style dangerouslySetInnerHTML={{ __html: styleInjected }} suppressHydrationWarning />

      {/* MODAL PEMBAYARAN */}
      <div 
        className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm print:hidden transition-all duration-300 ${
          showModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="bg-stone-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-amber-500/30 overflow-hidden transform transition-all duration-300">
          <div className="p-5 border-b border-stone-700 flex justify-between items-center">
            <h3 className="font-bold text-white">{dict.modalTitle}</h3>
            <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-white">✕</button>
          </div>
          <div className="p-5">
            <p className="text-sm text-stone-300 mb-4">{dict.modalDesc} <span className="font-bold text-amber-400">{activePkg.name}</span>.</p>
            <div className="bg-stone-700/50 p-3 rounded-lg mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-300">Total Pembayaran</span>
                <span className="font-bold text-amber-400">Rp {activePkg.price.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-lg transition disabled:opacity-50"
            >
              {isProcessing ? dict.processing : `${dict.payButton} ${activePkg.priceLabel}`}
            </button>
            <p className="text-[10px] text-stone-500 text-center mt-3">{dict.footer}</p>
          </div>
        </div>
      </div>

      {/* KONDISI 1: TAMPILAN LAPORAN (Rendered by AI) */}
      <div className={isPaid && reportContent ? "block" : "hidden"}>
        <div className="min-h-screen bg-[#0a0a0a] py-10 print:py-0 print:bg-white flex flex-col items-center selection:bg-amber-100">
          <div className="w-full max-w-[21cm] bg-[#f5eee6] shadow-[0_0_60px_rgba(0,0,0,0.7)] print:shadow-none relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            <div className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur text-white p-3 flex justify-between items-center print:hidden border-b border-stone-800">
              <div className="text-[9px] tracking-[0.4em] text-amber-500 uppercase font-cinzel pl-4">{dict.cover.blueprint} - {selectedTier.toUpperCase()}</div>
              <button onClick={() => window.print()} className="bg-amber-800 text-white px-6 py-1.5 rounded-sm font-cinzel text-[10px] font-bold hover:bg-amber-700 transition-all tracking-widest">
                {dict.cover.print}
              </button>
            </div>

            {/* Cover Page */}
            <div className="min-h-[29.7cm] flex flex-col items-center justify-between p-20 text-center relative break-after-page print:p-16 border-b border-stone-200/50">
              <div className="absolute inset-8 border border-amber-900/10 pointer-events-none"></div>
              <div className="space-y-4 z-10">
                <h4 className="text-stone-500 font-cinzel tracking-[0.5em] text-[9px] uppercase">{dict.cover.service}</h4>
                <div className="w-12 h-[1px] bg-amber-700/50 mx-auto"></div>
              </div>
              <div className="relative w-44 h-44 flex items-center justify-center z-10">
                <div className="absolute inset-0 border border-amber-800/20 rotate-45"></div>
                <div className="absolute inset-4 border border-stone-900/10 -rotate-12"></div>
                <div className="w-12 h-12 bg-stone-900 flex items-center justify-center rotate-45 shadow-2xl">
                  <span className="text-amber-500 font-mystic font-bold text-xl -rotate-45">{dict.cover.logo}</span>
                </div>
              </div>
              <div className="space-y-6 z-10">
                <h1 className="text-5xl font-mystic font-black text-stone-900 leading-[1.2] uppercase tracking-tighter">{dict.cover.title}</h1>
                <p className="font-lora italic text-amber-900/60 text-lg">{dict.cover.subtitle}</p>
                <p className="font-cinzel text-amber-700 text-sm font-bold tracking-widest uppercase">[{activePkg.name}]</p>
              </div>
              <div className="w-full space-y-8 z-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-cinzel tracking-widest text-stone-500 uppercase">{dict.cover.analyzedFor}</p>
                  <h2 className="text-3xl font-cinzel font-bold text-stone-900 uppercase tracking-widest border-b-2 border-amber-900/10 pb-4 inline-block px-14">{userName}</h2>
                </div>
                <div className="max-w-xs mx-auto">
                  <p className="text-[11px] font-lora italic text-stone-500 leading-relaxed">"{dict.cover.quote}"</p>
                </div>
              </div>
              <div className="text-[8px] font-cinzel tracking-[0.4em] text-stone-400 uppercase pt-8 z-10">
                {dict.cover.footer.replace("{year}", new Date().getFullYear().toString())}
              </div>
            </div>

            {/* Injected Content from AI */}
            <div className="p-16 print:p-12 relative">
              <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-stone-900/5 print:hidden"></div>
              <div 
                className="
                  max-w-none text-stone-800 relative z-10
                  [&>h3]:font-mystic [&>h3]:text-2xl [&>h3]:font-black [&>h3]:text-stone-900 [&>h3]:uppercase [&>h3]:tracking-[0.2em]
                  [&>h3]:mt-20 [&>h3]:mb-12 [&>h3]:border-l-4 [&>h3]:border-amber-800 [&>h3]:pl-6
                  [&>h3]:print:break-before-page
                  [&>p]:font-lora [&>p]:text-[16px] [&>p]:leading-[2.1] [&>p]:mb-10 [&>p]:text-justify [&>p]:text-stone-800/90
                  [&>h3+p]:first-letter:float-left [&>h3+p]:first-letter:text-7xl [&>h3+p]:first-letter:font-black [&>h3+p]:first-letter:font-mystic [&>h3+p]:first-letter:text-amber-900 [&>h3+p]:first-letter:pr-5 [&>h3+p]:first-letter:leading-[0.8] [&>h3+p]:first-letter:mt-2
                  [&>ul]:my-14 [&>ul]:space-y-12 [&>ul]:border-t [&>ul]:border-stone-900/10 [&>ul]:pt-12
                  [&>ul>li]:font-lora [&>ul>li]:text-[16px] [&>ul>li]:leading-[2.1] [&>ul>li]:text-stone-700
                  [&>ul>li>strong]:block [&>ul>li>strong]:font-cinzel [&>ul>li>strong]:text-amber-900 [&>ul>li>strong]:text-xs [&>ul>li>strong]:tracking-[0.2em] [&>ul>li>strong]:mb-2 [&>ul>li>strong]:uppercase
                  [&>p>strong]:text-stone-900 [&>p>strong]:font-bold [&>p>strong]:bg-amber-900/5 [&>p>strong]:px-1
                "
                dangerouslySetInnerHTML={{ __html: reportContent || "" }} 
              />
            </div>
            <div className="text-center py-12 text-stone-400 text-[9px] font-cinzel uppercase tracking-[0.5em] opacity-50">
              {dict.cover.confidentiality}
            </div>
          </div>
        </div>
      </div>

      {/* KONDISI 2: LOADING LAPORAN */}
      <div className={isPaid && isLoadingReport ? "flex justify-center items-center min-h-[300px]" : "hidden"}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-amber-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="ml-4 text-stone-300">{dict.loadingText}</p>
      </div>

      {/* KONDISI 3: ERROR FETCH LAPORAN */}
      <div className={isPaid && fetchError ? "flex justify-center items-center min-h-[300px]" : "hidden"}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{dict.errorText}</p>
          <button
            onClick={() => {
              setFetchError(false);
              setIsLoadingReport(false);
              setReportContent(null);
              setIsPaid(false);
              setTimeout(() => setIsPaid(true), 100);
            }}
            className="px-4 py-2 bg-amber-500 text-stone-900 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>

      {/* KONDISI 4: TAMPILAN PAYWALL UTAMA (UI TIERING) */}
      <div className={!isPaid ? "w-full max-w-4xl mx-auto flex flex-col items-center pt-4 pb-24 px-4 transition-all duration-1000" : "hidden"}>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-amber-400 mb-2">{dict.title}</h2>
          <p className="text-stone-400">{dict.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* KARTU BASIC */}
          <div 
            onClick={() => setSelectedTier("basic")}
            className={`cursor-pointer rounded-3xl p-1 transition-all duration-300 ${
              selectedTier === "basic" ? "bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.3)] scale-[1.02] transform" : "bg-stone-800 hover:bg-stone-700"
            }`}
          >
            <div className="bg-stone-900 rounded-[22px] h-full p-6 flex flex-col relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-stone-200">{pkgBasic.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{pkgBasic.priceLabel}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {pkgBasic.benefits.map((b: any, i: number) => (
                  <li key={i} className={`text-sm flex gap-2 ${b.inc ? 'text-stone-300' : 'text-stone-600 line-through'}`}>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedTier("basic"); setShowModal(true); }}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  selectedTier === "basic" ? "bg-amber-500 text-stone-900 hover:bg-amber-400" : "bg-stone-800 text-stone-300 border border-stone-600 hover:bg-stone-700"
                }`}
              >
                Pilih Basic
              </button>
            </div>
          </div>

          {/* KARTU PREMIUM */}
          <div 
            onClick={() => setSelectedTier("premium")}
            className={`cursor-pointer rounded-3xl p-1 transition-all duration-300 ${
              selectedTier === "premium" ? "bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.3)] scale-[1.02] transform" : "bg-stone-800 hover:bg-stone-700"
            }`}
          >
            <div className="bg-stone-900 rounded-[22px] h-full p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-stone-900 text-[10px] font-black py-1 px-4 rounded-bl-xl uppercase tracking-widest">Recommended</div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-amber-400">{pkgPremium.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{pkgPremium.priceLabel}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {pkgPremium.benefits.map((b: any, i: number) => (
                  <li key={i} className={`text-sm flex gap-2 ${b.inc ? 'text-stone-300' : 'text-stone-600 line-through'}`}>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedTier("premium"); setShowModal(true); }}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  selectedTier === "premium" ? "bg-amber-500 text-stone-900 hover:bg-amber-400" : "bg-stone-800 text-stone-300 border border-stone-600 hover:bg-stone-700"
                }`}
              >
                Pilih Premium
              </button>
            </div>
          </div>

        </div>
        
        <div className="mt-10 bg-stone-800/30 px-6 py-3 rounded-full text-center text-xs text-stone-400 border border-stone-700">
          ⭐ 4.9/5 Rating rata-rata dari pengguna
        </div>

      </div>

    </div>
  );
}