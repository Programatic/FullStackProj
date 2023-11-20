import React, { FC, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Card, CardActions, CardContent, CardHeader, Dialog, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, TextFieldProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Modal.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { State } from '@/pages';

type ModalParam = {
  isCreate: boolean,
  onClose: () => void,
  onAdd: (s: State) => void,
  onEdit: (s: State) => void,
  validateTitle: (s: string) => boolean,
  vals?: State
};

export function BasicModal({ isCreate, onClose, onAdd, onEdit, validateTitle, vals }: ModalParam) {
  const [title, setTitle] = useState(vals?.title ?? '');
  const [description, setDescription] = useState(vals?.description ?? '');
  const [deadline, setDeadline] = useState<Dayjs | null>(vals?.deadline ?? null);
  const [priority, setPriority] = useState(vals?.priority ?? 'Low');

  const [titleError, setTitleError] = useState({ error: false, helper: ' ' });
  const [descriptionError, setDescriptionError] = useState({ error: false, helper: ' ' });
  const [deadlineError, setDeadlineError] = useState({ error: false, helper: ' ' });

  const _validateTitle = () => {
    if (title === '') {
      setTitleError({ error: true, helper: 'Title is Required!' });
      return false;
    }
    else if (!validateTitle(title!)) {
      setTitleError({ error: true, helper: 'Title Must Be Unique!' });
      return false;
    }

    return true;
  }

  const validateDescription = () => {
    if (description === '') {
      setDescriptionError({ error: true, helper: 'Description is Required!' });
      return false;
    }

    return true;
  }

  const validateDeadline = () => {
    if (deadline === null) {
      setDeadlineError({ error: true, helper: 'Deadline is Required!' });
      return false;
    }

    return true;
  }

  const validate = (isEdit: boolean = false): boolean => {
    const vt = isEdit ? true : _validateTitle();
    const vd = validateDescription();
    const vl = validateDeadline();

    return vt && vd && vl;
  };

  return (
    <>
      <Dialog
        className={styles.modal}
        open={true} // To force only rendering when needed (we don't care about prerendering, no performance issues)
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className={styles.card}>
          <CardHeader
            title={
              isCreate ?
                <Typography color="#fff" variant='h5' ><FontAwesomeIcon icon={faCirclePlus} size='lg' color="#fff" /> Add Task</Typography> :
                <Typography color="#fff" variant='h5' ><FontAwesomeIcon icon={faPenToSquare} size='lg' color="#fff" /> Edit Task</Typography>
            }
            className={styles.modalHeader}
          />
          <CardContent className={styles.cardContent}>
            {isCreate ? <TextField className={styles.cardInputItem} value={title} error={titleError.error} helperText={titleError.helper} onBlur={_validateTitle} onChange={(e) => { setTitle(e.target.value); setTitleError({ error: false, helper: ' ' }); }} id="title" label="Title" variant="outlined" required /> : null}
            <TextField value={description} error={descriptionError.error} helperText={descriptionError.helper} onBlur={validateDescription} onChange={(e) => { setDescription(e.target.value); setDescriptionError({ error: false, helper: ' ' }) }} className={styles.cardInputItem} id="description" label="Description" variant="outlined" required />
            <DatePicker value={deadline} className={styles.cardInputItem}
              slotProps={{
                textField: {
                  helperText: deadlineError.helper,
                  error: deadlineError.error,
                  onBlur: validateDeadline
                }
              }}
              onChange={(v) => { setDeadline(v); setDeadlineError({ error: false, helper: ' ' }) }} label="Deadline" />
            <div className={styles.cardInputItem}>
              <FormControl fullWidth>
                <FormLabel>Priority</FormLabel>
                <RadioGroup
                  row
                  name="priority"
                  value={priority}
                  style={{ justifyContent: 'space-between' }}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <FormControlLabel value="Low" control={<Radio />} label="Low" />
                  <FormControlLabel value="Med" control={<Radio />} label="Med" />
                  <FormControlLabel value="High" control={<Radio />} label="High" />
                </RadioGroup>
              </FormControl>
            </div>
          </CardContent>
          <CardActions className={styles.buttons}>
            <Button variant="contained" onClick={onClose} color="error"><FontAwesomeIcon icon={faBan} />&nbsp; Cancel</Button>
            {isCreate ?
              <Button variant="contained" onClick={() => {
                if (validate()) {
                  onAdd({ title: title!, description: description!, deadline: deadline!, priority, isChecked: false });
                  onClose();
                }
              }}><FontAwesomeIcon icon={faCirclePlus} />&nbsp; Add</Button> :
              <Button variant="contained" onClick={() => {
                if (validate(true)) {
                  onEdit({ title: title!, description: description!, deadline: deadline!, priority, isChecked: false });
                  onClose();
                }
              }}><FontAwesomeIcon icon={faPenToSquare} />&nbsp; Edit</Button>}
          </CardActions>
        </Card>
      </Dialog>
    </>
  );
}
