import { useContext } from "react";
import BackContext from "../BackContext";

function StatusBtns({ row }) {

  const { setDeleteCom, setStatus } = useContext(BackContext);


  const handleConfirm = () => {
    setStatus({ id: row.id });
    console.log(row);
  };

  const handleDelete = () => {
    setDeleteCom({ id: row.id });
  };

  return (
    <>
      <div className='btns order'>
        {row.status === 1 ? (
          <button type='button' className='edt book' onClick={handleConfirm}>
            CON-FIRMED
          </button>
        ) : (
          <button type='button' className='edt book pending' onClick={handleConfirm}>
            NOT CONFIR-MED
          </button>
        )}
        <button type='button' className='dlt book' onClick={handleDelete}>
          REM-OVE
        </button>
      </div>
    </>
  )

}

export default StatusBtns;