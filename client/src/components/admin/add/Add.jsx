import React from 'react';
import { GridColDef } from '@mui/x-data-grid';

type Props = {
  slug: string;
  
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const modalStyle = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.724)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalContentStyle = {
    padding: '50px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    position: 'relative',
  };

  const closeIconStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
  };

  const h1Style = {
    marginBottom: '40px',
    fontSize: '24px',
    color: '#000000', // Replace with your desired text color
  };

  const formStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '500px',
    justifyContent: 'space-between',
  };

  const itemStyle = {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  };

  const labelStyle = {
    fontSize: '14px',
  };

  const inputStyle = {
    padding: '10px',
    backgroundColor: 'transparent',
    color: 'white',
    outline: 'none',
    border: '1px solid #000000', // Replace with your desired border color
    borderRadius: '3px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    cursor: 'pointer',
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setOpen(false);
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <span style={closeIconStyle} onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1 style={h1Style}>Add new {props.slug}</h1>
        <form style={formStyle} onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div style={itemStyle} key={column.field}>
                <label style={labelStyle}>{column.headerName}</label>
                <input
  type={column.type}
  name={column.field}
  placeholder={column.field}
  style={{ ...inputStyle, color: 'black' }}
/>

              </div>
            ))}
          <button style={buttonStyle}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;



  
