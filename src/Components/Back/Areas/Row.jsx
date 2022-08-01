import { useContext } from 'react';
import BackContext from '../BackContext';

function Row({ row }) {

  const { setDeleteArea } = useContext(BackContext);

  const handleDelete = () => {
    setDeleteArea(row);
  };
  console.log(row);
  return (
    <>
      <div className='flex-row line com'>
        <h2
          style={{
            // backgroundColor: row.hex_code,
            // color: row.hex_code === 'white' ? 'black' : 'white',
            // boxShadow: `2px 3px 20px ${row.title} `,
            // margin: '10px',
          }}
        >
          {row.title}
        </h2>
        {/* {row.id === row.sm_id ? (
          ''
        ) : ( */}
        <button type='button' className='dlt' onClick={handleDelete}>
          <svg>
            <use href='#Delete' />
          </svg>
        </button>
        {/* )} */}
      </div>
    </>
  );
}

export default Row;
