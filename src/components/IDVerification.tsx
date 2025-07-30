import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IDVerificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationComplete?: () => void;
}

const IDVerification: React.FC<IDVerificationProps> = ({
  open,
  onOpenChange,
  onVerificationComplete
}) => {
  const [step, setStep] = useState<'upload' | 'camera' | 'processing' | 'complete'>('upload');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('drivers_license');
  const [processing, setProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<'document' | 'selfie'>('document');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: cameraMode === 'selfie' ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep('camera');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure permissions are granted.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${cameraMode}-${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          if (cameraMode === 'document') {
            setIdDocument(file);
            setCameraMode('selfie');
            toast({
              title: "Document Captured",
              description: "Now take a selfie for verification",
            });
          } else {
            setSelfie(file);
            stopCamera();
            setStep('upload');
            toast({
              title: "Selfie Captured",
              description: "Both photos captured successfully",
            });
          }
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'document') {
        setIdDocument(file);
      } else {
        setSelfie(file);
      }
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('id-verification')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('id-verification')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const processVerification = async () => {
    if (!idDocument || !selfie) {
      toast({
        title: "Missing Files",
        description: "Please provide both ID document and selfie",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setStep('processing');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload files
      const [idDocumentUrl, selfieUrl] = await Promise.all([
        uploadFile(idDocument, 'documents'),
        uploadFile(selfie, 'selfies')
      ]);

      // Call verification edge function
      const { data: verificationData, error: functionError } = await supabase.functions.invoke('verify-identity', {
        body: {
          idDocumentUrl,
          selfieUrl,
          documentType
        }
      });

      if (functionError) throw functionError;

      // Save verification record
      const { error: dbError } = await supabase
        .from('id_verifications')
        .insert({
          user_id: user.id,
          status: verificationData.verificationStatus,
          id_document_url: idDocumentUrl,
          selfie_url: selfieUrl,
          document_type: documentType,
          verification_notes: verificationData.verificationNotes
        });

      if (dbError) throw dbError;

      setVerificationResult(verificationData);
      setStep('complete');

      toast({
        title: "Verification Complete",
        description: `Status: ${verificationData.verificationStatus}`,
      });

      onVerificationComplete?.();
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
      setStep('upload');
    } finally {
      setProcessing(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>ID Verification</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              To complete your verification, we need a photo of your ID document and a selfie.
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document Type</label>
                <select 
                  value={documentType} 
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="other">Other Government ID</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">ID Document</h3>
                    {idDocument ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(idDocument)} 
                          alt="ID Document" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-green-600">✓ Document uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Upload ID document</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'document')}
                          className="w-full text-sm"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Selfie</h3>
                    {selfie ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(selfie)} 
                          alt="Selfie" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-green-600">✓ Selfie uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Upload selfie</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'selfie')}
                          className="w-full text-sm"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={startCamera} variant="outline" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Use Camera
              </Button>
              <Button 
                onClick={processVerification} 
                disabled={!idDocument || !selfie || processing}
                className="flex-1"
              >
                {processing ? 'Processing...' : 'Submit for Verification'}
              </Button>
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="font-semibold mb-2">
                {cameraMode === 'document' ? 'Take a photo of your ID document' : 'Take a selfie'}
              </p>
              <p className="text-sm text-muted-foreground">
                {cameraMode === 'document' 
                  ? 'Ensure the document is clear and all text is readable'
                  : 'Look directly at the camera with good lighting'
                }
              </p>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-64 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-2">
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Verification</h3>
            <p className="text-muted-foreground">
              Our AI is analyzing your documents. This may take a few moments...
            </p>
          </div>
        )}

        {step === 'complete' && verificationResult && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              {getStatusIcon(verificationResult.verificationStatus)}
              <h3 className="text-lg font-semibold">Verification Complete</h3>
            </div>
            
            <Badge variant={getStatusColor(verificationResult.verificationStatus) as any}>
              {verificationResult.verificationStatus.toUpperCase()}
            </Badge>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm">{verificationResult.verificationNotes}</p>
                {verificationResult.overallConfidence && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Confidence: {Math.round(verificationResult.overallConfidence * 100)}%
                  </p>
                )}
              </CardContent>
            </Card>

            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IDVerification;