import { useDebounce } from '@fuse/hooks';
import _ from '@lodash';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import clsx from 'clsx';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import format from 'date-fns/format';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box } from '@mui/system';
import {
  closeCardDialog,
  removeCard,
  selectCardData,
  updateCard,
} from '../../../store/cardSlice';
import { newComment } from '../../../store/commentSlice';
import CardActivity from './activity/CardActivity';
import CardAttachment from './attachment/CardAttachment';
import CardChecklist from './checklist/CardChecklist';
import CardComment from './comment/CardComment';
import { selectListById } from '../../../store/listsSlice';
import { selectLabels } from '../../../store/labelsSlice';
import { selectBoard } from '../../../store/boardSlice';
import { selectMembers } from '../../../store/membersSlice';
import DueMenu from './toolbar/DueMenu';
import LabelsMenu from './toolbar/LabelsMenu';
import MembersMenu from './toolbar/MembersMenu';
import CheckListMenu from './toolbar/CheckListMenu';
import OptionsMenu from './toolbar/OptionsMenu';
import { message, Upload } from 'antd';
import { useState } from 'react';
import { userLoggedOut } from 'app/store/userSlice';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import AttachmentModel from '../../../model/AttachmentModel';
import FuseUtils from '@fuse/utils';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('Image must smaller than 10MB!');
  }
  return isJpgOrPng && isLt10M;
};

