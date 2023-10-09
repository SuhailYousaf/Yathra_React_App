import React from 'react';
import { DataGrid, GridValueGetterParams, GridColDef , GridToolbar } from '@mui/x-data-grid'; // Import necessary components
import { Link } from 'react-router-dom';

import './DataTable.css';

type Props={
  columns:GridColDef[],
  rows:Object[],
  slug:string
}

const DataTable = (props: Props) => {
  const handleDelete = (id: number) => {
    console.log(id + " has been deleted");
    // Your deletion logic here
  };

  // const actionColumn: GridColDef = {
  //   field: 'action',
  //   headerName: 'Action',
  //   width: 200,
  //   renderCell: (params) => {
  //     return (
  //       <div className='action'>
  //         <Link to={`/${props.slug}/${params.row.id}`}>
  //           <img src="/view.svg" alt="" />
  //         </Link>
  //         <div className='delete' onClick={() => handleDelete(params.row.id)}>
  //           <img src="/delete.svg" alt="" />
  //         </div>
  //       </div>
  //     );
  //   },
  // };

  

  return (
    <div className='dataTable'>
      <DataGrid
      className='dataGrid'
        rows={props.rows}
        columns={[...props.columns]}
        pageSize={5}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
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
    </div>
  );
};

export default DataTable;
