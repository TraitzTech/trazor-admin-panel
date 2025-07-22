'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { apiFetch, setAuthToken } from '@/lib/api';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import {useAuth} from "@/components/auth-provider";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { isAdmin, loading, login } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  useEffect(() => {
    if (!loading && isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, loading]);

  if (loading || isAdmin) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-blue-600 font-semibold">Loading...</span>
        </div>
    );
  }


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: '', password: '', general: '' });

    // Validation
    let hasErrors = false;
    const newErrors = { email: '', password: '', general: '' };

    if (!loginData.email) {
        newErrors.email = 'Email is required';
        hasErrors = true;
    } else if (!validateEmail(loginData.email)) {
        newErrors.email = 'Please enter a valid email address';
        hasErrors = true;
    }
    if (!loginData.password) {
        newErrors.password = 'Password is required';
        hasErrors = true;
    } else if (loginData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        hasErrors = true;
    }

    if (hasErrors) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
    }
      try {
        await login(loginData.email, loginData.password);
      } catch (error: any) {
        setErrors({ ...errors, general: error.message || 'Login failed' });
        setIsLoading(false);
      }

    };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: '', password: '', general: '' });

    if (!forgotPasswordData.email) {
      setErrors({ email: 'Email is required', password: '', general: '' });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(forgotPasswordData.email)) {
      setErrors({ email: 'Please enter a valid email address', password: '', general: '' });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResetEmailSent(true);
      toast.success('Reset email sent!', {
        description: 'Check your email for password reset instructions.'
      });
    } catch (error) {
      setErrors({ email: '', password: '', general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (showForgotPassword) {
      setForgotPasswordData(prev => ({ ...prev, [field]: value }));
    } else {
      setLoginData(prev => ({ ...prev, [field]: value }));
    }
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetToLogin = () => {
    setShowForgotPassword(false);
    setResetEmailSent(false);
    setErrors({ email: '', password: '', general: '' });
    setForgotPasswordData({ email: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InternHub Admin</h1>
          <p className="text-gray-600">
            {showForgotPassword 
              ? 'Reset your password' 
              : 'Sign in to your admin dashboard'
            }
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {showForgotPassword ? 'Forgot Password' : 'Welcome Back'}
              </CardTitle>
              {showForgotPassword && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetToLogin}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
            <CardDescription>
              {showForgotPassword 
                ? 'Enter your email address and we\'ll send you a link to reset your password.'
                : 'Enter your credentials to access the admin dashboard'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-2">
            {/* General Error Alert */}
            {errors.general && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Reset Email Sent Success */}
            {resetEmailSent && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Password reset instructions have been sent to your email address.
                </AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            {!showForgotPassword && !resetEmailSent && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="admin@internhub.com"
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={loginData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
                    onClick={() => setShowForgotPassword(true)}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            )}

            {/* Forgot Password Form */}
            {showForgotPassword && !resetEmailSent && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="resetEmail"
                      type="email"
                      value={forgotPasswordData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending reset email...
                    </>
                  ) : (
                    'Send Reset Email'
                  )}
                </Button>
              </form>
            )}

            {/* Reset Email Sent Actions */}
            {resetEmailSent && (
              <div className="space-y-4">
                <Button 
                  onClick={resetToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
                >
                  Back to Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setResetEmailSent(false);
                    setErrors({ email: '', password: '', general: '' });
                  }}
                  className="w-full"
                >
                  Resend Email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © { new Date().getFullYear() } InternHub. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Button variant="link" className="text-xs text-gray-400 hover:text-gray-600 p-0 h-auto">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-xs text-gray-400 hover:text-gray-600 p-0 h-auto">
              Terms of Service
            </Button>
            <Button variant="link" className="text-xs text-gray-400 hover:text-gray-600 p-0 h-auto">
              Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;