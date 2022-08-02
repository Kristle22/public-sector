import { useContext, useState, useRef } from 'react';
import BackContext from '../BackContext';
import getBase64 from '../../../Functions/getBase64';

function Create() {
  const { setCreateArea, showMessage } = useContext(BackContext);

  const [title, setTitle] = useState('');

  const fileInput = useRef();
  const [image, setImage] = useState(null);

  const showImage = () => {
    getBase64(fileInput.current.files[0])
      .then((photo) => setImage(photo))
      .catch((_) => {
        showMessage({ text: 'failo pasirinkimas atsauktas!', type: 'danger' });
      });
  };

  const handleCreate = () => {
    const data = { title, photo: image };
    setCreateArea(data);
    setTitle('');
    setImage(null);
    fileInput.current.value = null;
  };
  return (
    <>
      <div className='form-container'>
        {image ? (
          <div className='fix'>
            <img
              src={image}
              alt='activity'
            />
          </div>
        ) : null}
        <div className='form color'>
          <h3>Create Activity Area</h3>
          <form>
            <label>Title</label>
            <input
              className='color'
              type='text'
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
              placeholder='place here...'
            />
            <div>
              <label>Activity Icon</label>
              <input ref={fileInput} type='file' onChange={showImage} />
              <small style={{ fontSize: '12px', float: 'left' }}>
                Upload Photo.
              </small>
            </div>
            <button type='button' className='put' onClick={handleCreate}>
              <svg className='put'>
                <use href='#Add' />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Create;
