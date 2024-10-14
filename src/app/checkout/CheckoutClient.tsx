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
import Link from 'next/link';
import SelectedPlan from './SelectedPlan';
import GoogleAccountInfo, { GoogleUser } from './GoogleAccountInfo';

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
  const [plans, setPlans] = useState<any[]>([]);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Fetched user:', user);
      setUser(user);
      if (user) {
        updateStepCompletion('Sign Up', true);
        // Use user metadata directly
        const googleUserInfo: GoogleUser = {
          name: user.user_metadata.full_name || '',
          email: user.email || '',
          picture: user.user_metadata.avatar_url || ''
        };
        console.log('Setting Google user:', googleUserInfo);
        setGoogleUser(googleUserInfo);
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

  useEffect(() => {
    const fetchPlans = async () => {
      // Replace this with your actual API call to fetch plans
      const response = await fetch('/api/plans');
      const data = await response.json();
      setPlans(data);
    };

    fetchPlans();
  }, []);

  const updateStepCompletion = (stepName: string, completed: boolean) => {
    setSteps((prevSteps: Step[]) => {
      const updatedSteps = prevSteps.map((step: Step) => 
        step.name === stepName ? { ...step, completed } : step
      );
      // Ensure all previous steps are marked as completed
      const currentStepIndex = updatedSteps.findIndex(step => step.name === stepName);
      for (let i = 0; i < currentStepIndex; i++) {
        updatedSteps[i].completed = true;
      }
      return updatedSteps;
    });
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
    console.log('Rendering current step:', currentStep);
    console.log('Google user state:', googleUser);

    switch (currentStep) {
      case 'plan':
        return <PlanSelection
          plans={plans}
          selectedPlan={selectedPlan?.priceId || null}
          billingInterval={selectedPlan?.interval || 'month'}
          onSelectPlan={handleSelectPlan}
        />;
      case 'signup':
      case 'payment':
        return (
          <div className="flex flex-col w-full">
            <div className="w-full mb-6">
              <SelectedPlan onChangePlan={handleChangePlan} />
            </div>
            {googleUser ? (
              <div className="w-full mb-6">
                <GoogleAccountInfo 
                  user={googleUser} 
                  onChooseAnotherAccount={() => {
                    console.log('Choosing another account');
                    setGoogleUser(null);
                    setUser(null);
                    updateStepCompletion('Sign Up', false);
                    router.push('/checkout?step=signup');
                  }} 
                />
              </div>
            ) : (
              <div>No Google user data available</div>
            )}
            <div className="w-full md:w-2/3 mx-auto">
              {currentStep === 'signup' ? (
                <SignUpForm onSignUp={handleSignUp} selectedPlan={selectedPlanDetails} />
              ) : (
                <PaymentMethod
                  user={user}
                  selectedPlan={selectedPlanDetails}
                />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getProgressValue = () => {
    const stepIndex = steps.findIndex(step => step.href.includes(currentStep));
    if (stepIndex === -1) return 0;
    
    // Calculate progress based on completed steps
    const completedSteps = steps.slice(0, stepIndex).filter(step => step.completed).length;
    
    // If we're on the first step and it's not completed, return 0
    if (stepIndex === 0 && !steps[0].completed) return 0;
    
    // Calculate progress percentage
    const progress = (completedSteps / (steps.length - 1)) * 100;
    
    return Math.min(progress, 100); // Ensure we don't exceed 100%
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <nav aria-label="Progress" className="mt-16 relative">
          <div className="relative w-full">
            <Progress value={getProgressValue()} className="w-full h-12" />
            <ol className="flex justify-between w-full absolute top-0 left-0 right-0 bottom-0">
              {steps.map((step, index) => (
                <li key={step.name} className={`flex items-center ${
                  index === 0 ? 'justify-start' : 
                  index === 1 ? 'justify-center' : 
                  'justify-end'
                }`}>
                  <Link
                    href={step.href}
                    className={`h-full flex items-center px-4 py-2 rounded-md transition-colors ${
                      step.href.includes(currentStep)
                        ? 'bg-blue-600 dark:bg-blue-500 cursor-default'
                        : step.completed 
                          ? 'cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600' 
                          : 'cursor-not-allowed bg-gray-300 dark:bg-gray-600 opacity-50'
                    }`}
                    onClick={(e) => {
                      if (!step.completed) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <span className={`text-sm font-medium ${
                      step.href.includes(currentStep) || step.completed
                        ? 'text-white dark:text-gray-200' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="mt-8 w-full">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
