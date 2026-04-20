import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('capstone_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accounts, setAccounts] = useState<any[]>(() => {
    const savedAccounts = localStorage.getItem('capstone_accounts');
    const defaults = [
      { id: '1', name: 'Store Admin', role: 'admin', email: 'admin@store.com', password: 'admin123' },
      { id: '2', name: 'Store Customer', role: 'customer', email: 'customer@store.com', password: 'customer123' }
    ];

    if (savedAccounts) {
      const parsed = JSON.parse(savedAccounts);
      const merged = [...parsed];
      defaults.forEach(def => {
        // Ensure both email and ID are unique to avoid duplicate keys in AccountManagement
        if (!merged.find(acc => acc.email === def.email || acc.id === def.id)) {
          merged.push(def);
        }
      });
      return merged;
    }
    
    localStorage.setItem('capstone_accounts', JSON.stringify(defaults));
    return defaults;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('capstone_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('capstone_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('capstone_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const login = useCallback((email: string, password: string) => {
    const foundUser = accounts.find(acc => 
      acc.email.toLowerCase() === email.toLowerCase() && 
      acc.password === password
    );
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return userWithoutPassword;
    }
    return null;
  }, [accounts]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addAccount = useCallback((newAcc: any) => {
    const accWithId = { 
      ...newAcc, 
      id: Date.now().toString(),
      email: newAcc.email.toLowerCase()
    };
    setAccounts(prev => [...prev, accWithId]);
    return accWithId;
  }, []);

  const registerCustomer = useCallback((data: any) => {
    const newAcc = {
      id: Date.now().toString(),
      name: data.fullname,
      email: data.email.toLowerCase(),
      password: data.password,
      role: 'customer'
    };
    setAccounts(prev => [...prev, newAcc]);
    const { password: _, ...userWithoutPassword } = newAcc;
    setUser(userWithoutPassword);
    return userWithoutPassword;
  }, []);

  const updateAccount = useCallback((id: string, updatedData: any) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...updatedData } : acc));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  }, []);

  const value = useMemo(() => ({
    user, 
    login, 
    logout, 
    accounts, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    registerCustomer
  }), [user, login, logout, accounts, addAccount, updateAccount, deleteAccount, registerCustomer]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
