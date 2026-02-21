import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  TextField,
  Button,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GET_GUESTS } from "../../graphql/queries";
import { DELETE_GUEST, UPDATE_GUEST } from "../../graphql/mutations";

const GuestList = ({ guests }) => {
    const { data, loading, error } = useQuery(GET_GUESTS);

    const [deleteGuest] = useMutation(DELETE_GUEST , {
        refetchQueries: [{ query: GET_GUESTS, fetchPolicy: 'network-only' }]
    })

    const [updateGuest] = useMutation(UPDATE_GUEST, {
        refetchQueries: [{ query: GET_GUESTS, fetchPolicy: 'network-only' }]
    })

    const [open, setOpen] = useState(false)
    const [selectedGuest, setSelectedGuest] = useState(null)

    const [editedName, setEditedName] = useState("")
    const [editedPhone, setEditedPhone] = useState("")
    const [editedRsvp, setEditedRsvp] = useState("Attending")

    const handleEditOpen = (guest) => {
        setSelectedGuest(guest)
        setEditedName(guest.name)
        setEditedPhone(guest.phone)
        setEditedRsvp(guest.rsvp)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedGuest(null)
    }

    const handleSave = async () => {
        await updateGuest({
            variables: {
                input: {
                    id: selectedGuest?.id,
                    name: editedName,
                    phone: editedPhone,
                    rsvp: editedRsvp,
                }
            }
        })
        handleClose()
    }
    
    if (loading) return <Typography>Loading Guests...</Typography>;
    if (error) return <Typography>Error loading guests</Typography>;

    const getChipColor = (rsvp) => {
        if (rsvp === "Attending") return "success";
        if (rsvp === "Not Attending") return "error";
        return "warning";
    };

  return (
    <>
    <Stack spacing={2}>
      {guests.map((guest) => (
        <Card key={guest?.id} sx={{ borderRadius: 2 }}>
          <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                maxHeight="40px"
              >
                <Box>
                  <Typography variant="h6">{guest.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {guest.phone}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={guest.rsvp}
                    color={getChipColor(guest.rsvp)}
                  />

                  <IconButton
                    onClick={() => { handleEditOpen(guest)
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      deleteGuest({ variables: { id: guest?.id } })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Guest</DialogTitle>
        <DialogContent sx={{mt: 1}}>
            <Stack spacing={3}>
                <TextField
                    label="Name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Phone"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    fullWidth
                />
                <TextField
                    select
                    label="RSVP"
                    value={editedRsvp}
                    onChange={(e) => setEditedRsvp(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="Attending">Attending</MenuItem>
                    <MenuItem value="Not Attending">Not Attending</MenuItem>
                    <MenuItem value="Maybe">Maybe</MenuItem>
                </TextField>
                </Stack>
            </DialogContent>
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
        </Dialog>
    </>
  );
}
export default GuestList;
