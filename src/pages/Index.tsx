
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Manage Your Auction Properties Securely
              </h1>
              <p className="text-xl text-gray-600">
                Calculate profits, simulate taxes, and track investments with complete data privacy.
                All your data is encrypted and stored only on your device.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto">
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/calculator">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Start New Calculation
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth?mode=signup">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/auth?mode=login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block rounded-lg shadow-2xl overflow-hidden bg-white">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                alt="Real estate properties"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need for Real Estate Auctions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our app helps you make informed decisions about auction properties with powerful calculation tools
              and secure data management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Profit & Tax Calculator</h3>
              <p className="text-gray-600">
                Accurately calculate potential profits and tax implications for your auction properties,
                including capital gains tax with Brazilian progressive rates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Offline & Encrypted</h3>
              <p className="text-gray-600">
                All your data is stored only on your device using AES-256 encryption.
                Use the app offline with complete peace of mind.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">LGPD Compliant</h3>
              <p className="text-gray-600">
                Fully compliant with Brazilian General Data Protection Law (LGPD).
                Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary rounded-2xl overflow-hidden shadow-lg">
            <div className="px-6 py-12 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Optimize Your Real Estate Investments?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Join now to access all features and start managing your auction properties with confidence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <Link to="/calculator">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100"
                    >
                      Start a New Calculation
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth?mode=signup">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100"
                    >
                      Create a Free Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
