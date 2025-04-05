
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-12 px-4 max-w-4xl">
        <Button variant="outline" asChild className="mb-8">
          <Link to="/institutional">
            &larr; Back to About
          </Link>
        </Button>
        
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            <strong>Last Updated:</strong> April 5, 2025
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy explains how Auction Estate Guardian ("we," "us," or "our") collects, uses, and protects your information when you use our mobile application and website (collectively, the "Services"). We are committed to ensuring the privacy and security of your data in compliance with the Brazilian General Data Protection Law (LGPD - Lei Geral de Proteção de Dados).
          </p>
          
          <h2>2. Information Collection and Use</h2>
          <p>
            <strong>Minimal Data Collection:</strong> Our application is designed with privacy as a fundamental principle. We collect only the minimum information required to provide our services:
          </p>
          <ul>
            <li>
              <strong>Authentication Information:</strong> When you create an account, we collect basic information necessary for authentication (email address and authentication method). This data is used exclusively to enable secure access to your account.
            </li>
            <li>
              <strong>Local Device Storage:</strong> All property data, calculations, and personal information you enter into the application is stored exclusively on your device and protected by encryption. We do not have access to this data.
            </li>
          </ul>
          
          <h2>3. Data Storage and Encryption</h2>
          <p>
            <strong>Local Storage Only:</strong> All user-generated data (property information, financial calculations, notes) is stored exclusively on your device using:
          </p>
          <ul>
            <li>IndexedDB for web platforms</li>
            <li>SQLite + SecureStorage for mobile platforms</li>
          </ul>
          <p>
            <strong>Encryption:</strong> All locally stored data is protected using AES-256 encryption. The encryption key is derived from a combination of your authentication ID and a local password that you set. This ensures that only you can access your data.
          </p>
          
          <h2>4. No External Data Transmission</h2>
          <p>
            <strong>No Cloud Storage:</strong> We do not transmit or store your property data, calculations, or personal information on our servers or any third-party cloud services. All data remains on your device.
          </p>
          <p>
            <strong>Authentication Only:</strong> The only data transmitted to our servers is the minimal information required for authentication purposes.
          </p>
          
          <h2>5. User Rights Under LGPD</h2>
          <p>
            In accordance with the Brazilian General Data Protection Law (LGPD), you have the following rights:
          </p>
          <ul>
            <li>The right to access your personal data</li>
            <li>The right to correct incomplete, inaccurate, or outdated data</li>
            <li>The right to anonymize, block, or delete unnecessary or excessive data</li>
            <li>The right to data portability</li>
            <li>The right to delete your personal data</li>
            <li>The right to information about public and private entities with which we have shared your data</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>
            Since most of your data is stored only on your device and we do not have access to it, you already have complete control over this information.
          </p>
          
          <h2>6. Data Backup Responsibility</h2>
          <p>
            <strong>User Responsibility:</strong> Because we do not store your data on our servers, you are responsible for backing up your data to prevent loss. The application provides a feature to export encrypted backups, which we strongly recommend you use regularly.
          </p>
          <p>
            <strong>Important Notice:</strong> In case of device loss, app deletion, or data corruption, we cannot recover your data if you have not created and safely stored a backup.
          </p>
          
          <h2>7. Analytics and Error Reporting</h2>
          <p>
            We may collect anonymous usage statistics and error reports to improve the application. This information is completely anonymized and contains no personal data or property information.
          </p>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@example.com</li>
            <li>Address: 123 Example Street, São Paulo, Brazil</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
