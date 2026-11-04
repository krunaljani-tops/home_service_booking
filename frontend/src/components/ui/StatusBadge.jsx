import React from 'react';
import Badge from './Badge';

const statusMap = {
  // Booking statuses
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  assigned: { label: 'Assigned', variant: 'primary' },
  in_progress: { label: 'In Progress', variant: 'purple' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
  rejected: { label: 'Rejected', variant: 'danger' },

  // Payment statuses
  paid: { label: 'Paid', variant: 'success' },
  unpaid: { label: 'Unpaid', variant: 'warning' },
  refunded: { label: 'Refunded', variant: 'secondary' },
  failed: { label: 'Failed', variant: 'danger' },

  // Verification statuses
  verified: { label: 'Verified', variant: 'success' },
  unverified: { label: 'Unverified', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },

  // Complaint statuses
  open: { label: 'Open', variant: 'danger' },
  investigating: { label: 'Investigating', variant: 'warning' },
  resolved: { label: 'Resolved', variant: 'success' },
  closed: { label: 'Closed', variant: 'secondary' },

  // User status
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  suspended: { label: 'Suspended', variant: 'danger' },
};

export const StatusBadge = ({ status = 'pending', dot = true, size = 'md' }) => {
  const normalizedKey = String(status).toLowerCase().replace(/\s+/g, '_');
  const config = statusMap[normalizedKey] || {
    label: status.replace(/_/g, ' ').toUpperCase(),
    variant: 'secondary',
  };

  return (
    <Badge variant={config.variant} size={size} dot={dot}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
