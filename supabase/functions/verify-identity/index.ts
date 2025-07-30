import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idDocumentUrl, selfieUrl, documentType } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze the ID document using OpenAI Vision
    const idAnalysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert ID document verification assistant. Analyze the provided ID document image and return a JSON response with the following structure:
            {
              "isValid": boolean,
              "documentType": "passport|drivers_license|national_id|other",
              "extractedInfo": {
                "name": "extracted name",
                "dateOfBirth": "YYYY-MM-DD if visible",
                "documentNumber": "document number if visible",
                "expiryDate": "YYYY-MM-DD if visible"
              },
              "qualityChecks": {
                "imageQuality": "good|fair|poor",
                "textReadability": "good|fair|poor", 
                "documentIntegrity": "good|fair|poor"
              },
              "confidence": 0.0-1.0,
              "notes": "any additional observations"
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this ${documentType} document for verification purposes. Check for authenticity, quality, and extract key information.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: idDocumentUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!idAnalysisResponse.ok) {
      throw new Error(`OpenAI API error: ${idAnalysisResponse.statusText}`);
    }

    const idAnalysisData = await idAnalysisResponse.json();
    const idAnalysis = JSON.parse(idAnalysisData.choices[0].message.content);

    // Analyze the selfie for face detection and quality
    const selfieAnalysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a selfie verification assistant. Analyze the provided selfie image and return a JSON response:
            {
              "faceDetected": boolean,
              "imageQuality": "good|fair|poor",
              "faceQuality": "good|fair|poor",
              "multipleFaces": boolean,
              "eyesVisible": boolean,
              "confidence": 0.0-1.0,
              "notes": "observations about the selfie"
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this selfie for ID verification. Check for face detection, image quality, and suitability for identity verification.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: selfieUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      }),
    });

    if (!selfieAnalysisResponse.ok) {
      throw new Error(`OpenAI API error for selfie: ${selfieAnalysisResponse.statusText}`);
    }

    const selfieAnalysisData = await selfieAnalysisResponse.json();
    const selfieAnalysis = JSON.parse(selfieAnalysisData.choices[0].message.content);

    // Determine verification status based on analysis
    let verificationStatus = 'pending';
    let verificationNotes = '';

    const idConfidence = idAnalysis.confidence || 0;
    const selfieConfidence = selfieAnalysis.confidence || 0;
    
    if (idAnalysis.isValid && selfieAnalysis.faceDetected && 
        idConfidence > 0.7 && selfieConfidence > 0.7 &&
        idAnalysis.qualityChecks?.imageQuality !== 'poor' &&
        selfieAnalysis.imageQuality !== 'poor') {
      verificationStatus = 'verified';
      verificationNotes = 'Automatic verification successful - high quality documents detected';
    } else if (idConfidence < 0.3 || selfieConfidence < 0.3 || 
               !idAnalysis.isValid || !selfieAnalysis.faceDetected) {
      verificationStatus = 'rejected';
      verificationNotes = `Verification failed: ${!idAnalysis.isValid ? 'Invalid ID document. ' : ''}${!selfieAnalysis.faceDetected ? 'No face detected in selfie. ' : ''}${idConfidence < 0.3 ? 'Poor ID quality. ' : ''}${selfieConfidence < 0.3 ? 'Poor selfie quality.' : ''}`;
    } else {
      verificationStatus = 'in_review';
      verificationNotes = 'Requires manual review - moderate confidence levels detected';
    }

    const result = {
      verificationStatus,
      verificationNotes,
      idAnalysis,
      selfieAnalysis,
      overallConfidence: (idConfidence + selfieConfidence) / 2
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-identity function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      verificationStatus: 'pending',
      verificationNotes: 'Technical error occurred - manual review required'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});