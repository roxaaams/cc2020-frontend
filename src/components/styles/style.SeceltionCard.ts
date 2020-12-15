import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      minHeight: '300px',
      minWidth: '90%',
      backgroundColor: theme.palette.background.default,
    },
    content: {
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    matrixSelectionContainer: {
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(3),
    },
    actions: {
      width: '100%',
      maxHeight: '80px',
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  })
);
