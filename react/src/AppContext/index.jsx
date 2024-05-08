import React, {
    Context,
    createContext,
    useEffect,
    useMemo,
    useState,
  } from 'react';
  import { DEFAULT_THEME, Theme} from '../Theme/index';

  import { library } from '@fortawesome/fontawesome-svg-core';
import { faBasketball, faMusic, faBrush, faCookieBite, faMasksTheater, faCalendar, faLocationDot, faMicrophoneLines, faPeopleArrows, faFilm, faGamepad, faFaceGrinTears, faScaleUnbalancedFlip, faBook, faPersonPraying, faBriefcase, faMicrophone, faCirclePlus, faArrowLeft, faTicket} from '@fortawesome/free-solid-svg-icons';

library.add(
  faBasketball,
  faMusic,
  faBrush,
  faCookieBite,
  faMasksTheater,
  faCalendar,
  faLocationDot,
  faMicrophoneLines,
  faPeopleArrows,
  faFilm,
  faGamepad,
  faFaceGrinTears,
  faScaleUnbalancedFlip,
  faBook,
  faPersonPraying,
  faBriefcase, faMicrophone,
  faCirclePlus,
  faArrowLeft,
  faTicket
);


const APP_THEME = 'appTheme';

  export const AppContext = createContext({
    appTheme: DEFAULT_THEME,
    initializeAppTheme: () => {},
    setAppTheme: () => {},
  });
  
  export const AppContextProvider = (props) => {
    const [appTheme, setAppTheme] = useState(DEFAULT_THEME);
    const [isInit, setIsInit] = useState(true);
  
    useEffect(() => {
      setInitialLoad();
    });
  
    const setInitialLoad = async () => {
      if (isInit) {
        initializeAppTheme();
        setIsInit(false);
      }
    };
  
  
    const setTheme = (theme) => {
      setAppTheme(theme);
    //   setItemInStorage(APP_THEME, theme);
    };
  
    const initializeAppTheme = (themeType) => {
      const currentTheme = appTheme;
      if (!currentTheme && !themeType) {
        const colorScheme = Appearance.getColorScheme();
        setAppTheme(colorScheme ?? DEFAULT_THEME);
      } else {
        if (themeType) {
          setAppTheme(themeType);
          setItemInStorage(APP_THEME, themeType);
        } else {
          setAppTheme(currentTheme);
        }
      }
    };

    const value = useMemo(
      () => ({
        appTheme: Theme[appTheme],
        setAppTheme: setTheme,
        initializeAppTheme,
      }),
      [
        appTheme,
        setTheme,
        initializeAppTheme,
      ],
    );
  
    return (
      <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
  };
  