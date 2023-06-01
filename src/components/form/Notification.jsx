import React from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";

export const WithSnackbar = (props) => {
  
      return (
        <>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            autoHideDuration={2000}
            open={props.open}
            onClose={props.close}
            direction="down"
            style={{marginTop: "90px" }}
          >
            <Alert variant="filled"  severity={props.severity} onClose={props.close}>
              {props.message} 
            </Alert>
          </Snackbar>
        </>
      );
  };
  