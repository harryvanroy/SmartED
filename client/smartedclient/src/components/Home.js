import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
  paperTitle: {
    textAlign: "center",
    fontSize: '1.5em',
    paddingBottom: '15px'
  }
}));

function Home() {
  const classes = useStyles();
  return (
    <div>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
          <div className = {classes.paperTitle}>
              Announcements
          </div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl elit, pretium ut sem eget, maximus porta sapien. Nulla mollis rutrum varius. Morbi mauris erat, semper a ullamcorper vel, rhoncus consequat ligula. Nullam tristique felis vitae pellentesque ornare. Suspendisse justo est, laoreet eu malesuada accumsan, semper eget urna. Nullam blandit tempor dolor quis sagittis. Nam eleifend id elit eu fermentum. Maecenas in gravida purus, ac laoreet sem. Pellentesque metus nulla, varius vitae arcu eget, tristique porttitor libero.
          Phasellus sodales viverra mattis. Sed ac lacinia justo, et pellentesque justo. Quisque massa massa, tempor sit amet gravida euismod, luctus in neque. Nam in placerat nunc, vel tempor augue. Vivamus tempus pulvinar felis sit amet dictum. Quisque ac neque a leo elementum iaculis. Praesent aliquam nunc gravida imperdiet interdum. In eu finibus orci. Suspendisse potenti. Donec lacinia risus commodo ornare posuere.
          Aliquam hendrerit felis sit amet magna sodales consectetur. Phasellus maximus aliquet augue id rhoncus. Nullam mi mauris, porttitor ac leo at, scelerisque gravida lorem. Sed vel tristique lorem. Curabitur aliquam bibendum dolor, in fringilla quam faucibus et. Nullam malesuada, ipsum feugiat condimentum semper, odio risus consequat metus, et elementum sapien turpis ac nunc. Fusce finibus magna eget molestie aliquam. Fusce sem elit, feugiat porta enim ultrices, aliquam congue purus. Sed nec molestie nulla, non venenatis ligula. Aenean venenatis sodales magna lobortis vulputate. Integer consequat, urna non dictum auctor, tortor velit interdum velit, a feugiat erat est sit amet tortor. Ut ultrices lacus viverra suscipit laoreet. Fusce consectetur sem ex, eu porta leo ultrices eget. Integer ut tortor neque.
          Nam in leo felis. Morbi in odio mauris. Ut id lorem velit. Nam cursus dictum libero, ut varius sem egestas sit amet. Duis tempor diam magna, gravida hendrerit tortor vulputate at. Pellentesque porttitor leo vitae ante aliquet pretium. Donec nibh justo, tincidunt eget sodales eget, mollis quis quam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Nam nibh velit, placerat varius nibh a, volutpat faucibus ipsum. Nam vitae turpis iaculis, ultrices ante eu, molestie lacus. Quisque malesuada eu metus at condimentum. Vestibulum luctus odio sit amet laoreet ullamcorper. Integer iaculis ante diam, eu porta ligula aliquet ac. Proin congue dictum auctor. Praesent massa dolor, tincidunt sed vestibulum molestie, aliquet scelerisque nibh. Quisque vulputate tincidunt fringilla. Donec nec dictum lectus, vitae volutpat mauris.
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <div className = {classes.paperTitle}>
              Upcoming Assessment
            </div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl elit, pretium ut sem eget, maximus porta sapien. Nulla mollis rutrum varius. Morbi mauris erat, semper a ullamcorper vel, rhoncus consequat ligula. Nullam tristique felis vitae pellentesque ornare. Suspendisse justo est, laoreet eu malesuada accumsan, semper eget urna. Nullam blandit tempor dolor quis sagittis. Nam eleifend id elit eu fermentum. Maecenas in gravida purus, ac laoreet sem. Pellentesque metus nulla, varius vitae arcu eget, tristique porttitor libero.
            Phasellus sodales viverra mattis. Sed ac lacinia justo, et pellentesque justo. Quisque massa massa, tempor sit amet gravida euismod, luctus in neque. Nam in placerat nunc, vel tempor augue. Vivamus tempus pulvinar felis sit amet dictum. Quisque ac neque a leo elementum iaculis. Praesent aliquam nunc gravida imperdiet interdum. In eu finibus orci. Suspendisse potenti. Donec lacinia risus commodo ornare posuere.
            Aliquam hendrerit felis sit amet magna sodales consectetur. Phasellus maximus aliquet augue id rhoncus. Nullam mi mauris, porttitor ac leo at, scelerisque gravida lorem. Sed vel tristique lorem. Curabitur aliquam bibendum dolor, in fringilla quam faucibus et. Nullam malesuada, ipsum feugiat condimentum semper, odio risus consequat metus, et elementum sapien turpis ac nunc. Fusce finibus magna eget molestie aliquam. Fusce sem elit, feugiat porta enim ultrices, aliquam congue purus. Sed nec molestie nulla, non venenatis ligula. Aenean venenatis sodales magna lobortis vulputate. Integer consequat, urna non dictum auctor, tortor velit interdum velit, a feugiat erat est sit amet tortor. Ut ultrices lacus viverra suscipit laoreet. Fusce consectetur sem ex, eu porta leo ultrices eget. Integer ut tortor neque.
            Nam in leo felis. Morbi in odio mauris. Ut id lorem velit. Nam cursus dictum libero, ut varius sem egestas sit amet. Duis tempor diam magna, gravida hendrerit tortor vulputate at. Pellentesque porttitor leo vitae ante aliquet pretium. Donec nibh justo, tincidunt eget sodales eget, mollis quis quam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Nam nibh velit, placerat varius nibh a,
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;