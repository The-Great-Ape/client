import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default function PositionedSnackbar(props) {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: "default"
  });

  const { vertical, horizontal, open, message } = state;

  const handleClick = async () => {
    console.log('props', props)
    let response = await props.wallet.signMessage(props.token, props.discordId);

    if (response) {
      setState({
        open: true,
        vertical: 'top',
        horizontal: 'center',
        message: 'Success'
      });
    }
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
        Link Discord to Wallet
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
        key={vertical + horizontal}
      />
    </div>
  );
}
