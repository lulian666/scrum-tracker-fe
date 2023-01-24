import FuseUtils from '@fuse/utils';
import getUnixTime from 'date-fns/getUnixTime';
import _ from '@lodash';

function AttachmentModel(data) {
  data = data || {};

  return _.defaults(data, {
    id: FuseUtils.generateGUID(),
    type: 'image',
    idMember: null,
    message: '',
    createdAt: new Date(),
    src: '',
    name: '',
  });
}

export default AttachmentModel;
