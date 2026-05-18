import { NextResponse } from 'next/server';
// @ts-ignore
const midtransClient = require('midtrans-client');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TANGKAP amount DINAMIS DARI FRONTEND (Kita tidak butuh orderId dari frontend)
    const { toolName, resultId, amount } = body;

    // Proteksi Keamanan Dasar
    if (!amount || amount < 5000) {
       return NextResponse.json({ error: 'Harga tidak valid' }, { status: 400 });
    }

    // Inisialisasi Snap Midtrans (Gunakan Key dari .env yang SAMA dengan LatihanOnline)
    let snap = new midtransClient.Snap({
      isProduction: false, // Ubah ke true jika sudah siap di production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    // 🔒 CETAK ORDER ID MUTLAK DI BACKEND
    const secureOrderId = `PHUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let parameter = {
      "transaction_details": {
        "order_id": secureOrderId, // Gunakan variabel yang dicetak paksa di atas
        "gross_amount": amount 
      },
      "item_details": [{
        "id": resultId || "premium-report",
        "price": amount,
        "quantity": 1,
        "name": `Paket Analisis: ${toolName}`
      }],
      // Membatasi hanya QRIS dan E-Wallet untuk kemudahan user
      "enabled_payments": ["gopay", "shopeepay", "other_qris"]
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ token: transaction.token });

  } catch (error: any) {
    console.error("Midtrans Error:", error.message);
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 });
  }
}