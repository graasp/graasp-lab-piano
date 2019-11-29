import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Piano from './Piano';

const styles = theme => ({
  main: {
    textAlign: 'center',
    margin: theme.spacing.unit,
  },
  root: {
    overflow: 'hidden',
  },
});

export const StudentView = ({ classes }) => {
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12} className={classes.main}>
          <Piano />
        </Grid>
      </Grid>
    </div>
  );
};

StudentView.propTypes = {
  classes: PropTypes.shape({
    main: PropTypes.string,
    root: PropTypes.string,
  }).isRequired,
};

const StyledComponent = withStyles(styles)(StudentView);

export default withTranslation()(StyledComponent);
