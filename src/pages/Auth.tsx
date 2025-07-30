import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

// Auth state cleanup utility
const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
      console.log('Removed:', key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
      console.log('Removed from session:', key);
    }
  });
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('User already authenticated, redirecting...');
        navigate('/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const useDemoAccount = (accountType: 'landlord' | 'tenant') => {
    if (accountType === 'landlord') {
      setEmail('landlord@demo.com');
      setPassword('demo123');
    } else {
      setEmail('tenant@demo.com');
      setPassword('demo123');
    }
    setShowDemoAccounts(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting sign up for:', email);
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/role-selection`;
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });
      
      console.log('Sign up response:', { data, error });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      // Clear form
      setEmail("");
      setPassword("");
      setFullName("");
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      }
      
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting sign in for:', email);
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Signout failed (expected):', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      console.log('Sign in response:', { data, error });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('Sign in successful, user:', data.user.id);
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        
        // Use a timeout to allow auth state to settle
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = error.message;
      
      // Provide more helpful error messages
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      }
      
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Navigation Header */}
      <nav className="w-full p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="/lovable-uploads/7412162f-de95-47ed-9113-ff969ca9a62a.png" 
              alt="Piso Logo" 
              className="h-16 w-auto"
            />
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Home
          </Button>
        </div>
      </nav>
      
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome to Piso</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                {/* Demo accounts section */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Try Demo Accounts</span>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                    >
                      {showDemoAccounts ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  
                  {showDemoAccounts && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-blue-700">Use these accounts to test the platform:</p>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => useDemoAccount('landlord')}
                        >
                          Landlord Demo
                        </Button>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => useDemoAccount('tenant')}
                        >
                          Tenant Demo
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password: demo123
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;