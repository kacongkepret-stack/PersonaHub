import { NextResponse } from 'next/server';
import crypto from 'crypto';
// Asumsi Anda menggunakan Prisma di PersonaHub. Sesuaikan path import-nya jika berbeda.
import { prisma } from '@/lib/prisma'; 

export async function POST(req: Request) {
  let payload: any;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ message: 'Format JSON tidak valid' }, { status: 400 });
  }

  try {
    const { 
      order_id, 
      gross_amount, 
      transaction_status, 
      status_code, 
      signature_key,
      transaction_time
    } = payload;

    console.log(`📥 PERSONAHUB WEBHOOK: Menerima data transaksi ${order_id}`);

    // ====================================================================
    // 🔒 LAYER KEAMANAN GANDA (DOUBLE VERIFICATION)
    // Pastikan env Midtrans Server Key sama persis dengan LatihanOnline
    // ====================================================================
    const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
    
    if (!SERVER_KEY) {
      console.error("❌ PERSONAHUB: MIDTRANS_SERVER_KEY tidak ditemukan di .env!");
      return NextResponse.json({ message: 'Server Configuration Error' }, { status: 500 });
    }

    const signatureString = order_id + status_code + gross_amount + SERVER_KEY;
    const hashedSignature = crypto.createHash('sha512').update(signatureString).digest('hex');

    if (hashedSignature !== signature_key) {
      console.error(`❌ PERSONAHUB: SIGNATURE TIDAK COCOK UNTUK ORDER ${order_id}! Potensi serangan manipulasi.`);
      return NextResponse.json({ message: 'Akses Ditolak: Signature Invalid' }, { status: 403 });
    }

    console.log("✅ PERSONAHUB: Signature valid. Memproses status pembayaran...");

    // ====================================================================
    // ⚙️ LOGIKA UPDATE STATUS DATABASE PERSONAHUB
    // ====================================================================
    let paymentStatus = 'PENDING';

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
        paymentStatus = 'SUCCESS';
    } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
        paymentStatus = 'FAILED';
    } else if (transaction_status === 'pending') {
        paymentStatus = 'PENDING';
    }

    // Eksekusi ke Database PersonaHub (Contoh jika Anda punya tabel Transaction/Order)
    /* CATATAN ENGINEER: Buka komentar di bawah ini dan sesuaikan dengan nama 
    tabel Prisma Anda (misal: prisma.transaction atau prisma.payment).
    */
    
    /*
    const existingTransaction = await prisma.transaction.findUnique({
      where: { orderId: order_id }
    });

    if (existingTransaction) {
      await prisma.transaction.update({
        where: { orderId: order_id },
        data: {
          status: paymentStatus,
          paidAt: paymentStatus === 'SUCCESS' ? new Date(transaction_time) : null
        }
      });
      
      console.log(`✅ PERSONAHUB: Database berhasil diupdate. Status ${order_id} -> ${paymentStatus}`);
    } else {
      console.warn(`⚠️ PERSONAHUB: Transaksi ${order_id} tidak ditemukan di database.`);
    }
    */

    // Memberikan respons 200 OK agar server pemanggil (LatihanOnline/Midtrans) tahu data sukses diterima
    return NextResponse.json({ message: `PersonaHub sukses memproses: ${paymentStatus}` }, { status: 200 });

  } catch (error: any) {
    console.error('❌ PERSONAHUB: Fatal Webhook Error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}