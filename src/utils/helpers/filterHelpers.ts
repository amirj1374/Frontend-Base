export const handleDateRangeFields = (
  criteria: Record<string, any>,
  filters: Record<string, any>,
  dateRangeFields: string[] = ['grantDate', 'dueDate']
) => {
  dateRangeFields.forEach((field) => {
    const value = filters[field];

    if (!Array.isArray(value) || value.length !== 2) return;

    const [start, end] = value;

    if (start) criteria[`${field}.greaterThanOrEqual`] = start;

    if (end) criteria[`${field}.lessThanOrEqual`] = end;
  });

  return criteria;
};
