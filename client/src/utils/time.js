export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

export const timeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date);
  if (diff < 60000)    return 'just now';
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return formatDate(date);
};
