import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  currentStep?: number;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, currentStep = 3 }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side with background image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-500">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/90 to-emerald-400/80">
          <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-10" />
        </div>
        <div className="relative z-10 p-12 flex flex-col justify-between min-h-[600px]">
          <div>
            <h1 className="text-2xl font-bold text-white">Evenly</h1>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white">
              {title}<br />
              {subtitle}
            </h2>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-2 rounded ${
                    step === currentStep ? 'bg-white' : 'bg-emerald-400/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="flex-1 p-8 lg:p-12 bg-white">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 