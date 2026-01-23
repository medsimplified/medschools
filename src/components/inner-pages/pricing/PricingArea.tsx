"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaCheckCircle } from "@/lib/fontAwesomeIconsComplete";
import { loadRazorpayCheckout, getRazorpay } from "@/lib/razorpayClient";
import { useSubscriptionPlans, type SubscriptionPlan } from "@/hooks/useSubscriptionPlans";

const PricingArea = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const { plans, loading: plansLoading, error: plansError } = useSubscriptionPlans();

  const formatter = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, []);

  const formatPrice = (plan: SubscriptionPlan) => {
    const symbol = plan.currency === "INR" ? "₹" : plan.currency;
    return `${symbol}${formatter.format(plan.price)}`;
  };

  const handleBuyNow = async (plan: SubscriptionPlan) => {
    // Check if user is logged in
    if (!session) {
      localStorage.setItem("selectedPlan", plan.slug);
      router.push("/login?redirect=/pricing");
      return;
    }

    setProcessingPlan(plan.slug);

    try {
      const scriptReady = await loadRazorpayCheckout();
      if (!scriptReady || !getRazorpay()) {
        alert("Unable to load Razorpay checkout. Please refresh and try again.");
        setProcessingPlan(null);
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.slug,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setProcessingPlan(null);
        return;
      }

      const Razorpay = getRazorpay();
      if (!Razorpay) {
        alert("Razorpay is not available in this browser.");
        setProcessingPlan(null);
        return;
      }

      const checkout = new Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Dr. Bhanu Prakash",
        description: `${plan.title} subscription`,
        order_id: data.orderId,
        prefill: {
          email: session.user?.email || "",
          name: session.user?.name || "",
        },
        notes: {
          planId: plan.slug,
        },
        theme: { color: "#0d447a" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || verifyData.error) {
              alert(verifyData.error || "Payment verification failed. Please contact support.");
              setProcessingPlan(null);
              return;
            }

            router.push("/student-dashboard?payment=success");
          } catch (error) {
            console.error("Verification error:", error);
            alert("Unable to confirm payment. Please reach out to support with your payment ID.");
            setProcessingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingPlan(null);
          },
        },
      });

      checkout.on("payment.failed", (failure: any) => {
        console.error("Razorpay payment failed:", failure?.error);
        alert(failure?.error?.description || "Payment was not completed.");
        setProcessingPlan(null);
      });

      checkout.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to initiate payment. Please try again.");
      setProcessingPlan(null);
    }
  };

  return (
    <section className="pricing-area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section__title text-center mb-50">
              <span className="sub-title">Choose Your Plan</span>
              <h2 className="title bold">Select the Perfect Plan for Your Medical Journey</h2>
              <p className="mt-3">
                Get access to comprehensive MBBS study materials, video lectures, and practice tests. 
                Choose a plan that fits your needs.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {plansLoading && (
            <div className="col-12 text-center py-5">
              <p className="text-muted mb-0">Loading subscription plans...</p>
            </div>
          )}

          {plansError && !plansLoading && (
            <div className="col-12 text-center py-5">
              <p className="text-danger mb-0">{plansError}</p>
            </div>
          )}

          {!plansLoading && !plansError && plans.length === 0 && (
            <div className="col-12 text-center py-5">
              <p className="text-muted mb-0">No subscription plans are currently available. Please check back soon.</p>
            </div>
          )}

          {plans.map((plan) => (
            <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
              <div 
                className={`pricing-card ${plan.isPopular ? 'popular-plan' : ''}`}
                style={{
                  border: plan.isPopular ? '2px solid #0d447a' : '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '30px',
                  background: '#fff',
                  boxShadow: plan.isPopular ? '0 10px 40px rgba(13,68,122,0.15)' : '0 4px 20px rgba(0,0,0,0.08)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}
              >
                {plan.isPopular && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #5dba47 0%, #4a9c38 100%)',
                      color: '#fff',
                      padding: '5px 20px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {plan.highlight || 'MOST POPULAR'}
                  </div>
                )}

                <h3 className="text-center mb-3" style={{ color: '#0d447a', fontSize: '24px', fontWeight: '700' }}>
                  {plan.title}
                </h3>

                <div className="text-center mb-4">
                  <span style={{ fontSize: '42px', fontWeight: '800', color: '#0d447a' }}>
                    {formatPrice(plan)}
                  </span>
                  <span style={{ fontSize: '16px', color: '#666' }}>
                    {plan.durationLabel}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', padding: '0', marginBottom: '30px' }}>
                  {plan.features.map((feature, index) => (
                    <li 
                      key={index} 
                      style={{ 
                        padding: '10px 0',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <FaCheckCircle
                        aria-hidden
                        style={{
                          color: '#5dba47',
                          marginRight: '10px',
                          fontSize: '16px'
                        }}
                      />
                      <span style={{ color: '#555', fontSize: '14px' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuyNow(plan)}
                  disabled={processingPlan === plan.slug || plansLoading}
                  className="btn w-100"
                  style={{
                    background: plan.isPopular 
                      ? 'linear-gradient(135deg, #0d447a 0%, #094a8f 100%)'
                      : '#f8f9fa',
                    color: plan.isPopular ? '#fff' : '#0d447a',
                    border: plan.isPopular ? 'none' : '1px solid #0d447a',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    cursor: processingPlan === plan.slug ? 'wait' : 'pointer',
                    opacity: processingPlan === plan.slug ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (processingPlan !== plan.slug) {
                      if (plan.isPopular) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #5dba47 0%, #4a9c38 100%)';
                      } else {
                        e.currentTarget.style.background = '#0d447a';
                        e.currentTarget.style.color = '#fff';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (processingPlan !== plan.slug) {
                      if (plan.isPopular) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #0d447a 0%, #094a8f 100%)';
                      } else {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.color = '#0d447a';
                      }
                    }
                  }}
                >
                  {processingPlan === plan.slug ? 'Processing...' : session ? 'Subscribe Now' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <p className="text-muted">
            Already have an account? <Link href="/login" style={{ color: '#0d447a', fontWeight: '600' }}>Login here</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingArea;
