import { useEffect, useState, useCallback } from "react";
import "./XCountriesSearch.css";

export default function XCountriesSearch() {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    fetch("https://xcountries-backend.labs.crio.do/all")
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setCountries(data);
        setSearchData(data);
      })
      .catch((err) => {
        console.error("Error fetching data from API, using mock data: ", err);
        fetch("/mock-countries.json")
          .then((res) => res.json())
          .then((data) => {
            setCountries(data);
            setSearchData(data);
          })
          .catch((err) => console.error("Error fetching mock data: ", err));
      });
  }, []);

  const searchCountries = useCallback(() => {
    if (searchText === "") {
      setSearchData(countries);
      return;
    }

    const filteredData = countries.filter((country) =>
      country.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchData(filteredData);
  }, [searchText, countries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCountries();
    }, 300); // Adjust the debounce delay as needed

    return () => clearTimeout(timer);
  }, [searchText, searchCountries]);

  function handleSearch(e) {
    setSearchText(e.target.value);
  }



  return (
    <div>
      <div className="search-bar-bg">
        <form
          className="search-box-container"
          onSubmit={(e) => {
            e.preventDefault();
            searchCountries();
          }}
        >
          <input
            className="search-box"
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e)}
            placeholder="Search for countries..."
          />
        </form>
      </div>
      <div className="countries-container">
        {searchData.length === 0 ? (
          <div>No countries found.</div>
        ) : (
          searchData.map((country) => (
            <div key={country.name} className="countryCard">
              <img
                src={country.flag}
                alt={`Flag of ${country.name}`}
                className="country-flag"
              />
              <h2>{country.name}</h2>
            </div>
          ))
        )}
      </div>
    </div>
  );
}