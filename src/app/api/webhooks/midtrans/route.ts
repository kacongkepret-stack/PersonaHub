import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Verifikasi Keamanan (Signature Key)
    // Ini wajib agar orang lain tidak bisa pura-pura mengirim status "LUNAS" ke web Anda
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (hash !== signature_key) {
      return NextResponse.json({ message: 'Invalid Signature' }, { status: 403 });
    }

    // 2. Logika Eksekusi Berdasarkan Status
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      // AKTIVASI MESIN PDF
      console.log(`[PEMBAYARAN LUNAS] Order ID: ${order_id}. Memulai penulisan laporan...`);
      
      // DI SINI: Panggil fungsi AI Rotator (10 API Keys) 
      // dan kirimkan hasilnya ke PDF Generator.
      
      // Contoh: await triggerPdfGeneration(order_id);
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}