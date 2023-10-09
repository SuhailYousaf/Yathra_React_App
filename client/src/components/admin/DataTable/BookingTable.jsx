import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns'
import { adminBooking, adminBookingstatus } from "../../../redux/features/adminSlice";
import './BookingTabel.css'; // Check the casing and path for your BookingTable.css file
import { toast } from "react-toastify"

export default function BookingDatatable() {
    const dispatch = useDispatch();
    const { bookings,error,admin } = useSelector((state) => ({ ...state.admin }));


    useEffect(() => {
        if (!admin) {
          toast.error('Admin not logged in'); // Show toast message for not logged in
      } else {
          dispatch(adminBooking());
      }
      }, [ admin]);


   

    function makeRequest(id, status) {
        dispatch(adminBookingstatus({ id, status }));
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'title', headerName: 'Title', width: 100 },
        { field: 'guestno', headerName: 'Guest No', width: 80 },
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'orderstatus', headerName: 'Payment Status', width: 100 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'total', headerName: 'Price', width: 100 },
        { field: 'deliverystatus', headerName: 'Status', width: 100 },
        {
            field: "status",
            headerName: "Update Status",
            width: 150,
            renderCell: (params) => {
                return (
                    <select
                        value=" "
                        onChange={(e) => {
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'status',
                                value: e.target.value,
                            });
                            makeRequest(params.row.keyid, e.target.value)
                        }}
                    >
                        <option value=" " disabled>
                            Select
                        </option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Success">Success</option>
                    </select>
                );
            },
        },
        { field: 'reason', headerName: 'Reason', width: 130 },
    ];

    const mappedRows = bookings.map((booking, index) => ({
        id: index + 1,
        keyid: booking._id,
        date: format(new Date(booking.bookin), 'yyyy-MM-dd'),
        title: booking.place.title,
        guestno: booking.guestno,
        name: booking.name,
        orderstatus: booking.orderstatus,
        total: booking.total,
        deliverystatus: booking.deliverystatus,
        reason: booking.reason,
    }));

    return (
        <div className="admin-panel">
                <h5>Order Management</h5>
                <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid
                        className="dataGrid"
                        rows={mappedRows}
                        columns={columns}
                        pageSize={5}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        checkboxSelection
                        disableColumnFilter
                        disableDensitySelector
                        disableColumnSelector
                    />
                </Box>
            
        </div>
    );
}
