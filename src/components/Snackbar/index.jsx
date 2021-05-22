import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Wallet from '../Wallet/Wallet';

export default function PositionedSnackbar(props) {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: "default"
  });

  const { vertical, horizontal, open, message } = state;

  const handleClick = () => {
    console.log('props', props)
    props.wallet.signMessage(props.token).then(response => {
      console.log('here', response.message)
      setState({
        open: true, 
        vertical: 'top', 
        horizontal: 'center',
        message: response.message
      });
    });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const buttons = (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        className="button"
        size="large" 
        onClick={handleClick}>
        Sign Transaction
      </Button>
    </React.Fragment>
  );

  return (
    <div>
      {buttons}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
      />
    </div>
  );
}
