import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware';

// Constants
const salt_key = process.env.MERCHANT_KEY;
const merchant_id = process.env.MERCHANT_ID;

export const POST = withAuth(async (request: NextRequest, user: { userId: string }) => {
  try {
    const userId = user.userId;
    const userRecord = await db.user.findUnique({
      where: { id: userId }
    });

    // ✅ Null check added here
    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reqData = await request.json();
    const merchantTransactionId = reqData.transactionId;

    const data = {
      merchantId: merchant_id,
      merchantTransactionId,
      amount: userRecord.fine * 100,
      redirectUrl: `http://localhost:3000/api/payment/status?id=${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/payment/status?id=${merchantTransactionId}`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    const prod_URL = process.env.MERCHANT_BASE_URL;

    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    await db.payment.create({
      data: {
        id: merchantTransactionId,
        userId: userRecord.id,
        amount: userRecord.fine,
        status: 'PENDING',
      },
    });

    const response = await axios(options);
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
});
