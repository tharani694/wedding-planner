import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_GUEST } from "../../graphql/mutations";
import { GET_GUESTS } from "../../graphql/queries";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack
} from "@mui/material";

const GuestForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvp, setRsvp] = useState("Attending");

  const [addGuest, { loading }] = useMutation(ADD_GUEST, {
    refetchQueries: [{ query: GET_GUESTS }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addGuest({
      variables: {
        input: { name, phone, rsvp },
      },
    });

    setName("");
    setPhone("");
    setRsvp("Attending");
  };

  return (
    <Card sx={{ maxWidth: "500", mx: "auto", mb: 4, borderRadius: 3 }}>
      <CardContent sx={{p: 3}}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          Add Guest
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Guest Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="RSVP Status"
              value={rsvp}
              onChange={(e) => setRsvp(e.target.value)}
              fullWidth
            >
              <MenuItem value="Attending">Attending</MenuItem>
              <MenuItem value="Not Attending">Not Attending</MenuItem>
              <MenuItem value="Maybe">Maybe</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Guest"}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}

export default GuestForm;
