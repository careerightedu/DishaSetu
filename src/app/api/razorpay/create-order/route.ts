import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { amount, couponCode, uid } = await req.json();

    // Default base price is 99900 paise (₹999).
    let finalAmount = amount || 99900; 

    // Handle Coupons
    if (couponCode && uid) {
      try {
        const normalizedCode = couponCode.toUpperCase();
        
        // Check if user already used this coupon
        const userSnap = await adminDb.collection("users").doc(uid).get();
        if (userSnap.exists && userSnap.data()?.usedCoupons?.includes(normalizedCode)) {
           return NextResponse.json({ error: "Coupon already used" }, { status: 400 });
        }

        const couponRef = await adminDb.collection("coupons").doc(normalizedCode).get();
        if (couponRef.exists) {
          const couponData = couponRef.data();
          if (couponData?.active) {
            const discountPercentage = couponData.discountPercentage || 0;
            const discountAmount = (finalAmount * discountPercentage) / 100;
            finalAmount = Math.max(0, finalAmount - discountAmount);
          }
        }
      } catch (err) {
        console.error("Error validating coupon:", err);
      }
    }

    // If it's a 100% discount, return immediately
    if (finalAmount <= 0) {
      return NextResponse.json({ 
        orderId: null, 
        amount: 0, 
        message: "Free via coupon" 
      });
    }

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const options = {
      amount: Math.round(finalAmount), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rcptid_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
