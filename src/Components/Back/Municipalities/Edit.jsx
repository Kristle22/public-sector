import { useState, useEffect, useContext } from 'react';
import BackContext from '../BackContext';
import { useRef } from 'react';
import getBase64 from '../../../Functions/getBase64';

function Edit() {
  const {
    modalData,
    setModalData,
    setEditData,
    second,
    showMessage,
    setDeletePhoto,
  } = useContext(BackContext);

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  const fileInput = useRef();
  const [image, setImage] = useState(null);

  // console.log(modalData);

  const showImage = () => {
    getBase64(fileInput.current.files[0])
      .then((photo) => setImage(photo))
      .catch((_) => {
        showMessage({ text: 'failo pasirinkimas atsauktas!', type: 'danger' });
      });
  };

  const handleDeletePhoto = () => {
    setDeletePhoto({ id: modalData.id });
    setModalData((p) => ({ ...p, photo: null }));
  };

  useEffect(() => {
    if (null === modalData) {
      return;
    }
    setTitle(modalData.title)
    setAddress(modalData.address);
    setEmail(modalData.email);
    setImage(modalData.photo);
  }, [modalData]);

  const handleEdit = () => {
    const data = {
      id: modalData.id,
      title,
      address,
      email,
      photo: image,
    };
    setEditData(data);
    console.log(data);
    setModalData(null);
  };
  if (null === modalData) {
    return null;
  }

  return (
    <>
      <div className='modal-layer'>
        <div className='modal-cont'>
          <div className='modal'>
            <div className='left-side'>
              <button
                type='button'
                className='close-x'
                onClick={() => setModalData(null)}
              >
                &times;
              </button>
              <button
                type='button'
                onClick={handleDeletePhoto}
                style={{
                  backgroundColor: 'crimson',
                  color: '#fff',
                  padding: '3px 7px',
                  marginBottom: '5px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  float: 'right',
                }}
              >
                Remove Photo
              </button>
              {
                <div style={{ width: '100%' }}>
                  <img
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '5px',
                    }}
                    src={image ? image : null}
                    alt='new outfit'
                  />
                </div>
              }
            </div>
            <div className='right-side form'>
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
                  <label>Change Photo</label>
                  <input ref={fileInput} type='file' onChange={showImage} />
                  <small style={{ fontSize: '12px', float: 'left' }}>
                    Upload Photo.
                  </small>
                </div>
                <div className='btns-modal'>
                  <button
                    type='button'
                    className='close'
                    onClick={() => setModalData(null)}
                  >
                    <svg>
                      <use href='#Exit' />
                    </svg>
                  </button>
                  <button type='button' className='put' onClick={handleEdit}>
                    <svg className='put'>
                      <use href='#Save' />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default Edit;
