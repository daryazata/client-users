import { useRef, useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import dotenv from 'dotenv';

dotenv.config();

function App() {
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);

  const selectRef = useRef(null);

  const host =
    process.env.NODE_ENV === 'development'
      ? 'localhost'
      : 'damp-ocean-06468.herokuapp.com';
  const port = process.env.PORT || 8080;

  const fetchData = () => {
    axios
      .get(`http://${host}:${port}/api/users`)
      .then(function (response) {
        const fetchedData = response.data.data.users.results;
        setUsers(fetchedData);
        setFilteredUsers([]);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
    selectRef.current.focus();
  }, []);

  useEffect(() => {
    setCountries(formatCountries());
  }, [users]);

  const displaySelect = () => {
    return (
      <Select
        placeholder='Select country...'
        styles={{ margin: 10, padding: 10 }}
        ref={selectRef}
        isMulti
        onChange={onSelectHandler}
        options={countries}
      />
    );
  };

  const onSelectHandler = (valuesArr) => {
    filterUsersByCountries(users, valuesArr);
  };

  const filterUsersByCountries = (users, countriesArr) => {
    let resultUsers = [];
    countriesArr.forEach((countryObj) => {
      const filterUsers = (user) => user.location.country === countryObj.value;
      const filterResultArr = users.filter(filterUsers);
      filterResultArr.forEach((user) => {
        resultUsers.push(user);
      });
    });
    setFilteredUsers(resultUsers);
  };

  const formatCountries = () => {
    const duplicateCountries = users.map((user) => {
      return user.location.country;
    });

    const uniqueCountries = [...new Set(duplicateCountries)];

    const result = uniqueCountries.map((country) => {
      return { value: country, label: country };
    });
    return result;
  };

  const displayUsers = () => {
    const usersMap = filteredUsers.length === 0 ? users : filteredUsers;
    return usersMap.map((user, index) => {
      return (
        <div className='user-list-container' key={index}>
          <div className='user-list-name'>{`${user.name.first} ${user.name.last}`}</div>
          <div className='user-list-details'>{`${user.gender}`}</div>
          <div className='user-list-details'>{` ${user.email}`}</div>

          <div className='user-list-details user-list-country'>
            {user.location.country}
          </div>
          <br />
        </div>
      );
    });
  };

  return (
    <div className='App'>
      <h2 className='app-title'>Users Coutries Filter App</h2>
      <div>{displaySelect()}</div>
      <button className='button-refetch' onClick={() => fetchData()}>
        Refetch Data
      </button>
      <div>{displayUsers()}</div>
    </div>
  );
}

export default App;
