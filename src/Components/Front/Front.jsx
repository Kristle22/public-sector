import { useEffect, useState, useReducer } from 'react';
import cityReducer from './Reducer';
import FrontContext from './FrontContext';
// import Nav from './Nav';
import Crud from './Components/Crud';
import axios from 'axios';
import { authConfig } from '../../Functions/auth';

function Front({ show }) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [message, setMessage] = useState(null);

  const [cities, dispachCities] = useReducer(cityReducer, []);
  const [areas, setAreas] = useState(null);

  const [sort, setSort] = useState(0);
  const [filter, setFilter] = useState(0);
  const [search, setSearch] = useState('');

  const [comments, setComments] = useState(null);
  const [createCom, setCreateCom] = useState(null);

  const [selectArea, setSelectArea] = useState(0);
  // const [createRates, setCreateRates] = useState(null);

  // const [users, setUsers] = useState(null);

  const showMessage = (mes) => {
    setMessage(mes);
    setTimeout(() => setMessage(null), 5000);
  };

  const sorting = (e) => {
    const sortOrder = e.target.value;
    setSort(sortOrder);
    const action = {
      type: sortOrder,
    };
    dispachCities(action);
  };

  // Read & queries FRONT
  useEffect(() => {
    // let query;
    // if (filter === 0 && !search) {
    //   query = '';
    // } else if (filter) {
    //   query = 'area-id=' + filter;
    // } else if (search) {
    //   query = '?s=' + search;
    // }

    axios
      .get('http://localhost:3003/miestai', authConfig())
      .then((res) => {
        const action = {
          type: 'main_list',
          payload: res.data,
        };
        dispachCities(action);
      });
  }, [lastUpdate]);

  // Read Areas
  useEffect(() => {
    axios.get('http://localhost:3003/sritys', authConfig()).then((res) => {
      setAreas(res.data);
    });
  }, [lastUpdate]);

  // READ COMMENTS
  useEffect(() => {
    let query;
    if (filter === 0 && !search) {
      query = '';
    } else if (filter) {
      query = '?area-id=' + filter;
    } else if (search) {
      query = '?s=' + search;
    }
    axios.get('http://localhost:3003/komentarai' + query, authConfig()).then((res) => {
      setComments(res.data);
    });
  }, [lastUpdate, filter, search]);


  // CREATE Comments
  useEffect(() => {
    if (null === createCom) return;
    axios
      .post(
        'http://localhost:3003/komentarai',
        createCom,
        authConfig()
      )
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [createCom]);

  // // CREATE RATING
  // useEffect(() => {
  //   if (null === createRates) return;
  //   axios
  //     .put(
  //       'http://localhost:3003/reitingai/' + createRates.id,
  //       createRates,
  //       authConfig()
  //     )
  //     .then((res) => {
  //       showMessage(res.data.msg);
  //       setLastUpdate(Date.now());
  //     });
  // }, [createRates]);

  // ////////////////////GET USER//////////////////////
  // function getUser() {
  //   return localStorage.getItem('username');
  // }

  // function userId() {
  //   const userId = users.filter((user) => user.name === getUser())[0].id;
  //   return userId;
  // }
  // console.log(getUser(), userId());

  return (
    <FrontContext.Provider
      value={{
        cities,
        areas,
        comments,
        dispachCities,
        message,
        showMessage,
        setFilter,
        setSearch,
        sorting,
        setCreateCom,
        selectArea,
        setSelectArea,
        // setCreateRates,
      }}
    >
      {show === 'welcome' ? (
        <Crud />
      ) : null}
    </FrontContext.Provider>
  );
}

export default Front;
