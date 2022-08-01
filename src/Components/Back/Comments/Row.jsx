import { useContext } from 'react';
import BackContext from '../BackContext';
import StatusBtns from './StatusBtns';

function Row({ row }) {
  const { handleDeleteCom } = useContext(BackContext);

  return (
    <>
      <div className='frame com flex-row feedback'>
        <div className="flex-nw">
          {/* <img
            className='img-box'
            src={row.photo ? row.photo : null}
            alt='coat of arms'
          /> */}
          <div>
            <h2>
              {row.municipality}
            </h2>
            <p className='prc'>
              {row.activity}
            </p>
          </div>
        </div>
        <div className='com'>
          <h2>Comments({row.com_count})</h2>
          <ul>
            {row.coms && row.coms.slice(0, -5).split('-^-^-,').map((c, i) => <li key={i}>{c}
              <StatusBtns row={row} />
              {/* <button
                type='button'
                className='dlt'
                onClick={() =>
                  handleDeleteCom(row.coms_id.split(',')[i])}>
                <svg>
                  <use href='#Delete' />
                </svg>
              </button> */}
            </li>)}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Row;
