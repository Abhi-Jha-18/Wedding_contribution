import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Info, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validateRequired } from '../utils/validators';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError('');
  };

  const handleQuickDemoFill = () => {
    setFormData({
      email: 'demo@weddwish.com',
      password: 'Demo1234',
    });
    setErrors({});
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.message;

    const passValidation = validateRequired(formData.password, 'Password');
    if (!passValidation.valid) newErrors.password = passValidation.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setFormError('An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to oversee your wedding wishlist and guest contributions."
    >
      {/* Demo Credentials Quick Fill Box */}
      <div className="mb-6 p-3.5 bg-ivory rounded-xl border border-gold/30 flex items-start gap-3 text-xs text-navy/80">
        <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-navy">Demonstration Mode</p>
          <p className="text-navy/60 mt-0.5">
            Use demo account or register your own.
          </p>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="mt-2 text-xs font-semibold text-gold hover:text-navy underline cursor-pointer"
          >
            Click to autofill Demo credentials
          </button>
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. arjun@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            icon={ArrowRight}
            iconPosition="right"
          >
            Sign In to Dashboard
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-navy/10 text-center text-xs text-navy/60">
        Don't have a wedding registry yet?{' '}
        <Link
          to="/register"
          className="font-semibold text-gold hover:text-navy underline transition-colors"
        >
          Create one now
        </Link>
      </div>
    </AuthLayout>
  );
}
