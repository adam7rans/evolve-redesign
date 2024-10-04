'use client';

import { usePathname } from 'next/navigation';

const steps = [
  { name: 'Sign Up', href: '/checkout/signup' },
  { name: 'Payment', href: '/checkout/payment' },
  { name: 'Paid', href: '/checkout/success' },
];

export default function ProgressBar() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => step.href === pathname);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}>
            <div className="relative flex items-center">
              <span className={`h-9 flex items-center ${stepIdx <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-600 rounded-full">
                  {stepIdx < currentStepIndex ? (
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{stepIdx + 1}</span>
                  )}
                </span>
              </span>
              <span className={`ml-4 text-sm font-medium ${stepIdx <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}