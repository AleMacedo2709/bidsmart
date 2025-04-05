
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

const Institutional = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-12 px-4 max-w-4xl">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-6">About Auction Estate Guardian</h1>
          <p className="text-lg text-gray-600 mb-4">
            Auction Estate Guardian is a specialized tool for investors and individuals
            who acquire real estate properties through auctions. Our mission is to help you
            make informed financial decisions while maintaining complete control over your data.
          </p>
          <p className="text-lg text-gray-600">
            This application was developed by [Provider Company Name], a leader in
            auction-based real estate solutions.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
          <div className="border-l-4 border-primary pl-4 py-2 mb-6 bg-primary/5">
            <p className="text-gray-800">
              <strong>Your data is encrypted using advanced AES-256 encryption and stored exclusively on your device. 
              Even the provider company cannot view, access, or manage any information entered into the app.</strong>
            </p>
            <p className="mt-2 text-gray-800">
              <strong>For your privacy and protection, it is essential that you save an encrypted backup in a secure location
              (such as a USB drive, private cloud storage, or secure email). In case of device loss or app deletion,
              your data cannot be recovered without this backup file. You are fully responsible for storing your backup
              and password safely.</strong>
            </p>
          </div>
          <p className="text-gray-600 mb-3">
            This app is provided free of charge. All data is stored only on your device. 
            The company has no access to your inputs.
          </p>
          <p className="text-gray-600">
            Our approach to data privacy is compliant with LGPD (Lei Geral de Proteção de Dados), 
            the Brazilian General Data Protection Law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> contact@example.com</p>
            <p><strong>Website:</strong> www.example.com</p>
            <p><strong>Address:</strong> 123 Example Street, São Paulo, Brazil</p>
          </div>
          <div className="mt-6 flex space-x-4">
            <Button variant="outline" asChild>
              <a href="mailto:contact@example.com">Email Us</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">Visit Website</a>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Legal Information</h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              <Link to="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
            <p className="text-gray-600">
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </p>
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} [Provider Company Name]. All rights reserved.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Institutional;
