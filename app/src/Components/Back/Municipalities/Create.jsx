import { useRef } from 'react';
import { useContext, useState } from 'react';
import BackContext from '../BackContext';
import getBase64 from '../../../Functions/getBase64';

function Create() {
  const { setCreateData, showMessage } = useContext(BackContext);

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

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
    const data = {
      title,
      address,
      email,
      photo: image,
    };
    setCreateData(data);
    setTitle('');
    setAddress('');
    setEmail('');
    setImage(null);
    fileInput.current.value = null;
  };

  return (
    <>
      <div
        className='form-container'
        style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
      >
        <div className='imghere'></div>
        {image ? (
          <div
            style={{
              width: '50%',
              margin: '10px 20px',
            }}
          >
            <img
              style={{
                width: '100%',
                maxHeight: '450px',
                borderRadius: '5px',
                objectFit: 'contain',
              }}
              src={image}
              alt='item'
            />
          </div>
        ) : null}
        <div className='form create'>
          <h3>Create Municipality</h3>
          <form>
            <label>Title:</label>
            <input
              className='create'
              type='text'
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
              placeholder='Enter title of Municipality...'
            />
            <label>Address:</label>
            <input
              className='create'
              type='text'
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              value={address}
              placeholder='Enter address...'
            />
            <label>Email:</label>
            <input
              className='create'
              type='text'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder='enter email'
            />
            <div>
              <label>Coat of Arms</label>
              <input ref={fileInput} type='file' onChange={showImage} />
              <small style={{ fontSize: '12px', float: 'left' }}>
                Upload Photo.
              </small>
            </div>
            <div className='btns add'>
              <button type='button' className='put' onClick={handleCreate}>
                <svg>
                  <use href='#Add' />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Create;
