import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, AlertCircle, Sparkles } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateRequired, validatePasswordMatch } from '../utils/validators';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const newErrors = {};

    const nameVal = validateRequired(formData.name, 'Full name');
    if (!nameVal.valid) newErrors.name = nameVal.message;

    const emailVal = validateEmail(formData.email);
    if (!emailVal.valid) newErrors.email = emailVal.message;

    const passVal = validatePassword(formData.password);
    if (!passVal.valid) newErrors.password = passVal.message;

    const matchVal = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!matchVal.valid) newErrors.confirmPassword = matchVal.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(result.message || 'Registration failed');
      }
    } catch (err) {
      setFormError('An unexpected error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Registry"
      subtitle="Start building your custom wedding wishlist and share it with loved ones."
    >
      {formError && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Full Name"
          name="name"
          placeholder="e.g. Arjun Mehta"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={User}
          required
        />

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
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText="Must be 8+ characters with at least 1 uppercase and 1 number"
          required
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            loading={isLoading}
            icon={Sparkles}
          >
            Create My Registry
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-navy/10 text-center text-xs text-navy/60">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-gold hover:text-navy underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
