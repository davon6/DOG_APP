import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the user data
interface User {
  dogName: string;
  userName: string;
  dogColor: string;
  dogWeight: string;
  dogRace: string;
  dogSex : number;
  userIcon: string | null;
  lastLocationLat: number | null;
  lastLocationLong: number | null;
  dogSize: string;
  dogAge: string;
  dogPersonality: string;
  dogHobbies: string;
}

// Define the context type
interface UserContextType {
  user: User;
  updateUser: (data: any) => void;
  clearUser: () => void;
}

// Create UserContext with a default value of undefined
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the UserProvider props type
interface UserProviderProps {
  children: ReactNode;
}

// Create UserProvider component
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>({
    dogName: '',
    userName: '',
    dogColor: '',
    dogWeight: '',
    dogRace: '',
    dogSex : '',
    userIcon: null,
    lastLocationLat: null,
    lastLocationLong: null,
    dogSize: '',
    dogAge: '',
    dogPersonality: '',
    dogHobbies: ''
  });

  const updateUser = (data: any) => {


    setUser({
      dogName: data.dogName,
      userName: data.userName,
      dogColor: data.dogColor,
      dogWeight: data.dogWeight,
      dogRace: data.dogRace,
      userIcon: data.userIcon,
      lastLocationLat: data.lastLocationLat,
      lastLocationLong: data.lastLocationLong,
      dogSize: data.dogSize,
      dogSex : data.dogSex,
      dogAge: data.dogAge,
      dogPersonality: data.dogPersonality,
      dogHobbies: data.dogHobbies
    });
  };

  const clearUser = () => {
    setUser({
      dogName: '',
      userName: '',
      dogColor: '',
      dogWeight: '',
      dogRace: '',
      dogSex : '',
      userIcon: null,
      lastLocationLat: null,
      lastLocationLong: null,
      dogSize: '',
      dogAge: '',
      dogPersonality: '',
      dogHobbies: ''
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
