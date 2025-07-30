import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertCircle, Camera } from 'lucide-react';
import IDVerification from '@/components/IDVerification';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  role: 'tenant' | 'landlord';
  full_name: string;
}

interface Verification {
  id: string;
  status: string;
  document_type: string;
  verification_notes: string;
  verified_at: string | null;
  rejected_reason: string | null;
  created_at: string;
}

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData as Profile);
      
      await fetchVerification(user.id);
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchVerification = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('id_verifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setVerification(data);
    } catch (error) {
      console.error('Error fetching verification:', error);
      toast({
        title: "Error",
        description: "Failed to fetch verification status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected': return <XCircle className="h-6 w-6 text-red-500" />;
      case 'in_review': return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default: return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'rejected': return 'destructive';
      case 'in_review': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'verified': return 'Your identity has been successfully verified. You can now access all platform features.';
      case 'rejected': return 'Your verification was rejected. Please review the feedback and try again with different documents.';
      case 'in_review': return 'Your documents are being reviewed by our team. This typically takes 1-2 business days.';
      case 'pending': return 'Verification is pending. Our AI system is processing your documents.';
      default: return 'Unknown verification status.';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">No profile found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Identity Verification</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verification ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(verification.status)}
                      <span className="font-semibold">
                        {verification.status.charAt(0).toUpperCase() + verification.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <Badge variant={getStatusColor(verification.status) as any}>
                      {verification.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground">
                    {getStatusDescription(verification.status)}
                  </p>

                  {verification.verification_notes && (
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Notes</h4>
                        <p className="text-sm">{verification.verification_notes}</p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="text-sm text-muted-foreground">
                    <p>Document Type: {verification.document_type.replace('_', ' ')}</p>
                    <p>Submitted: {new Date(verification.created_at).toLocaleDateString()}</p>
                    {verification.verified_at && (
                      <p>Verified: {new Date(verification.verified_at).toLocaleDateString()}</p>
                    )}
                  </div>

                  {verification.status === 'rejected' && (
                    <Button onClick={() => setVerificationDialogOpen(true)} className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="py-8">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Verify Your Identity</h3>
                    <p className="text-muted-foreground mb-6">
                      Complete identity verification to access all platform features. 
                      This helps ensure security for all users.
                    </p>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">What you'll need:</h4>
                      <ul className="text-sm space-y-1 text-left">
                        <li>• Government-issued photo ID (driver's license, passport, or national ID)</li>
                        <li>• A clear, well-lit selfie</li>
                        <li>• 2-3 minutes to complete the process</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Button onClick={() => setVerificationDialogOpen(true)} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Verification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {verification?.status === 'verified' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Verification Complete</h4>
                </div>
                <p className="text-sm text-green-700">
                  Congratulations! Your identity has been verified. You now have full access to all platform features.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <IDVerification
          open={verificationDialogOpen}
          onOpenChange={setVerificationDialogOpen}
          onVerificationComplete={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await fetchVerification(user.id);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Verification;