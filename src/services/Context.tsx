import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the user data
interface User {
  dogName: string;
  userName: string;
  dogColor: string;
  dogWeight: string;
  dogRace: string;
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
      dogName: data.DOG_NAME,
      userName: data.USER_NAME,
      dogColor: data.D_COLOR,
      dogWeight: data.D_WEIGHT,
      dogRace: data.D_RACE,
      userIcon: data.USER_ICON,
      lastLocationLat: data.LAST_LOCAT_LAT,
      lastLocationLong: data.LAST_LOCAT_LONG,
      dogSize: data.D_SIZE,
      dogAge: data.D_AGE,
      dogPersonality: data.D_PERSONALITY,
      dogHobbies: data.D_HOBBIES
    });
  };

  const clearUser = () => {
    setUser({
      dogName: '',
      userName: '',
      dogColor: '',
      dogWeight: '',
      dogRace: '',
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
