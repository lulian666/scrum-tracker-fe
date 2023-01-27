import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import reducer from './store';
import * as dataSlice from './store/dataSlice';
import { toggleNotificationPanel } from './store/stateSlice';

function NotificationPanelToggleButton(props) {
  // const notifications = useSelector(dataSlice.selectNotifications);
  const hasNew = useSelector(dataSlice.notificationHasNew);
  const dispatch = useDispatch();

  const onClick = (ev) => {
    dispatch(dataSlice.getNotifications());
    dispatch(dataSlice.readNotifications());
    dispatch(toggleNotificationPanel());
  };
  return (
    <IconButton className="w-40 h-40" onClick={onClick} size="large">
      {/* unread badge */}
      <Badge color="secondary" variant="dot" invisible={!hasNew}>
        {props.children}
      </Badge>
    </IconButton>
  );
}

NotificationPanelToggleButton.defaultProps = {
  children: <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon>,
};

export default withReducer(
  'notificationPanel',
  reducer
)(NotificationPanelToggleButton);
