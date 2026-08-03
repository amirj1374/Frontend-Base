import type { AxiosInstance } from 'axios';
import { cachedGet } from '@/services/referenceCache';


export default (axiosInstance: AxiosInstance) => ({
  // fetch all currency (revaluation rates can move during a session -> not cached)
  fetchCurrencies() {
    return axiosInstance.get('services/caspianconnector/api/currencies-revaluation-rate?toBeForceUpdate=false');
  },
  // fetch all branch (static master data -> cached per session)
  getHeadBranch() {
    return cachedGet(axiosInstance, 'services/postservice/api/head-branches');
  },
  // fetch all branch
  convertBranchName() {
    return cachedGet(axiosInstance, 'services/postservice/api/convert-branch-name');
  },
  // fetch all plan type
  fetchPlanType() {
    return cachedGet(axiosInstance, 'services/mq/api/plan-types');
  },
  // fetch all contract list
  fetchCollateral() {
    return cachedGet(axiosInstance, 'services/postservice/api/collateral-state');
  },
  // fetch all loan contact
  fetchLoanContractList() {
    return cachedGet(axiosInstance, 'services/postservice/api/loan-contacts');
  },
  // fetch all branch and head branch
  fetchBranches() {
    return cachedGet(axiosInstance, 'services/postservice/api/head-branches');
  },
  // fetch all contract and facility
  fetchContractAndFacilityList() {
    return cachedGet(axiosInstance, 'services/caspianconnector/api/contracts-and-facilities');
  },
  // fetch all contract and facility
  fetchSendStatus() {
    return cachedGet(axiosInstance, 'services/postservice/api/status');
  },
  // fetch consignment chart data
  fetchConsignmentInfo(timePeriod: string) {
    return axiosInstance.get(`services/postservice/api/dashboard/consignment-info?timePeriod=${timePeriod}`);
  },
  // fetch consignment chart data
  fetchCallReportRequest() {
    return axiosInstance.get('services/postservice/api/dashboard/call-report-request');
  }
});
