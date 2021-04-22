/**
 * Transaction types
 */
const txTypes = {
  success: 'success',
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
  unknown: 'unknown'
};
/**
 * Notification types
 */
const notificationTypes = {
  swap: 'swap',
  in: 'in',
  out: 'out',
  error: 'error'
};

export { txTypes, notificationTypes };
