import { useContext } from 'react';
import Row from './Row';
import BackContext from '../BackContext';
// import SortBtns from '../SortBtns';
// import Filter from '../Filter';
// import Search from '../Search';

function List() {
  const { cities } = useContext(BackContext);

  return (
    <>
      <div className='heading'>
        <h2>List of Municipalities</h2>
      </div>
      <div className='flex-card'>
        <div className='user-4 line-w'>
          <h4>Coat of Arms</h4>
          <h4>Title</h4>
          <h4>Address</h4>
          <h4>Email</h4>
          {/* <Filter /> */}
          {/* <Search /> */}
          {/* <SortBtns /> */}
        </div>
        {cities ? cities.map((r) => <Row key={r.id} row={r} />) : null}
      </div>
    </>
  );
}

export default List;
