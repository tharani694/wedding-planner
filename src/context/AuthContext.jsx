import { createContext, useContext, useState, useEffect } from "react";
import { useApolloClient, useMutation, gql } from "@apollo/client";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) { token user { id name email partnerName weddingDate weddingVenue totalBudget } }
  }
`;
const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) { token user { id name email partnerName weddingDate weddingVenue totalBudget } }
  }
`;
const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) { id name email partnerName weddingDate weddingVenue totalBudget }
  }
`;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [updateProfileMutation] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginMutation({ variables: { email, password } });
    const { token, user: u } = data.login;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const { data } = await registerMutation({ variables: { name, email, password } });
    const { token, user: u } = data.register;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const updateProfile = async (input) => {
    const { data } = await updateProfileMutation({ variables: { input } });
    const updated = data.updateProfile;
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    client.clearStore();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);