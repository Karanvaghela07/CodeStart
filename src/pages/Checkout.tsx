import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Check, Lock, CreditCard, Smartphone, Building2, ChevronRight, ShieldCheck, Zap } from "lucide-react";
import { useAuth, PlanType } from "../context/AuthContext";

const planDetails = {
  pro: {
    name: "Pro Plan",
    price: 99,
    period: "per month",
    color: "bg-[#fde047]",
    badge: "Most Popular",
    badgeColor: "bg-[#e94560]",
    features: [
      "Full roadmap — all 6 stages",
      "All 3 games + future games",
      "Unlimited AI Explain",
      "City leaderboard filter",
      "Streak protection (1 per month)",
      "Priority support",
    ],
  },
  pack: {
    name: "Beginner Pack",
    price: 149,
    period: "one-time",
    color: "bg-[#34d399]",
    badge: "Best Value",
    badgeColor: "bg-[#1a1a2e]",
    features: [
      "Learn C from Zero — full course",
      "DSA for Beginners module",
      "All 6 roadmap stages",
      "All games unlocked",
      "Unlimited AI Explain",
      "Lifetime access — no subscription",
    ],
  },
};

type PayMethod = "upi" | "card" | "netbanking";

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, upgradePlan } = useAuth();

  const planKey = (params.get("plan") || "pro") as PlanType;
  const plan = planDetails[planKey as keyof typeof planDetails] ?? planDetails.pro;

  const [method, setMethod] = useState<PayMethod>("upi");
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("sbi");
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#fde047]">
        <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0_0_#000] text-center max-w-md w-full">
          <Lock className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase mb-2">Login Required</h2>
          <p className="font-bold text-black/60 text-sm mb-6">You need an account to purchase a plan.</p>
          <Link to="/register" className="block bg-black text-white font-black text-lg py-3 border-4 border-black shadow-[4px_4px_0_0_#34d399] hover:-translate-y-0.5 transition-all">
            Create Free Account →
          </Link>
          <Link to="/login" className="block mt-3 font-bold text-black/60 text-sm hover:underline">Already have an account? Log in</Link>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#34d399]">
        <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0_0_#000] text-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#34d399] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0_0_#000]">
            <Check className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-4xl font-black uppercase mb-2">Payment Successful!</h2>
          <p className="font-bold text-black/60 text-sm mb-2">
            Welcome to <span className="text-black font-black">{plan.name}</span>
          </p>
          <p className="font-bold text-black/50 text-xs mb-8">
            Your account has been upgraded. All content is now unlocked.
          </p>
          <div className="bg-[#fde047] border-4 border-black p-4 mb-6 shadow-[4px_4px_0_0_#000] text-left">
            <p className="font-black text-black text-sm mb-2">What you unlocked:</p>
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 font-bold text-sm text-black mt-1">
                <Check className="w-3 h-3 shrink-0" /> {f}
              </div>
            ))}
          </div>
          <Link
            to="/roadmap"
            className="block bg-black text-white font-black text-lg py-3 border-4 border-black shadow-[4px_4px_0_0_#34d399] hover:-translate-y-0.5 transition-all"
          >
            Start Learning Now →
          </Link>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#1a1a2e]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#34d399] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="font-black text-white text-2xl uppercase">Processing Payment...</p>
          <p className="font-bold text-white/50 text-sm mt-2">Please wait, do not close this page.</p>
        </div>
      </div>
    );
  }

  const handlePay = () => {
    setError("");
    if (method === "upi" && !upi.trim()) { setError("Please enter your UPI ID."); return; }
    if (method === "upi" && !upi.includes("@")) { setError("Enter a valid UPI ID (e.g. name@upi)."); return; }
    if (method === "card") {
      if (!card.number.trim() || !card.name.trim() || !card.expiry.trim() || !card.cvv.trim())
        { setError("Please fill all card details."); return; }
      if (card.number.replace(/\s/g, "").length < 16) { setError("Enter a valid 16-digit card number."); return; }
    }
    setStep("processing");
    setTimeout(() => {
      upgradePlan(planKey);
      setStep("success");
    }, 2200);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#1a1a2e] border-b-4 border-black px-6 py-10 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/40 mb-2">Secure Checkout</p>
        <h1 className="text-4xl font-black text-white uppercase">Complete Your Purchase</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left — Order summary */}
        <div className="flex flex-col gap-4">
          <div className={`${plan.color} border-4 border-black shadow-[6px_6px_0_0_#000]`}>
            <div className={`${plan.badgeColor} border-b-4 border-black px-4 py-2 font-black text-white text-xs uppercase tracking-widest`}>
              {plan.badge}
            </div>
            <div className="px-6 py-5">
              <h2 className="text-2xl font-black text-black uppercase mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-black text-black">₹{plan.price}</span>
                <span className="font-bold text-black/60 text-sm mb-1">/{plan.period}</span>
              </div>
              <div className="flex flex-col gap-2">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 font-bold text-sm text-black">
                    <Check className="w-4 h-4 shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0_0_#000] flex flex-col gap-3">
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-[#34d399]" />, text: "100% secure dummy payment — no real money charged" },
              { icon: <Zap className="w-4 h-4 text-[#fde047]" />, text: "Instant access after payment" },
              { icon: <Lock className="w-4 h-4 text-[#c084fc]" />, text: "Cancel anytime from your account" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 font-bold text-sm text-black/70">
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Payment form */}
        <div className="border-4 border-black shadow-[6px_6px_0_0_#000]">
          <div className="bg-black text-white px-5 py-4 font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Details
          </div>

          {/* Method tabs */}
          <div className="grid grid-cols-3 border-b-4 border-black">
            {([
              { key: "upi", label: "UPI", icon: <Smartphone className="w-4 h-4" /> },
              { key: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
              { key: "netbanking", label: "Net Banking", icon: <Building2 className="w-4 h-4" /> },
            ] as { key: PayMethod; label: string; icon: React.ReactNode }[]).map((m) => (
              <button
                key={m.key}
                onClick={() => { setMethod(m.key); setError(""); }}
                className={`flex flex-col items-center gap-1 py-3 font-black text-xs border-r-4 last:border-r-0 border-black transition-colors
                  ${method === m.key ? "bg-[#fde047]" : "bg-white hover:bg-black/5"}`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          <div className="p-6 flex flex-col gap-4">
            {/* UPI */}
            {method === "upi" && (
              <div className="flex flex-col gap-2">
                <label className="font-black text-xs uppercase tracking-widest text-black/60">UPI ID</label>
                <input
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="yourname@upi"
                  className="border-4 border-black p-3 font-bold text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                />
                <p className="font-bold text-black/40 text-xs">e.g. name@okaxis, name@paytm, name@ybl</p>
              </div>
            )}

            {/* Card */}
            {method === "card" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="font-black text-xs uppercase tracking-widest text-black/60">Card Number</label>
                  <input
                    value={card.number}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      const fmt = v.match(/.{1,4}/g)?.join(" ") || v;
                      setCard({ ...card, number: fmt });
                    }}
                    placeholder="1234 5678 9012 3456"
                    className="border-4 border-black p-3 font-bold font-mono text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-black text-xs uppercase tracking-widest text-black/60">Cardholder Name</label>
                  <input
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    placeholder="KARAN SHARMA"
                    className="border-4 border-black p-3 font-bold text-black outline-none focus:bg-[#fde047]/20 transition-colors uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="font-black text-xs uppercase tracking-widest text-black/60">Expiry</label>
                    <input
                      value={card.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setCard({ ...card, expiry: v });
                      }}
                      placeholder="MM/YY"
                      className="border-4 border-black p-3 font-bold font-mono text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-black text-xs uppercase tracking-widest text-black/60">CVV</label>
                    <input
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                      placeholder="•••"
                      type="password"
                      className="border-4 border-black p-3 font-bold font-mono text-black outline-none focus:bg-[#fde047]/20 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === "netbanking" && (
              <div className="flex flex-col gap-2">
                <label className="font-black text-xs uppercase tracking-widest text-black/60">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "sbi", label: "SBI" },
                    { key: "hdfc", label: "HDFC" },
                    { key: "icici", label: "ICICI" },
                    { key: "axis", label: "Axis" },
                    { key: "kotak", label: "Kotak" },
                    { key: "other", label: "Other" },
                  ].map((b) => (
                    <button
                      key={b.key}
                      onClick={() => setBank(b.key)}
                      className={`border-4 border-black py-3 font-black text-sm shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5
                        ${bank === b.key ? "bg-[#fde047]" : "bg-white"}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-[#f472b6] border-4 border-black px-4 py-3 font-bold text-sm text-black shadow-[3px_3px_0_0_#000]">
                {error}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              className="bg-[#34d399] border-4 border-black py-4 font-black text-xl text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center gap-3 mt-2"
            >
              <Lock className="w-5 h-5" /> Pay ₹{plan.price} <ChevronRight className="w-5 h-5" />
            </button>

            <p className="text-center font-bold text-black/40 text-xs">
              This is a demo checkout. No real payment is processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
