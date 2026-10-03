import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { couponCode, uid } = await req.json();

    if (!uid || !couponCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Securely verify coupon via Admin SDK
    const couponRef = await adminDb.collection("coupons").doc(couponCode.toUpperCase()).get();
    
    if (!couponRef.exists) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    const couponData = couponRef.data();
    
    if (!couponData?.active || couponData?.discountPercentage !== 100) {
      return NextResponse.json({ error: "Coupon is not a valid 100% discount" }, { status: 400 });
    }

    // Check if user has already used this coupon
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data();
    
    const normalizedCode = couponCode.trim().toUpperCase();
    const existingUsed: string[] = userData?.usedCoupons || [];
    if (existingUsed.includes(normalizedCode)) {
      return NextResponse.json({ error: "This coupon code has already been used by your account. Each coupon can only be used once." }, { status: 400 });
    }

    // Securely update the user's profile to bypass database security rules using atomic arrayUnion
    const { FieldValue } = await import("firebase-admin/firestore");

    await userRef.set({
      hasPaid: true,
      paidAt: new Date().toISOString(),
      orderId: `free_${normalizedCode}_${Date.now()}`,
      usedCoupons: FieldValue.arrayUnion(normalizedCode)
    }, { merge: true });

    const updatedUsedCoupons = Array.from(new Set([...existingUsed, normalizedCode]));

    return NextResponse.json({ 
      success: true, 
      message: "Assessment unlocked successfully",
      usedCoupons: updatedUsedCoupons
    });

  } catch (error) {
    console.error("Error processing free unlock:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
