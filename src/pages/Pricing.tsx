import { Check, Zap, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    color: "bg-white",
    tag: null,
    tagColor: "",
    features: [
      "Roadmap Stages 1–3 unlocked",
      "2 games (Guess the Output + Fix the Bug)",
      "5 AI Explain uses per day",
      "Public leaderboard access",
    ],
    locked: [
      "Roadmap Stages 4–6",
      "Complete the Code game",
      "Unlimited AI Explain",
      "City leaderboard filter",
    ],
    cta: "Start Free",
    planKey: "free" as const,
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹99",
    period: "per month",
    color: "bg-[#fde047]",
    tag: "Most Popular",
    tagColor: "bg-[#e94560]",
    features: [
      "Full roadmap — all 6 stages",
      "All 3 games + future games",
      "Unlimited AI Explain",
      "City leaderboard filter",
      "Streak protection (1 per month)",
      "Priority support",
    ],
    locked: [],
    cta: "Go Pro",
    planKey: "pro" as const,
  },
  {
    key: "pack",
    name: "Beginner Pack",
    price: "₹149",
    period: "one-time",
    color: "bg-[#34d399]",
    tag: "Best Value",
    tagColor: "bg-[#1a1a2e]",
    features: [
      "Everything in Pro",
      "Learn C from Zero — full course",
      "DSA for Beginners module",
      "Lifetime access — no subscription",
    ],
    locked: [],
    cta: "Buy Pack",
    planKey: "pack" as const,
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCta = (planKey: string) => {
    if (planKey === "free") { navigate("/register"); return; }
    if (!user) { navigate("/register"); return; }
    navigate(`/checkout?plan=${planKey}`);
  };

  const currentPlan = user?.plan ?? "free";

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#fde047] border-b-4 border-black px-6 py-14 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-black/50 mb-3">Pricing</p>
        <h1 className="text-5xl md:text-7xl font-black text-black uppercase leading-tight mb-4">
          Simple,<br />Honest Pricing.
        </h1>
        <p className="text-lg font-bold text-black/70 max-w-xl mx-auto">
          Start free. Upgrade when you&apos;re ready. No hidden fees.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => {
            const isCurrentPlan = currentPlan === plan.planKey;
            return (
              <div
                key={plan.key}
                className={`${plan.color} border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col ${i === 1 ? "md:-translate-y-4" : ""} ${isCurrentPlan ? "ring-4 ring-[#34d399] ring-offset-2" : ""}`}
              >
                {plan.tag && (
                  <div className={`${plan.tagColor} border-b-4 border-black px-4 py-2 font-black text-white text-sm uppercase text-center tracking-widest`}>
                    {plan.tag}
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="bg-[#34d399] border-b-4 border-black px-4 py-2 font-black text-black text-sm uppercase text-center tracking-widest">
                    ✓ Your Current Plan
                  </div>
                )}
                <div className="px-6 pt-6 pb-4 border-b-4 border-black">
                  <h2 className="text-2xl font-black text-black uppercase mb-1">{plan.name}</h2>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-black">{plan.price}</span>
                    <span className="font-bold text-black/60 text-sm mb-2">/{plan.period}</span>
                  </div>
                </div>
                <div className="px-6 py-5 flex-1 flex flex-col gap-3">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2 font-bold text-sm text-black">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" /> {f}
                    </div>
                  ))}
                  {plan.locked.map((f, j) => (
                    <div key={j} className="flex items-start gap-2 font-bold text-sm text-black/30">
                      <Lock className="w-4 h-4 mt-0.5 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-6">
                  {isCurrentPlan ? (
                    <div className="w-full text-center bg-black/10 border-4 border-black/20 font-black text-lg py-3 text-black/40 cursor-default">
                      Active Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCta(plan.planKey)}
                      className="w-full bg-black text-white border-4 border-black font-black text-lg py-3 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 transition-all"
                    >
                      {plan.cta} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-14 border-4 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
          <div className="bg-black text-white px-6 py-4 font-black uppercase tracking-widest text-sm">Common Questions</div>
          {[
            { q: "Can I cancel anytime?", a: "Yes. Pro is month-to-month. Cancel from your account — no questions asked." },
            { q: "What's the difference between Pro and Beginner Pack?", a: "Pro is a monthly subscription. Beginner Pack is a one-time purchase with lifetime access and extra courses." },
            { q: "Is there a free trial for Pro?", a: "The Free plan is a permanent trial. Upgrade only when you need more." },
            { q: "What payment methods are accepted?", a: "UPI, debit/credit cards, and net banking. All payments are secure." },
          ].map((item, i) => (
            <div key={i} className="border-t-4 border-black px-6 py-5">
              <p className="font-black text-black mb-1">{item.q}</p>
              <p className="font-bold text-black/60 text-sm">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#1a1a2e] border-4 border-black p-8 text-center shadow-[6px_6px_0_0_#000]">
          <p className="font-black text-white text-xl mb-2">Still not sure?</p>
          <p className="font-bold text-white/60 text-sm mb-6">Start free. No credit card, no commitment.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#34d399] border-4 border-black font-black text-lg px-8 py-3 shadow-[4px_4px_0_0_#34d399] hover:-translate-y-0.5 transition-all text-black"
          >
            <Zap className="w-5 h-5" /> Start for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
