import React, {
  useState,
  useEffect,
  createContext,
  FC,
  useContext,
} from 'react';

export type MediaContextType = {
  isMobile: boolean
};

const calculateIsMobile = () => window.innerWidth < 800;
export const MediaContext = createContext<MediaContextType>({ isMobile: calculateIsMobile() });

export const MediaProvider: FC = ({ children }) => {
  const [isMobile, setIsMobile] = useState(calculateIsMobile());
  useEffect(
    () => {
      const handler = () => setIsMobile(calculateIsMobile());
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    },
    [setIsMobile],
  );
  return (
    <MediaContext.Provider value={{ isMobile }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => useContext(MediaContext);
