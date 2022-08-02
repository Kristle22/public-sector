import { useEffect, useState, useReducer } from 'react';
import cityReducer from './Reducer';
import BackContext from './BackContext';
import Nav from './Nav';
import MunicipalitiesCrud from './Municipalities/Crud'
import AreasCrud from './Areas/Crud';
import CommentsCrud from './Comments/Crud';
import axios from 'axios';
import { authConfig } from '../../Functions/auth';

function Back({ show }) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [message, setMessage] = useState(null);

  const [createData, setCreateData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const [cities, dispachCities] = useReducer(cityReducer, []);

  const [areas, setAreas] = useState(null);
  const [createArea, setCreateArea] = useState(null);
  const [deleteArea, setDeleteArea] = useState(null);

  const [status, setStatus] = useState(0);

  const [sort, setSort] = useState('0');
  const [filter, setFilter] = useState(0);
  const [search, setSearch] = useState('');

  // Optional state
  const [deletePhoto, setDeletePhoto] = useState(null);
  const [comments, setComments] = useState(null);
  const [deleteCom, setDeleteCom] = useState(null);

  const sorting = (e) => {
    const sortOrder = e.target.value;
    setSort(sortOrder);
    const action = {
      type: sortOrder,
    };
    dispachCities(action);
  };

  const showMessage = (mes) => {
    setMessage(mes);
    setTimeout(() => setMessage(null), 5000);
  };
  // ///////////AXIOS CITIES GET/CREATE/DELETE/UPDATE DATA///////////
  // READ
  useEffect(() => {
    let query;
    if (filter === 0 && !search) {
      query = '';
    } else if (filter) {
      query = 'sm-id=' + filter;
    } else if (search) {
      query = '?s=' + search;
    }

    axios
      .get('http://localhost:3003/miestai' + query, authConfig())
      .then((res) => {
        const action = {
          type: 'main_list',
          payload: res.data,
        };
        dispachCities(action);
      });
  }, [lastUpdate, filter, search]);

  // CREATE
  useEffect(() => {
    if (null === createData) return;
    axios
      .post('http://localhost:3003/miestai', createData, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [createData]);

  // DELETE
  useEffect(() => {
    if (null === deleteData) return;
    axios
      .delete('http://localhost:3003/miestai/' + deleteData.id, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [deleteData]);

  // DELETE AREAS
  useEffect(() => {
    if (null === deleteArea) return;
    axios
      .delete('http://localhost:3003/sritys/' + deleteArea.id, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [deleteArea]);

  // EDIT
  useEffect(() => {
    if (null === editData) return;
    axios
      .put('http://localhost:3003/miestai/' + editData.id, editData, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [editData]);

  // /////////////AXIOS AREAS//////////////
  // Read
  useEffect(() => {
    axios.get('http://localhost:3003/sritys', authConfig()).then((res) => {
      setAreas(res.data);
    });
  }, [lastUpdate]);

  // Create
  useEffect(() => {
    if (null === createArea) return;
    axios
      .post('http://localhost:3003/sritys', createArea, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [createArea]);

  /////////////////////////COMMENTS/PHOTO/STATUS//////////////////////////////
  // READ COMMENTS
  useEffect(() => {
    axios.get('http://localhost:3003/komentarai', authConfig()).then((res) => {
      setComments(res.data);
    });
  }, [lastUpdate]);

  // // DELETE COMMENT
  // const handleDeleteCom = (id) => {
  //   axios
  //     .delete('http://localhost:3003/komentarai/' + id, authConfig())
  //     .then((res) => {
  //       showMessage(res.data.msg);
  //       setLastUpdate(Date.now());
  //     });
  // };

  // DELETE COMMENT
  useEffect(() => {
    if (null === deleteCom) return;
    axios
      .delete('http://localhost:3003/komentarai/' + deleteCom.id, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [deleteCom]);

  // Delete Photo
  useEffect(() => {
    if (null === deletePhoto) return;
    axios
      .delete('http://localhost:3003/nuotrauka/' + deletePhoto.id, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [deletePhoto]);

  // Edit STATUS
  useEffect(() => {
    if (null === status) return;
    axios
      .put('http://localhost:3003/statusas/' + status.id, status, authConfig())
      .then((res) => {
        showMessage(res.data.msg);
        setLastUpdate(Date.now());
      });
  }, [status]);

  return (
    <BackContext.Provider
      value={{
        cities,
        setCreateData,
        setDeleteData,
        modalData,
        setModalData,
        setEditData,
        areas,
        setCreateArea,
        setDeleteArea,
        sort,
        sorting,
        filter,
        setFilter,
        setSearch,
        message,
        setDeletePhoto,
        setStatus,
        // handleDeleteCom,
        setDeleteCom,
        comments,
      }}
    >
      {show === 'admin' ? (
        <>
          <Nav />
          <div className='admin'>
            <div className='center'>
              <img
                src={require('../../img/admin-1.png')}
                alt='admin panel'
                style={{
                  maxWidth: '350px',
                  opacity: '0.5'
                }}
              />
            </div>
          </div>
        </>
      ) : show === 'municipalities' ? (
        <MunicipalitiesCrud />
      ) : show === 'areas' ? (
        <AreasCrud />
      ) : show === 'comments' ? (
        <CommentsCrud />
      ) : null}
    </BackContext.Provider>
  );
}

export default Back;
