import { useContext } from 'react';
import Row from './Row';
import FrontContext from '../FrontContext';
// import SortBtns from '../SortBtns';
import Filter from '../Filter';
import Search from '../Search';
import ComRow from './ComRow';

function List() {
  const { comments, cities } = useContext(FrontContext);
  const comTotal = comments && comments.map(c => c.status === 1 ? c.com_count : 0).reduce((acc, total) => acc + total, 0);

  return (
    <>
      <div className='front-logo'>
        <h1 className='heading'>IMPROVING MUNICIPAL ACTIVITIES</h1>
      </div>
      <div className='flex-card front'>
        <div className='frame com'>
          <h2>
            Comments ({comTotal && comTotal})
          </h2>
          <div className="flex">
            <Filter />
            <Search />
            {/* <SortBtns /> */}
          </div>
          {comments ? comments.map((c) => <ComRow key={c.id} row={c} />) : null}
        </div>
        <div className='container flex-row main-5 line-w'>
          <h4>Image</h4>
          <h4>Title</h4>
          <h4>Address</h4>
          <h4>Email</h4>
          <h4>Activity Areas</h4>
        </div>
        {cities ? cities.map((r) => <Row key={r.id} row={r} />) : null}
      </div>
    </>
  );
}

export default List;
