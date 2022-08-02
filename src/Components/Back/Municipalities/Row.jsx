import { useContext } from 'react';
import BackContext from '../BackContext';

function Row({ row }) {
  const { setDeleteData, setModalData } = useContext(BackContext);
  const handleDelete = () => {
    setDeleteData(row);
  };
  const handleModal = () => {
    setModalData(row);
  };

  return (
    <>
      <div className='user-4 frame list'>
        <img className='img-box'
          src={row.photo}
          alt='coat of arms'
        />
        <p>{row.title}</p>
        <p>{row.address}</p>
        <p>{row.email}</p>
      </div>
      <div className='btns row'>
        <button type='button' className='edt' onClick={handleModal}>
          <svg>
            <use href='#Edit' />
          </svg>
        </button>
        <button type='button' className='dlt' onClick={handleDelete}>
          <svg>
            <use href='#Delete' />
          </svg>
        </button>
      </div>
    </>
  );
}

export default Row;

// {JSON.stringify(new Date(kolt.lastUsed))
//   .slice(1, -6)
//   .replace('T', ' ')}
