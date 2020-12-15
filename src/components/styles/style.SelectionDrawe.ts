import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      minWidth: '80%',
    },
    content: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
    },
    info: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tableContainer: {
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'scroll',
      paddingTop: '15px',
      backgroundColor: '#f0f0f0',
      borderRadius: '5px',
    },
    actions: {
      width: '100%',
      display: 'flex',
      marginTop: theme.spacing(2),
      justifyContent: 'flex-end',
    },
  })
);
