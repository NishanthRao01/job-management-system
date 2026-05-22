import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi } from '../../api/subscriptions';
import { Check, Star, Zap } from 'lucide-react';
import api from "../../api/axios";

const Subscription = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);

  const { data: plansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionsApi.getPlans(),
  });


  const handlePayment = async (planId: string) => {
    try {
      setSubscribingPlanId(planId);
      // create razorpay order
      const { data } = await api.post(
        "/payments/create-order",
        { planId }
      );
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Job Management System",
        description: "Subscription Payment",
        order_id: data.order.id,
        handler: async function (response: any) {
          // verify payment
          await api.post("/payments/verify", {
            razorpay_order_id:
              response.razorpay_order_id,
            razorpay_payment_id:
              response.razorpay_payment_id,
            razorpay_signature:
              response.razorpay_signature,
          });
          // create subscription AFTER verification
          await subscriptionsApi.createSubscription(planId);
          setSuccess(
            "Payment successful and subscription activated!"
          );
          setError("");
          setSubscribingPlanId(null);
        },
        modal: {
          ondismiss: function () {
            setSubscribingPlanId(null);
            setError("Payment cancelled");
          },
        },
        theme: {
          color: "#6366f1",
        },
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Payment failed"
      );
      setSubscribingPlanId(null);
    }
  };


  const plans = plansData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 mb-4">
          <Zap className="w-3.5 h-3.5" /> PRICING
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Choose Your Plan</h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Select the perfect plan for your job search. All plans include a dedicated associate.</p>
      </div>

      {success && (
        <div className="mt-8 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl text-center font-semibold flex items-center justify-center gap-2 animate-scale-in">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-center font-semibold animate-scale-in">
          {error}
        </div>
      )}

      {isLoadingPlans ? (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl p-8 bg-white">
              <div className="skeleton h-6 w-24 mb-4"></div>
              <div className="skeleton h-10 w-32 mb-6"></div>
              <div className="space-y-3">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-4 w-5/6"></div>
              </div>
              <div className="skeleton h-12 w-full mt-8 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {plans.map((plan: any, idx: number) => {
            const isPopular = idx === 1; // Middle plan is "popular"
            return (
              <div
                key={plan._id}
                className={`relative rounded-2xl flex flex-col p-8 card-hover transition-all duration-300 ${
                  isPopular
                    ? 'bg-white border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                    : 'bg-white border border-slate-200 shadow-sm hover:border-indigo-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-5 flex items-baseline text-slate-900">
                    <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
                    <span className="ml-1 text-lg font-medium text-slate-500">/month</span>
                  </p>
                  <ul className="mt-8 space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-600">{plan.jobLimitPerDay} job applications/day</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-600">Dedicated Associate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-600">Application Tracking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-600">Real-time Chat</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePayment(plan._id)}
                  disabled={subscribingPlanId === plan._id}
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-xl text-center font-semibold transition-all duration-200 disabled:opacity-50 ${
                    isPopular
                      ? 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                      : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  {subscribingPlanId === plan._id ? (
                    <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin mx-auto" />
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            );
          })}
          {plans.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No plans available</h3>
              <p className="text-slate-500">Plans will appear here once configured by the admin.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscription;
