import moment from 'moment';

export default release => {
  const releaseToDate = new Date(release);
  const diff = moment(new Date()).diff(releaseToDate, 'days') <= 21;
  return diff;
};
