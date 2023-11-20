import React, { useState } from 'react';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import styles from '../styles/App.module.css';

import { BasicModal } from '../components/modal';
import { Alert, AlertColor, Checkbox, Snackbar, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

export type State = {
  title: string,
  description: string,
  deadline: Dayjs,
  priority: string,
  isChecked: boolean,
};

export default function Home() {
  const [rows, setRows] = useState<State[]>([]);
  const [create, setCreate] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<State | undefined>(undefined);

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const onOpen = () => {
    setCreate(true);
    setOpen(true);
  }

  const onEdit = (i: number) => {
    setEditing({
      title: rows[i].title,
      description: rows[i].description,
      deadline: rows[i].deadline,
      priority: rows[i].priority,
      isChecked: rows[i].isChecked
    });

    setCreate(false);
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
    setEditing(undefined);
  }

  const edit = (s: State) => {
    setRows(
      rows.map((v) => {
        if (v.title === s.title) {
          return s;
        } else {
          return v;
        }
      })
    )

    setSnackbar({ open: true, message: 'The task has been edited successfully!' })
  }

  const add = (s: State) => {
    setRows([...rows, s])

    setSnackbar({ open: true, message: 'The task has been added successfully!' })
  }

  const validateTitle = (s: string): boolean => {
    return rows.findIndex((e) => e.title === s) === -1;
  }

  const snackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({ ...snackbar, open: false });
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card className={styles.card}>
          <CardHeader
            title={<Typography variant='h5'><FontAwesomeIcon icon={faBars} />&nbsp;FRAMEWORKS</Typography>}
            className={styles.frameworks}
            action={
              <Button variant="contained" onClick={onOpen}><AddCircleOutlinedIcon fontSize="small" />&nbsp; ADD</Button>
            }
          />
          <CardContent>
            <TableContainer component={Paper} className={styles.table}>
              <Table aria-label="Simple Table">
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tableHeader} align="center">Title</TableCell>
                    <TableCell className={styles.tableHeader} align="center">Description</TableCell>
                    <TableCell className={styles.tableHeader} align="center">Deadline</TableCell>
                    <TableCell className={styles.tableHeader} align="center">Priority</TableCell>
                    <TableCell className={styles.tableHeader} align="center">Is Complete</TableCell>
                    <TableCell className={styles.tableHeader} align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={row.title}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      hover={true}
                    >
                      <TableCell align="center">{row.title}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{row.deadline.format('MM/DD/YYYY')}</TableCell>
                      <TableCell align="center">{row.priority}</TableCell>
                      <TableCell align="center"><Checkbox onChange={(_, checked) => {
                        const next = [...rows];
                        next[i].isChecked = checked;
                        setRows(next);
                      }} /></TableCell>
                      <TableCell align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={styles.buttons}>
                          {!row.isChecked ? <Button variant="contained" onClick={() => onEdit(i)}><FontAwesomeIcon icon={faPenToSquare} />Update</Button> : null}
                          <Button variant="contained" onClick={() => {
                            setRows(
                              rows.filter((v) => v.title !== row.title)
                            );

                            setSnackbar({ open: true, message: 'The task has been deleted successfully!' })
                          }} color="error"><FontAwesomeIcon icon={faCircleXmark} /> Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        {open ? <BasicModal vals={editing} onClose={onClose} isCreate={create} onAdd={add} onEdit={edit} validateTitle={validateTitle} /> : null}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={snackClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={snackClose} severity='success'>{snackbar.message}</Alert>
        </Snackbar>
      </LocalizationProvider>
    </>
  )
}
