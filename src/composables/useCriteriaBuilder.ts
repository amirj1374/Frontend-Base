export interface CriteriaFieldConfig {
  field?: string;
  operator?: 'equals' | 'contains' | 'in' | 'notIn' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
  transform?: (value: any) => any; // UI → API
  parse?: (value: any) => any; // API → UI

  /** برای فیلدهای پیچیده */
  build?: (model: Record<string, any>) => Record<string, any> | undefined;
  parseCriteria?: (criteria: Record<string, any>) => any;
}

export type CriteriaConfig = Record<string, CriteriaFieldConfig>;

export function useCriteriaBuilder(config: CriteriaConfig) {
  /**
   * UI → API
   */
  const buildCriteria = (filters: Record<string, any>) => {
    const criteria: Record<string, any> = {};

    Object.keys(config).forEach((key) => {
      const fieldConfig = config[key];
      const value = filters[key];

      if (fieldConfig.build) {
        const built = fieldConfig.build(filters);
        if (built && typeof built === 'object') {
          Object.assign(criteria, built);
        }
        return;
      }

      // ----- حالت‌های معمول -----
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        return;
      }

      const apiField = fieldConfig.field || key;
      let transformedValue = fieldConfig.transform ? fieldConfig.transform(value) : value;

      if ((fieldConfig.operator === 'in' || fieldConfig.operator === 'notIn') && Array.isArray(transformedValue)) {
        transformedValue = transformedValue.join(',');
      }

      const operator = fieldConfig.operator || 'equals';
      const criteriaKey = `${apiField}.${operator}`;
      criteria[criteriaKey] = transformedValue;
    });

    return criteria;
  };

  /**
   * API → UI
   */
  const parseCriteria = (criteria: Record<string, any>) => {
    const filters: Record<string, any> = {};

    Object.keys(config).forEach((key) => {
      const fieldConfig = config[key];

      // ✳️ اگر فیلد custom parser دارد
      if (fieldConfig.parseCriteria) {
        const parsed = fieldConfig.parseCriteria(criteria);
        if (parsed !== undefined) filters[key] = parsed;
        return;
      }

      const apiField = fieldConfig.field || key;
      const operator = fieldConfig.operator || 'equals';
      const criteriaKey = `${apiField}.${operator}`;
      const value = criteria[criteriaKey];

      if (value === undefined) return;

      let parsedValue = value;

      if (operator === 'in' || operator === 'notIn') {
        parsedValue = typeof value === 'string' ? value.split(',') : value;
      }

      if (fieldConfig.parse) {
        parsedValue = fieldConfig.parse(parsedValue);
      }

      filters[key] = parsedValue;
    });

    return filters;
  };

  /**
   * تبدیل API → UI برای فیلدهای تاریخ
   */
  const parseDateRanges = (criteria: Record<string, any>, fields: string[]) => {
    const parsed: Record<string, any> = {};

    fields.forEach((f) => {
      const start = criteria[`${f}.greaterThanOrEqual`];
      const end = criteria[`${f}.lessThanOrEqual`];
      if (start || end) parsed[f] = [start ?? null, end ?? null];
    });

    return parsed;
  };

  /**
   * تبدیل UI → API برای فیلدهای تاریخ
   */
  const buildDateRanges = (filters: Record<string, any>, fields: string[]) => {
    const criteria: Record<string, any> = {};

    fields.forEach((f) => {
      const val = filters[f];
      if (!Array.isArray(val) || val.length !== 2) return;

      const [start, end] = val;
      if (start) criteria[`${f}.greaterThanOrEqual`] = start;
      if (end) criteria[`${f}.lessThanOrEqual`] = end;
    });

    return criteria;
  };

  return { buildCriteria, parseCriteria, buildDateRanges, parseDateRanges };
}
