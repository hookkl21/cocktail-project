import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";
import Cocktail from "./components/Cocktail";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cocktails, setCocktails] = useState([]);

  const fetchDrinks = useCallback(async () => {
    setLoading(true);
    try {
      //since the url is looking for searchterm at the end
      //below you retrieve url then searchterm immediately
      const res = await axios(`${url}${searchTerm}`);
      const data = res.data;
      const { drinks } = data;

      if (drinks) {
        //once you fetch the data(drinks) you iterate over each element then you destructure and gave easier name
        const newCocktails = drinks.map((item) => {
          const { idDrink, strDrink, strDrinkThumb, strAlcoholic, strGlass } =
            item;
          return {
            id: idDrink,
            name: strDrink,
            image: strDrinkThumb,
            info: strAlcoholic,
            glass: strGlass,
          };
        });
        //set all of new cocktails as object into array since cocktails are array as defined
        setCocktails(newCocktails);
      } else {
        setCocktails([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [searchTerm]);

  //in this useEffect, everytime the user put any value into search bar, the browser will rerender and updates the searchTerm in fetchDrinks function we defined above
  useEffect(() => {
    fetchDrinks();
  }, [searchTerm, fetchDrinks]);

  return (
    // you must pass the variable for Provider in order for other components to recieve the data we fetched
    <AppContext.Provider
      value={{ loading, searchTerm, cocktails, setSearchTerm }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
