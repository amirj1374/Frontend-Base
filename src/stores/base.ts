import { defineStore } from 'pinia';
import type { CollateralListDto, CurrenciesDto, HeadBranchsDto, PlanTypeDto } from '@/types/base/baseType';

export const useBaseStore = defineStore('baseStore', {
  state: () => ({
    currency: [] as CurrenciesDto[],
    headBranch: [] as HeadBranchsDto[],
    branchName: '',
    planType: [] as PlanTypeDto[],
    collateralList: [] as CollateralListDto[]
  }),

  getters: {
    getBranchNameByCode: (state) => {
      return (branchCode: number | string) => {
        const code = Number(branchCode);
        if (!Number.isFinite(code)) return '';

        for (const head of state.headBranch) {
          const matched = head.branchLists?.find((branch) => Number(branch.branchCode) === code);

          if (matched) {
            return matched.branchName ?? '';
          }
        }

        return '';
      };
    }
  },

  actions: {
    setCurrencyList(payload: CurrenciesDto[]) {
      this.currency = payload;
    },
    setHeadBranchList(payload: HeadBranchsDto[]) {
      this.headBranch = payload;
    },
    setBranchName(payload: string) {
      this.branchName = payload;
    },
    setPlanType(payload: PlanTypeDto[]) {
      this.planType = payload;
    },
    setCollateralList(payload: CollateralListDto[]) {
      this.collateralList = payload;
    },
    resetAll() {
      this.currency = [] as CurrenciesDto[];
      this.headBranch = [] as HeadBranchsDto[];
      this.branchName = '';
      this.planType = [] as PlanTypeDto[];
      this.collateralList = [] as CollateralListDto[];
    }
  }
});
