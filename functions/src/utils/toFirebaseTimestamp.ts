import { Timestamp } from 'firebase-admin/firestore';

const toFirebaseTimestamp = (dateString: string): Timestamp => {
  const dateObject = new Date(dateString);

  return Timestamp.fromDate(dateObject);
};

export default toFirebaseTimestamp;
