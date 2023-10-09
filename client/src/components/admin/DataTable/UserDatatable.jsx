import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from "@mui/material/Box";
import { MDBIcon } from "mdb-react-ui-kit";
import './userdatatable.css'; 

import { useNavigate } from "react-router-dom"
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { toast } from "react-toastify"

// import { adminBlockUser, adminUnblockuser, fetchAdminUsers } from '../../redux/features/adminSlice';
import { adminBlockUser } from '../../../redux/features/adminSlice';
import { adminUnblockUser } from '../../../redux/features/adminSlice';
import { fetchAdminUsers } from '../../../redux/features/adminSlice';


function UserDatatable() {
  const [blockStatus, setBlockStatus] = useState(JSON.parse(localStorage.getItem('blockStatus')) || {});




  const { users } = useSelector((state) => ({ ...state.admin }));
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAdminUsers())
    const storedBlockStatus = JSON.parse(localStorage.getItem('blockStatus')) || {};
    setBlockStatus(storedBlockStatus);
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('blockStatus', JSON.stringify(blockStatus));
  }, [blockStatus]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Username',
      width: 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      editable: true,
    },
    {
      field: 'block',
      headerName: 'Block',
      width: 150,
      renderCell: (params) => {
        const user = params.row;
        console.log("userdetails", user);
        const isBlocked = blockStatus[user.email];

        const toggleBlockStatus = () => {
          const newBlockStatus = { ...blockStatus };
          newBlockStatus[user.email] = !isBlocked;
          setBlockStatus(newBlockStatus);
          console.log("blockstatus", blockStatus);
          // dispatch(Userblock({ email: user.email, navigate, toast }));
          if (isBlocked) {
            dispatch(adminBlockUser({ email: user.email, navigate, toast }));
          } else {
            dispatch(adminUnblockUser({ email: user.email, navigate, toast }));
          }
          console.log("Afterdispatchblockstatus", blockStatus);

          console.log("After blocking", user);
          localStorage.setItem('blockStatus', JSON.stringify(newBlockStatus));
        };

        return (

          <div className='action'>
            
            <button className='actionlink' onClick={toggleBlockStatus}>
            {isBlocked ? (
                <MDBIcon icon='check' className='blocked-icon' />
              ) : (
                <MDBIcon icon='ban' className='unblocked-icon' />
              )}
            </button>
          </div>
        );
      },
    },
  ];

  const mappedRows = users.map((user, index) => ({
    id: index + 1,
    name: user.firstname,
    email: user.email,
    blocked: blockStatus[user.email] || false,
  }));

  return (
    <div className='users'>
            <h5>User Management</h5>
            <Box sx={{ height: 400, width: "100%" }}>
       
          <DataGrid
            className='dataGrid'
            rows={mappedRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                    pageSize: 9,
                },
            },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnFilter
            disableDensitySelector
            disableColumnSelector
          />
           </Box>
        </div>
     
    
  );
}

export default UserDatatable;