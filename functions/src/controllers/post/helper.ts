import { Timestamp } from 'firebase-admin/firestore';

import { PostStatus } from '../../types/post';
import toFirebaseTimestamp from '../../utils/toFirebaseTimestamp';

type Params = {
  status: PostStatus;
  publishedAt: string | Timestamp;
  scheduledAt?: string | null;
};

type ReturnTime = {
  newPublishedAt: string | Timestamp | null;
  newScheduledAt: string | Timestamp | null;
};

export const setTimestamps = ({
  status,
  publishedAt,
  scheduledAt,
}: Params): ReturnTime => {
  let newPublishedAt = null;
  let newScheduledAt = null;

  if (status.toUpperCase() === 'PUBLISHED') {
    newPublishedAt = publishedAt;
  }

  if (status.toUpperCase() === 'SCHEDULED' && scheduledAt) {
    newScheduledAt = toFirebaseTimestamp(scheduledAt);
  }

  return { newPublishedAt, newScheduledAt };
};

export const timeValue = (time?: Timestamp | null): number | null => {
  if (time?.toMillis) {
    return time.toMillis();
  } else {
    return null;
  }
};
