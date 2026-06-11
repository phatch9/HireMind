import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth.tsx';

interface AuthFormProps {
    defaultIsSignUp?: boolean;
}

export default function AuthForm({ defaultIsSignUp = false }: AuthFormProps) {
    const { signIn, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setPasswordError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                // Client-side validation for sign up
                if (!firstName.trim() || !lastName.trim()) {
                    setPasswordError('First and last name are required');
                    setLoading(false);
                    return;
                }

                const pwdErr = validatePassword(password);
                if (pwdErr) {
                    setPasswordError(pwdErr);
                    setLoading(false);
                    return;
                }

                if (password !== confirmPassword) {
                    setPasswordError('Passwords do not match');
                    setLoading(false);
                    return;
                }

                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    function validatePassword(pwd: string) {
        if (pwd.length <= 8) return 'Password must be more than 8 characters';
        if (!/[A-Z]/.test(pwd)) return 'Password must include an uppercase letter';
        if (!/[0-9]/.test(pwd)) return 'Password must include a number';
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) return 'Password must include a symbol';
        return null;
    }

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <h1>HireMind</h1>
                    <p className="text-secondary">
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {isSignUp && (
                        <div className="name-row">
                            <div className="form-group" style={{ marginRight: '8px' }}>
                                <label htmlFor="firstName" className="form-label">First name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className="form-input"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    placeholder="First name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName" className="form-label">Last name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className="form-input"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    placeholder="Last name"
                                />
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            placeholder="••••••••"
                            minLength={9}
                        />
                    </div>

                    {isSignUp && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                minLength={9}
                            />
                        </div>
                    )}

                    {passwordError && (
                        <div className="form-error" role="alert">
                            {passwordError}
                        </div>
                    )}

                    {error && (
                        <div className="form-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                        }}
                    >
                        {isSignUp
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>

            <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
          background: linear-gradient(135deg, hsl(10, 30%, 25%) 0%, hsl(20, 35%, 30%) 100%);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: var(--spacing-2xl);
          animation: slideUp var(--transition-slow);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .auth-header h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-sm);
        }

        .auth-form {
          margin-bottom: var(--spacing-lg);
        }

                .name-row {
                    display: flex;
                }

        .auth-footer {
          text-align: center;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--glass-border);
        }

        .auth-footer .btn {
          width: 100%;
        }
      `}</style>
        </div>
    );
}
