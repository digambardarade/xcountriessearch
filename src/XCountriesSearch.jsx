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
        console.log(data);
        setCountries(data);
        setSearchData(data);
      })
      .catch((err) => {
        console.error("Error fetching data from API: ", err);
      });
  }, []);

  const searchCountries = useCallback(() => {
    const trimmed = searchText.trim().toLowerCase();
    if (trimmed === "") {
      setSearchData(countries);
      return;
    }
    const filteredData = countries.filter((country) =>
      country.name.trim().toLowerCase().includes(trimmed)
    );
    setSearchData(filteredData);
  }, [searchText, countries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCountries();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, searchCountries]);

  function handleSearch(e) {
    setSearchText(e.target.value);
  }

  // Helper to generate a unique key for each country
  function getCountryKey(country, idx) {
    // Prefer a unique code if available, else fallback to name+index
    return country.code || country.cca3 || country.name + '-' + idx;
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
            onChange={handleSearch}
            placeholder="Search for countries..."
          />
        </form>
      </div>
      <div className="countries-container">
        {searchData.length === 0 ? (
          <div>No countries found.</div>
        ) : (
          searchData.map((country, idx) => (
            <div key={getCountryKey(country, idx)} className="countryCard">
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