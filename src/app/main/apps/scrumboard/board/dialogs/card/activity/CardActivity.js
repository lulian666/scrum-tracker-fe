import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { selectMemberById } from '../../../../store/membersSlice';
import { selectUser } from 'app/store/userSlice';
import { formatDistance } from 'date-fns';

function CardActivity(props) {
  const postUser = useSelector((state) =>
    selectMemberById(state, props.item.idMember)
  );

  const user = useSelector(selectUser);

  switch (props.item.type) {
    case 'comment': {
      return (
        <ListItem dense className="px-0">
          <Avatar
            alt={postUser?.name}
            src={postUser?.avatar}
            className="w-32 h-32"
          />
          <Box
            className="flex flex-col mx-16 p-12"
            sx={{
              borderRadius: '5px 20px 20px 5px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <div className="flex items-center">
              <Typography>{user?.data.displayName}</Typography>
              <Typography className="mx-8">added a comment</Typography>
              <Typography className="mx-8 text-12" color="text.secondary">
                {formatDistance(new Date(props.item.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </Typography>
            </div>
            <Typography>{props.item.message}</Typography>
          </Box>
        </ListItem>
      );
    }
    case 'image': {
      return (
        <ListItem dense className="px-0">
          <Avatar
            alt={postUser?.name}
            src={postUser?.avatar}
            className="w-32 h-32"
          />
          <div className="flex items-center mx-16">
            <Typography>{postUser.name}</Typography>
            <Typography className="mx-8">{props.item.message}</Typography>
            <Typography className="text-12" color="text.secondary">
              {formatDistance(new Date(props.item.createdAt), new Date(), {
                addSuffix: true,
              })}
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
