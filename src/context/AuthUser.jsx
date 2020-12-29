import React, { useEffect, useReducer, useContext, createContext } from "react";
import { callApi } from "../utils";

const AuthContext = createContext();
const AuthDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...action.user, isAuthenticated: true };
    case "LOGOUT":
      return { isAuthenticated: false };
    default:
      throw new Error(`unknown action ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { isAuthenticated: true });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await callApi("/users/me", "GET")
      // console.log('data user', user)
      if (user.id) {
        dispatch({ type: "LOGIN", user });
        return;
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthContext.Provider value={state}>
        {children}
      </AuthContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useCurrentUser = () => useContext(AuthContext);
export const useDispatchCurrentUser = () => useContext(AuthDispatchContext);