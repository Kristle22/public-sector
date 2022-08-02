import { useContext } from 'react';
import BackContext from '../BackContext';
import StatusBtns from './StatusBtns';

function Row({ row }) {
  const { handleDeleteCom } = useContext(BackContext);

  return (
    <div className='frame com admin-5'>
      <img
        className='img-box pad'
        src={row.image ? row.image : null}
        alt='coat of arms'
      />
      <b>
        {row.municipality}
      </b>
      <u>
        {row.activity}
      </u>
      <ul className='flex'>
        <li>{row.com}</li>
      </ul>
      <StatusBtns row={row} />
    </div>
  );
}

export default Row;
