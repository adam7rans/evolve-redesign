'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getCookie } from 'cookies-next';
import { User } from '@supabase/supabase-js';
import PlanSelection from './PlanSelection';
import SignUpForm from './SignUpForm';
import PaymentMethod from './PaymentMethod';
import { Progress } from "@/components/ui/progress";

interface Step {
  name: string;
  href: string;
  completed: boolean;
}

interface CheckoutClientProps {
  currentStep: string;
}

export default function CheckoutClient({ currentStep }: CheckoutClientProps) {
  const [steps, setSteps] = useState<Step[]>([
    { name: 'Plan Selection', href: '/checkout?step=plan', completed: true },
    { name: 'Sign Up', href: '/checkout?step=signup', completed: false },
    { name: 'Payment', href: '/checkout?step=payment', completed: false },
  ]);
  const [selectedPlan, setSelectedPlan] = useState<{ priceId: string; interval: 'month' | 'year' } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{
    priceId: string;
    interval: 'month' | 'year';
    name: string;
    price: number;
  } | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        updateStepCompletion('Sign Up', true);
      }
    };

    checkUser();
  }, [supabase]);

  useEffect(() => {
    const currentStepIndex = steps.findIndex(step => step.href.includes(currentStep));
    if (currentStepIndex !== -1) {
      updateStepCompletion(steps[currentStepIndex].name, true);
    }
  }, [currentStep]); // Remove steps from the dependency array

  useEffect(() => {
    const selectedPlanCookie = getCookie('selectedPlan') as string | undefined;
    if (selectedPlanCookie) {
      const planData = JSON.parse(selectedPlanCookie);
      setSelectedPlanDetails({
        priceId: planData.priceId,
        interval: planData.interval,
        name: planData.name,
        price: planData.price
      });
      setSelectedPlan({ priceId: planData.priceId, interval: planData.interval });
      updateStepCompletion('Plan Selection', true);
    }
  }, []);

  const updateStepCompletion = (stepName: string, completed: boolean) => {
    setSteps((prevSteps: Step[]) => 
      prevSteps.map((step: Step) => 
        step.name === stepName ? { ...step, completed } : step
      )
    );
  };

  const handleSelectPlan = (priceId: string, interval: 'month' | 'year') => {
    setSelectedPlan({ priceId, interval });
    updateStepCompletion('Plan Selection', true);
    router.push('/checkout?step=signup');
  };

  const handleSignUp = async (newUser: User) => {
    setUser(newUser);
    updateStepCompletion('Sign Up', true);
    router.push('/checkout?step=payment');
  };

  const fetchClientSecret = async () => {
    // Implement API call to fetch client secret
    // setClientSecret(response.clientSecret);
  };

  useEffect(() => {
    if (user && currentStep === 'payment') {
      fetchClientSecret();
    }
  }, [user, currentStep]);

  const handleChangePlan = () => {
    router.push('/checkout?step=plan');
  };

  const handleStepClick = (step: Step) => {
    if (step.completed) {
      router.push(step.href);
    }
  };

  const showSelectedPlan = currentStep === 'signup' || currentStep === 'payment';

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'plan':
        return <PlanSelection
          plans={[]} // Pass your plans data here
          selectedPlan={selectedPlan?.priceId || null}
          billingInterval={selectedPlan?.interval || 'month'}
          onSelectPlan={handleSelectPlan}
        />;
      case 'signup':
        return <SignUpForm onSignUp={handleSignUp} selectedPlan={selectedPlanDetails} />;
      case 'payment':
        return <PaymentMethod
          user={user}
          clientSecret={clientSecret}
          selectedPlan={selectedPlanDetails}
        />;
      default:
        return null;
    }
  };

  const getProgressValue = () => {
    switch (currentStep) {
      case 'plan':
        return 33;
      case 'signup':
        return 66;
      case 'payment':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <nav aria-label="Progress" className="mt-8">
          <Progress value={getProgressValue()} className="mb-4" />
          <ol role="list" className="flex items-center justify-between w-full">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="relative flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(step)}
                    className={`h-9 flex items-center ${
                      step.completed ? 'cursor-pointer text-blue-600' : 'cursor-not-allowed text-gray-400'
                    }`}
                    disabled={!step.completed}
                  >
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-600 rounded-full">
                      {step.completed ? (
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{stepIdx + 1}</span>
                      )}
                    </span>
                  </button>
                  <span className={`mt-2 text-xs font-medium text-center ${step.completed ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}