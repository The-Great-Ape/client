import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1, 0),
    width: "100%"
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal(props) {
  const { session, isConnected, userId, menuId, handleProfileMenuOpen, handleClickOpen } = props;
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function trimAddress(addr) {
    let start = addr.substring(0, 8);
    let end = addr.substring(addr.length - 4);
    return `${start}...${end}`;
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Button
          aria-controls={menuId}
          aria-haspopup="true"
          title="Connect Phantom"
      variant="contained"
      color="secondary"
      className={classes.button}
      startIcon={<img alt="Phantom" width="20" height="20" src="https://www.phantom.app/img/logo.png" />}
      onClick={isConnected ? handleProfileMenuOpen : handleClickOpen.bind(null, "phantom", handleClose)}>
        
        Phantom
      </Button>
      <Button
          aria-controls={menuId}
          aria-haspopup="true"
          title="Connect Sollet"
      variant="contained"
      color="secondary"
      className={classes.button}
      startIcon={<img alt="Sollet" width="20" height="20" src="https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/sollet.svg" />}
      onClick={isConnected ? handleProfileMenuOpen : handleClickOpen.bind(null, "sollet", handleClose)}>
        
        Sollet
      </Button>
      {/* <Button
          aria-controls={menuId}
          aria-haspopup="true"
          title="Connect Ledger"
      variant="contained"
      color="secondary"
      className={classes.button}
      startIcon={<img alt="Ledger" width="20" height="20" src="https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/ledger.svg" />}>
        
        Ledger
      </Button> */}
    </div>
  );

  return (
    <div>
      {/* <button type="button" onClick={handleOpen}>
        Open Modal
      </button> */}
      {(isConnected || !userId) && <Button
          aria-controls={menuId}
          aria-haspopup="true"
          color="primary"
          size="medium"
          variant="contained"
          title="Connect"
          onClick={isConnected ? handleProfileMenuOpen : handleOpen}
          >
          {isConnected ? session && trimAddress(session.publicKey) : 'Connect'}
      </Button>}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
