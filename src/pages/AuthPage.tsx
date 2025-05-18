import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Zap, AlertCircle, Github, Mail, Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from "@/components/ui/separator";
import SolarSwapLogo from '@/components/navbar/SolarSwapLogo';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn, signUp, signInWithOAuth, user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in with:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Sign in error:", error);
        
        if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Please verify your email address before signing in.');
          toast.error("Please verify your email address before signing in.", {
            description: "Check your inbox for a confirmation email"
          });
        } else if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please try again.');
          toast.error("Invalid email or password");
        } else {
          setErrorMessage(error.message || 'Invalid credentials. Please try again.');
          toast.error("Authentication failed", {
            description: error.message
          });
        }
      } else {
        // Success - User will be redirected by the useEffect watching the user state
        console.log("Sign in successful, redirecting...");
        toast.success("Sign in successful!", {
          description: "Redirecting to dashboard..."
        });
        // Force a navigation if the useEffect doesn't trigger
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      console.error("Unexpected error during sign in:", err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again later.');
      toast.error("Authentication error", {
        description: err.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign up with:", email);
      const { error, emailConfirmationRequired } = await signUp(email, password);
      
      if (error) {
        console.error("Sign up error:", error);
        
        if (error.message.includes('User already registered')) {
          setErrorMessage('This email is already registered. Please sign in instead.');
          toast.error("Email already registered");
          // Auto-switch to signin tab
          setTimeout(() => navigate('/auth?tab=signin'), 1500);
        } else if (error.message.includes('Email signups are disabled')) {
          setErrorMessage('Email signups are disabled in Supabase. Please enable them in your dashboard.');
          toast.error("Email signups are disabled");
        } else {
          setErrorMessage(error.message || 'Failed to create account. Please try again later.');
          toast.error("Registration failed", {
            description: error.message
          });
        }
      } else {
        // Clear form on successful signup
        setEmail('');
        setPassword('');
        
        if (emailConfirmationRequired) {
          setSuccessMessage('Please check your email to verify your account before signing in.');
          toast.success("Account created", {
            description: "Please check your email to verify your account"
          });
        } else {
          // Auto-switch to signin tab if email confirmation is not required
          toast.success("Account created successfully!");
          navigate('/auth?tab=signin');
        }
      }
    } catch (err: any) {
      console.error("Unexpected error during sign up:", err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again later.');
      toast.error("Registration error", {
        description: err.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setErrorMessage('');
    setOauthLoading(provider);
    
    try {
      console.log(`Attempting to sign in with ${provider}`);
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        console.error(`${provider} sign in error:`, error);
        setErrorMessage(error.message || `Failed to sign in with ${provider}.`);
        toast.error(`${provider} authentication failed`, {
          description: error.message
        });
      } else {
        // OAuth redirect will happen, no need for additional action here
        console.log(`${provider} auth initiated, redirecting...`);
        toast.success(`Authenticating with ${provider}...`);
      }
    } catch (err: any) {
      console.error(`Unexpected error during ${provider} sign in:`, err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again later.');
      toast.error("Authentication error", {
        description: err.message || "An unexpected error occurred"
      });
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="flex items-center mb-8 scale-125">
        <SolarSwapLogo />
      </div>
      
      <Card className="w-full max-w-md">
        <Tabs defaultValue={defaultTab}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email"
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-2 text-xs text-muted-foreground">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={!!oauthLoading}
                      className="w-full"
                    >
                      {oauthLoading === 'google' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      )}
                      Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={!!oauthLoading}
                      className="w-full"
                    >
                      {oauthLoading === 'github' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Github className="mr-2 h-4 w-4" />
                      )}
                      GitHub
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email"
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-2 text-xs text-muted-foreground">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={!!oauthLoading}
                      className="w-full"
                    >
                      {oauthLoading === 'google' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      )}
                      Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={!!oauthLoading}
                      className="w-full"
                    >
                      {oauthLoading === 'github' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Github className="mr-2 h-4 w-4" />
                      )}
                      GitHub
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center">
            <CardDescription className="text-xs text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </CardDescription>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
