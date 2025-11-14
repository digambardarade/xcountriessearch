import { useEffect, useState, useCallback } from "react";
import "./XCountriesSearch.css";

export default function XCountriesSearch() {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    fetch("https://countries-search-data-prod-812920491762.asia-south1.run.app/countries")
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

  const cardStyle = {
    width: "200px",
    height: "200px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    margin: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const imageStyle = {
    width: "100px",
    height: "100px",
  };

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    height: "100vh",
    marginTop: "30px",
  };

  const searchBoxContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
  };

  const searchBox = {
    width: "800px",
    height: "30px",
  };

  return (
    <div>
      <div style={{ backgroundColor: "rgba(0,0,0,0.1)" }}>
        <form
          style={searchBoxContainer}
          onSubmit={(e) => {
            e.preventDefault();
            searchCountries();
          }}
        >
          <input
            style={searchBox}
            type="text"
            value={searchText}
            onChange={(e) => handleSearch(e)}
            placeholder="Search for countries..."
          />
        </form>
      </div>
      <div style={containerStyle}>
        {searchData.length === 0 ? (
          <div>No countries found.</div>
        ) : (
          searchData.map((country) => (
            <div key={country.name} style={cardStyle} className="countryCard">
              <img
                src={country.flag}
                alt={`Flag of ${country.name}`}
                style={imageStyle}
              />
              <h2>{country.name}</h2>
            </div>
          ))
        )}
      </div>
    </div>
  );
}