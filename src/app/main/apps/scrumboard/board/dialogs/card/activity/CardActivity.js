import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { selectMemberById } from '../../../../store/membersSlice';
import { selectUser } from 'app/store/userSlice';

function CardActivity(props) {
  // const user = useSelector((state) => selectMemberById(state, props.item.idMember));
  const user = useSelector(selectUser);
  console.log('props', props)
  switch (props.item.type) {
    case 'comment': {
      return (
        <ListItem dense className="px-0">
          {/* <Avatar alt={user?.name} src={user?.avatar} className="w-32 h-32" /> */}
          <Avatar
            className="w-32 h-32 mx-8 font-bold"
            src={user.data.photoURL}
            alt={user.data.displayName}
          >
            {user.data.displayName.charAt(0)}
          </Avatar>
          <Box
            className="flex flex-col mx-16 p-12"
            sx={{
              borderRadius: '5px 20px 20px 5px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <div className="flex items-center">
              <Typography>{user?.data.displayName}</Typography>
              <Typography className="mx-8 text-12" color="text.secondary">
                {formatDistanceToNow(fromUnixTime(props.item.time), {
                  addSuffix: true,
                })}
              </Typography>
            </div>
            <Typography>{props.item.message}</Typography>
          </Box>
        </ListItem>
      );
    }
    case 'attachment': {
      return (
        <ListItem dense className="px-0">
          {/* <Avatar alt={user?.name} src={user?.avatar} className="w-32 h-32" /> */}
          <Avatar
            className="w-32 h-32 mx-8 font-bold"
            src={user.data.photoURL}
            alt={user.data.displayName}
          >
            {user.data.displayName.charAt(0)}
          </Avatar>
          <div className="flex items-center mx-16">
            <Typography>{user.data.displayName},</Typography>
            <Typography className="mx-8">{props.item.message}</Typography>
            <Typography className="text-12" color="text.secondary">
              {/* {formatDistanceToNow(fromUnixTime(props.item.time), {
                addSuffix: true,
              })} */}
            </Typography>
          </div>
        </ListItem>
      );
    }
    default: {
      return null;
    }
  }
}

export default CardActivity;
