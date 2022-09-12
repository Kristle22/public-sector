import Row from './Row';
import { useContext } from 'react';
import BackContext from '../BackContext';

function List() {
  const { areas } = useContext(BackContext);
  return (
    <>
      <div
        className='flex-card'
        style={{
          maxWidth: '700px',
          minWidth: '300px',
          margin: '10px  0 0 50px ',
        }}
      >
        <div className='heading' style={{ margin: '30px 0 0 0' }}>
          <h2>List of Activity Areas</h2>
        </div>
        <ul className='frame flex-row'>
          {areas
            ? areas.map((c) => <Row key={c.id} row={c} />)
            : null}
        </ul>
      </div>
    </>
  );
}

export default List;