function BoardCardForm(props) {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  // const labels = useSelector(selectLabels);
  const members = useSelector(selectMembers);
  const card = useSelector(selectCardData);
  const list = useSelector((state) => selectListById(state, card?.listId));
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);

  const host = axios.defaults.baseURL;
  const uploadURL = `${host}/api/v1/boards/${board?.id}/cards/${card?.id}/attachments`;

  const { register, watch, control, setValue } = useForm({
    mode: 'onChange',
    defaultValues: card,
  });

  const cardForm = watch();

  const updateCardData = useDebounce((newCard) => {
    dispatch(updateCard(newCard));
  }, 600);

  useEffect(() => {
    if (!card) {
      return;
    }

    if (
      // only watch for title and description
      !_.isEqual(card.title, cardForm.title) ||
      !_.isEqual(card.description, cardForm.description) ||
      !_.isEqual(card.activities.length, cardForm.activities.length) ||
      !_.isEqual(card.attachments.length, cardForm.attachments.length)
    ) {
      updateCardData(cardForm);
    }
  }, [card, cardForm, updateCardData]);
  // useEffect(() => {
  //   register('attachmentCoverId');
  // }, [register]);

  if (!card) {
    return null;
  }
  function commentAdd(comment) {
    setValue('activities', [comment, ...cardForm.activities]);
    dispatch(newComment(comment));
    // dispatch(getCard())
  }

  function attachmentAdd(attachment) {
    setValue('attachments', [attachment, ...cardForm.attachments]);
    setValue('activities', [
      AttachmentModel(attachment),
      ...cardForm.activities,
    ]);
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      const newAttachment = info.file.response.attachment;
      attachmentAdd(newAttachment);
    }
  };

  const deleteAttachment = async (attachment) => {
    const deleteAttachmentURL = `${host}/api/v1/boards/${board?.id}/cards/${card?.id}/attachments/${attachment.id}`;
    await axios.delete(`${deleteAttachmentURL}`);
  };

  return (
    <>
      <DialogContent className="flex flex-col sm:flex-row p-8">
        <div className="flex flex-auto flex-col py-16 px-0 sm:px-16">
          <div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center mb-24">
            <div className="mb-16 sm:mb-0 flex items-center">
              <Typography>{board.title}</Typography>

              <FuseSvgIcon size={20}>
                heroicons-outline:chevron-right
              </FuseSvgIcon>

              <Typography>{list && list.title}</Typography>
            </div>

            {/* {cardForm.dueDate && (
              <DateTimePicker
                value={format(fromUnixTime(cardForm.dueDate), 'Pp')}
                inputFormat="Pp"
                onChange={(val) => setValue('dueDate', getUnixTime(val))}
                renderInput={(_props) => (
                  <TextField
                    label="Due date"
                    placeholder="Choose a due date"
                    className="w-full sm:w-auto"
                    {..._props}
                  />
                )}
              />
            )} */}
          </div>

          <div className="flex items-center mb-24">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {card.subscribed && (
                          <FuseSvgIcon size={20} color="action">
                            heroicons-outline:eye
                          </FuseSvgIcon>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className="w-full mb-24">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows="4"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>

          {/* {cardForm.labels && cardForm.labels.length > 0 && (
            <div className="flex-1 mb-24 mx-8">
              <div className="flex items-center mt-16 mb-12">
                <FuseSvgIcon size={20}>heroicons-outline:tag</FuseSvgIcon>
                <Typography className="font-semibold text-16 mx-8">
                  Labels
                </Typography>
              </div>
              <Autocomplete
                className="mt-8 mb-16"
                multiple
                freeSolo
                options={labels}
                getOptionLabel={(label) => {
                  return label.title;
                }}
                value={cardForm.labels.map((id) => _.find(labels, { id }))}
                onChange={(event, newValue) => {
                  setValue(
                    'labels',
                    newValue.map((item) => item.id)
                  );
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    return (
                      <Chip
                        label={option.title}
                        {...getTagProps({ index })}
                        className="m-3"
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select multiple Labels"
                    label="Labels"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </div>
          )} */}

          {/* {cardForm.memberIds && cardForm.memberIds.length > 0 && (
            <div className="flex-1 mb-24 mx-8">
              <div className="flex items-center mt-16 mb-12">
                <FuseSvgIcon size={20}>heroicons-outline:users</FuseSvgIcon>
                <Typography className="font-semibold text-16 mx-8">
                  Members
                </Typography>
              </div>
              <Autocomplete
                className="mt-8 mb-16"
                multiple
                freeSolo
                options={members}
                getOptionLabel={(member) => {
                  return member.name;
                }}
                value={cardForm.memberIds.map((id) => _.find(members, { id }))}
                onChange={(event, newValue) => {
                  setValue(
                    'memberIds',
                    newValue.map((item) => item.id)
                  );
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    return (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        className={clsx('m-3', option.class)}
                        avatar={
                          <Tooltip title={option.name}>
                            <Avatar src={option.avatar} />
                          </Tooltip>
                        }
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select multiple Members"
                    label="Members"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </div>
          )} */}

          {cardForm.attachments && cardForm.attachments.length > 0 && (
            <div className="mb-24">
              <div className="flex items-center mt-16 mb-12">
                <FuseSvgIcon size={20}>
                  heroicons-outline:paper-clip
                </FuseSvgIcon>
                <Typography className="font-semibold text-16 mx-8">
                  Attachments
                </Typography>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap -mx-16">
                {cardForm.attachments.map((item) => (
                  <CardAttachment
                    item={item}
                    card={cardForm}
                    makeCover={() => {
                      setValue('attachmentCoverId', item.id);
                    }}
                    removeCover={() => {
                      setValue('attachmentCoverId', '');
                    }}
                    removeAttachment={async () => {
                      const deleteActivity = {
                        idMember: user.uuid,
                        message: `deleted attachment '${item.name}'`,
                      };
                      setValue('activities', [
                        AttachmentModel(deleteActivity),
                        ...cardForm.activities,
                      ]);
                      await deleteAttachment(item);
                      setValue(
                        'attachments',
                        _.reject(cardForm.attachments, { id: item.id })
                      );
                    }}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* {cardForm.checklists &&
            cardForm.checklists.map((checklist, index) => (
              <CardChecklist
                key={checklist.id}
                checklist={checklist}
                index={index}
                onCheckListChange={(item, itemIndex) => {
                  setValue(
                    'checklists',
                    _.setIn(cardForm.checklists, `[${itemIndex}]`, item)
                  );
                }}
                onRemoveCheckList={() => {
                  setValue(
                    'checklists',
                    _.reject(cardForm.checklists, { id: checklist.id })
                  );
                }}
              />
            ))} */}

          <div className="mb-24">
            <div className="flex items-center mt-16 mb-12">
              <FuseSvgIcon size={20}>heroicons-outline:chat-alt</FuseSvgIcon>
              <Typography className="font-semibold text-16 mx-8">
                Comment
              </Typography>
            </div>
            <div className="CardComment">
              <CardComment onCommentAdd={commentAdd} />
            </div>
          </div>

          <Controller
            name="activities"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <div>
                {value?.length > 0 && (
                  <div className="mb-24">
                    <div className="flex items-center mt-16">
                      <FuseSvgIcon size={20}>
                        heroicons-outline:clipboard-list
                      </FuseSvgIcon>
                      <Typography className="font-semibold text-16 mx-8">
                        Activity
                      </Typography>
                    </div>
                    <List className="">
                      {value.map((item) => (
                        <CardActivity item={item} key={item.id} />
                      ))}
                    </List>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex order-first sm:order-last items-start sticky top-0">
          <Box
            className="flex flex-row sm:flex-col items-center sm:py-8 rounded-12 w-full"
            sx={{ backgroundColor: 'background.default' }}
          >
            <IconButton
              className="order-last sm:order-first"
              color="inherit"
              onClick={(ev) => dispatch(closeCardDialog())}
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
            </IconButton>
            <div className="flex flex-row items-center sm:items-start sm:flex-col flex-1">
              {/* <Controller
                name="dueDate"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <DueMenu
                    onDueChange={onChange}
                    onRemoveDue={() => onChange(null)}
                    dueDate={value}
                  />
                )}
              /> */}

              {/* <Controller
                name="labels"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <LabelsMenu
                    onToggleLabel={(labelId) =>
                      onChange(_.xor(value, [labelId]))
                    }
                    labels={value}
                  />
                )}
              /> */}

              {/* <Controller
                name="memberIds"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <MembersMenu
                    onToggleMember={(memberId) =>
                      onChange(_.xor(value, [memberId]))
                    }
                    memberIds={value}
                  />
                )}
              /> */}

              <Controller
                name="attachments"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <Upload
                    showUploadList={false}
                    action={uploadURL}
                    data={{
                      type: 'image',
                      idMember: user.uuid,
                      message: 'uploaded an image',
                    }}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {loading ? (
                      <>
                        <IconButton size="large">
                          <FuseSvgIcon>feather:loader</FuseSvgIcon>
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton size="large">
                          <FuseSvgIcon>
                            heroicons-outline:paper-clip
                          </FuseSvgIcon>
                        </IconButton>
                      </>
                    )}
                  </Upload>
                )}
              />

              {/* <Controller
                name="checklists"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <CheckListMenu
                    onAddCheckList={(newList) =>
                      onChange([...cardForm.checklists, newList])
                    }
                  />
                )}
              /> */}

              <OptionsMenu onRemoveCard={() => dispatch(removeCard())} />
            </div>
          </Box>
        </div>
      </DialogContent>
    </>
  );
}

export default BoardCardForm;
