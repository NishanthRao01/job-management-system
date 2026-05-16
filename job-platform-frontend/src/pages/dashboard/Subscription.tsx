import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { subscriptionsApi } from '../../api/subscriptions';
import { Check } from 'lucide-react';

const Subscription = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { data: plansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionsApi.getPlans(),
  });

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => subscriptionsApi.createSubscription(planId),
    onSuccess: () => {
      setSuccess('Successfully subscribed! An associate has been assigned to you.');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to subscribe.');
      setSuccess('');
    },
  });

  const plans = plansData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Pricing Plans</h2>
        <p className="mt-4 text-xl text-slate-600">Choose the right plan for your job search.</p>
      </div>

      {success && (
        <div className="mt-8 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center font-medium">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {isLoadingPlans ? (
        <div className="mt-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {plans.map((plan: any) => (
            <div key={plan._id} className="border border-slate-200 rounded-2xl shadow-sm flex flex-col p-8 bg-white hover:border-indigo-500 transition-colors">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-slate-900">
                  <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                    <span className="ml-3 text-slate-500">{plan.jobLimitPerDay} job applications/day</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                    <span className="ml-3 text-slate-500">Dedicated Associate</span>
                  </li>
                  <li className="flex">
                    <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                    <span className="ml-3 text-slate-500">Application Tracking</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => subscribeMutation.mutate(plan._id)}
                disabled={subscribeMutation.isPending}
                className="mt-8 block w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {subscribeMutation.isPending ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full text-center text-slate-500">
              No plans available at the moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscription;
