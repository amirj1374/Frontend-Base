export interface CurrenciesDto {
  currencyCode: string;
  currencyDescription: string;
  equalityCoefficient: number;
  id: string;
  insertDate: string;
  insertUser: string;
  lastRate: boolean;
  referenceRate: number;
  referencedCurrency: boolean;
  revaluationRate: number;
}

export interface HeadBranchsDto {
  branchId: number;
  branchLists: BranchListDto[];
  centerBranch: string | null;
  id: number;
  name: string;
}

export interface BranchListDto {
  branchCode: number;
  branchName: string;
  headBranch: HeadBranchDto | null;
  id: number;
}

export interface HeadBranchDto {
  branchId: number | null;
  branchLists: string | null;
  centerBranch: string | null;
  id: number;
  name: string;
}


export interface PlanTypeDto {
  code: string;
  id: number;
  isActive: string;
  title: string;
}

export interface CollateralListDto {
  id: number;
  title: string;
}
export interface Branch {
  id: number;
  branchName: string;
  branchCode: number;
  headBranch: HeadquarterSummary | null;
}

export interface Headquarter {
  id: number;
  name: string;
  branchId: number | null;
  centerBranch: unknown;
  branchLists: Branch[] | null;
}

// اگر خواستی HeadBranch توی Branch خلاصه‌تر باشه:
export interface HeadquarterSummary {
  id: number;
  name: string;
  branchId: number | null;
  centerBranch: unknown;
  branchLists: null;
}

export interface ContractDTO {
  code: string;
  description: string;
  facilityDTOS: unknown[];
}

export interface GuaranteeTypeDTO {
  id: string;
  title: string;
}

export interface LCTypeDTO {
  id: string;
  title: string;
}


export interface CusDTO {
  cusName: string;
  cusNo: string;
  fbtiCusId: string;
  rowNumber: number;
}

export interface GoodDTO {
  title: string;
  code: string;
  rowNumber: number;
}

export interface RepaymentDTO {
  code: string;
  title: string;
}

export interface CurrencyDTO {
  currencyCode: string;
  currencyDescription: string;
  equalityCoefficient: string;
  id: string;
  insertDate: string;
  insertUser: string;
  lastRate: string;
  referenceRate: string;
  referencedCurrency: string;
  revaluationRate: string;
}

export interface ProductTypeDTO {
  title: string;
  code: string;
  id: number;
  rowNumber: number;
}

export interface ContractFacilityListDTO {
  code: string;
  description: string;
}

export interface SendStatusDTO {
  description: string;
  id: number;
  statusCode: string;
}
