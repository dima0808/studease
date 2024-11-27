export function calculateTimeDifference(startedAt, finishedAt) {
  const startDate = new Date(startedAt.split('.').reverse().join('-'));
  const endDate = new Date(finishedAt.split('.').reverse().join('-'));
  const diffMs = endDate - startDate;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}