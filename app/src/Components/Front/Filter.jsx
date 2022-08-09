import { useContext, useState } from 'react';
import FrontContext from './FrontContext';

function Filter() {
  const { setFilter, areas, selectArea, setSelectArea } = useContext(FrontContext);

  const filtering = (e) => {
    setSelectArea(e.target.value);
    setFilter(Number(e.target.value));
  };

  return (
    <>
      <select
        className='sorting'
        value={selectArea}
        onChange={filtering}
        style={{ maxWidth: '160px' }}
      >
        <option value='0'>Filter by Area</option>
        {areas &&
          areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
      </select>
    </>
  );
}

export default Filter;
