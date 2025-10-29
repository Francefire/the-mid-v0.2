import { account } from "@/lib/appwrite";
import { profile } from "@/lib/functions/profile";
import { ID } from "appwrite";
import React, { createContext, useContext, useEffect, useState } from "react";

export const Auth = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    account
      .get()
      .then((response) => {
        setUser(response); // Set the user state with the response
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
        setIsLoading(false);
      });
  }, []);

  const login = async (name, pass) => {
    //await account.createEmailPasswordSession
    try {
      const response = await account.createEmailPasswordSession(name, pass);
      setUser(response);
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };
  const logout = () => {
    account.deleteSession("current");
    //await account.deleteSession
    setUser(null);
  };

  const register = async (userInfos) => {
    const id = ID.unique();
    const response = await account.create({
      userId: id,
      email: userInfos.email,
      password: userInfos.password,
      name: userInfos.firstName + " " + userInfos.lastName,
    });
    if (response) {
      login(userInfos.email, userInfos.password).then(() => {
        profile.createProfile({ id: id, ...userInfos });
      });
    }
  };

  const contextValues = {
    user,
    login,
    logout,
    register,
  };

  return (
    <Auth.Provider value={contextValues}>
      {isLoading ? <div>Loading...</div> : children}
    </Auth.Provider>
  );
};

export const useAuth = () => useContext(Auth);
