
import React, { useState, useEffect } from 'react';
import { getState, setSession } from '../../services/dataStore';

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Get settings from fresh state
  const appState = getState();
  const { settings } = appState;

  useEffect(() => {
    // Attempt to initialize Google SSO if configured
    if (settings.googleLoginEnabled && settings.googleClientId && (window as any).google) {
      const google = (window as any).google;
      google.accounts.id.initialize({
        client_id: settings.googleClientId,
        callback: handleGoogleResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [settings.googleLoginEnabled, settings.googleClientId]);

  const handleGoogleResponse = (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const userEmail = payload.email;

      if (settings.approvedEmails.includes(userEmail)) {
        setSession('google_sso_token_' + Date.now(), 'admin');
        onLogin();
      } else {
        setError(`Access Denied: ${userEmail} is not whitelisted.`);
      }
    } catch (err) {
      setError('Single Sign-On failed. Please contact Principal.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate against stored institutional credentials
    if (username === settings.principalUsername && password === settings.principalPassword) {
      setSession('auth_node_' + Date.now(), 'principal');
      onLogin();
    } else if (username === settings.adminUsername && password === settings.adminPassword) {
      setSession('auth_node_' + Date.now(), 'admin');
      onLogin();
    } else {
      setError('Verification failed. Incorrect identity or keyphrase.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-12 rounded-[3rem] shadow-2xl border-emerald-100 text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mx-auto mb-8">
          <i className="fa-solid fa-shield-halved text-white text-3xl"></i>
        </div>
        <h2 className="text-2xl font-black text-emerald-900 mb-2 leading-tight">Identity Access</h2>
        <p className="text-emerald-600 text-[10px] mb-10 font-black uppercase tracking-widest">Authorized Institutional Gateway</p>

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          {error && (
            <div className="text-[10px] text-red-600 font-black bg-red-50 p-4 rounded-2xl border border-red-100 mb-6 uppercase tracking-tight">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Username Handle</Label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-inner text-emerald-900 font-bold" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Security Keyphrase</Label>
            <input 
              type="password" 
              className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-inner text-emerald-900 font-bold" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 mt-8 active:scale-95 transition-all">
            Access Core Registry
          </button>
        </form>

        {settings.googleLoginEnabled && settings.googleClientId && (
          <div className="mt-10 pt-10 border-t border-emerald-50">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Institutional SSO</p>
            <div id="googleBtn" className="w-full overflow-hidden rounded-2xl transition-all hover:shadow-lg"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const Label: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">{children}</label>
);

export default LoginForm;
