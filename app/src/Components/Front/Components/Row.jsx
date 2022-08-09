import { useContext, useState } from 'react';
import FrontContext from '../FrontContext';
import Comment from './Comment';
// import Rating from './Rating';

function Row({ row }) {
  const {
    areas, selectArea, setSelectArea
  } = useContext(FrontContext,);

  // const [selectArea, setSelectArea] = useState(0);
  // console.log(row, selectArea);
  return (
    <>
      <div className='flex-row main-5 com line'>
        <div>
          <img
            className='img-box'
            src={row.photo}
            alt='coat of arms'
          />
        </div>
        <p className='heading-sm'>{row.title}</p>
        <p>{row.address}</p>
        <p>{row.email}</p>
        <select onChange={e => setSelectArea(e.target.value)}>
          <option value='0'>Select area of activities</option>
          {areas && areas.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </div>
      {/* <div className="flex"> */}
      <Comment row={row} />
      {/* <Rating row={row} /> */}
      {/* </div> */}
    </>
  );
}

export default Row;
