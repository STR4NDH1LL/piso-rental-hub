import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const APIKeySetup: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, you'd save this to your backend/environment
    localStorage.setItem('openai-api-key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          OpenAI API Key Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The ID verification feature requires an OpenAI API key for document analysis.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
        </div>

        <Button onClick={handleSave} disabled={!apiKey} className="w-full">
          {saved ? 'Saved!' : 'Save API Key'}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-500 hover:underline">OpenAI Platform</a></p>
          <p className="mt-1">Note: In production, this should be configured as a Supabase Edge Function secret.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeySetup;