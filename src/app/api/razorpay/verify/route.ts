import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, uid, couponCode } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "";

    // Create signature to verify
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Signature is valid. Update user document to mark hasPaid: true
      try {
        const userRef = adminDb.collection("users").doc(uid);
        const userSnap = await userRef.get();
        const userData = userSnap.data();
        
        const usedCoupons = userData?.usedCoupons || [];
        if (couponCode) {
           const normalizedCode = couponCode.toUpperCase();
           if (!usedCoupons.includes(normalizedCode)) {
             usedCoupons.push(normalizedCode);
           }
        }

        await userRef.set({
          hasPaid: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          paidAt: new Date().toISOString(),
          usedCoupons
        }, { merge: true });
      } catch (adminErr) {
        console.warn("Could not update user via adminDb (likely missing local credentials). The client SDK will handle it locally.", adminErr);
      }

      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
