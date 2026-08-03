import { api } from '@/services/api';
import { useBaseStore } from '@/stores/base';
import { useCustomerInfoStore } from '@/stores/customerInfo';
import { useCustomizerStore } from '@/stores/customizer';
import type { CollateralListDto, CurrenciesDto, HeadBranchsDto, PlanTypeDto } from '@/types/base/baseType';
import type { AppInitializationResult } from './appInitializer';
import { AppInitializer } from './appInitializer';

const validThemes = [
  'ModernTheme',
  'PurpleTheme',
  'SteelTealGreen',
  'OrangeTheme',
  'TealTheme',
  'SilverTheme',
  'RedTheme',
  'NavyGoldTheme',
  'DarkModernTheme',
  'DarkPurpleTheme',
  'DarkSteelTealGreen',
  'DarkOrangeTheme',
  'DarkTealTheme',
  'DarkSilverTheme',
  'DarkRedTheme',
  'DarkNavyGoldTheme'
] as const;

const validLayoutTypes = ['SideBar', 'NavBar'] as const;
const validFontThemes = ['vazir', 'yekanLight', 'iranSans', 'kalamehLight'] as const;
const validThemeModes = ['light', 'dark'] as const;

const validateTheme = (theme: string): string => {
  return validThemes.includes(theme as (typeof validThemes)[number]) ? theme : 'PurpleTheme';
};

const validateLayoutType = (layout: string): string => {
  return validLayoutTypes.includes(layout as (typeof validLayoutTypes)[number]) ? layout : 'SideBar';
};

const validateFontTheme = (font: string): string => {
  return validFontThemes.includes(font as (typeof validFontThemes)[number]) ? font : 'vazir';
};

const validateThemeMode = (mode: string): string => {
  return validThemeModes.includes(mode as (typeof validThemeModes)[number]) ? mode : 'light';
};

const validateInputBg = (inputBg: boolean): boolean => {
  return typeof inputBg === 'boolean' ? inputBg : false;
};

type BaseDataPayload = {
  currencies: CurrenciesDto[];
  headBranch: HeadBranchsDto[];
  branchName: string;
  planType: PlanTypeDto[];
  collateralList: CollateralListDto[];
};

const baseDataCache: {
  promise: Promise<BaseDataPayload> | null;
  data: BaseDataPayload | null;
} = {
  promise: null,
  data: null
};

const applyBaseDataToStore = (baseStore: ReturnType<typeof useBaseStore>, data: BaseDataPayload) => {
  baseStore.setCurrencyList(data.currencies);
  baseStore.setHeadBranchList(data.headBranch);
  baseStore.setBranchName(data.branchName);
  baseStore.setPlanType(data.planType);
};

const BASE_DATA_STAGGER_DELAY = 0;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadBaseDataSequential = async (baseStore?: ReturnType<typeof useBaseStore>): Promise<BaseDataPayload> => {
  const payload: BaseDataPayload = {
    currencies: [],
    headBranch: [],
    branchName: '',
    planType: [],
    collateralList: []
  };

  const log = (message: string) => {
    if (import.meta.env.DEV) {
      console.log(`[VosoolAppInitializer] ${message}`);
    }
  };

  log('Fetching branch name');
  const branchNameResponse = await api.base.convertBranchName();
  payload.branchName = branchNameResponse.data;
  if (baseStore) {
    baseStore.setBranchName(payload.branchName);
  }

  if (BASE_DATA_STAGGER_DELAY > 0) {
    await delay(BASE_DATA_STAGGER_DELAY);
  }

  log('Fetching head branch');
  const headBranchResponse = await api.base.getHeadBranch();
  payload.headBranch = headBranchResponse.data;
  if (baseStore) {
    baseStore.setHeadBranchList(payload.headBranch);
  }

  if (BASE_DATA_STAGGER_DELAY > 0) {
    await delay(BASE_DATA_STAGGER_DELAY);
  }

  log('Fetching plan type');
  const planTypeResponse = await api.base.fetchPlanType();
  payload.planType = planTypeResponse.data.content;
  if (baseStore) {
    baseStore.setPlanType(payload.planType);
  }

  // log('Fetching currencies');
  // const currencyResponse = await api.base.fetchCurrencies();
  // payload.currencies = currencyResponse.data;
  // if (baseStore) {
  //   baseStore.setCurrencyList(payload.currencies);
  // }

  log('Fetching collaterals');
  const collateralList = await api.base.fetchCollateral();
  payload.collateralList = collateralList.data;
  if (baseStore) {
    baseStore.setCollateralList(payload.collateralList);
  }

  if (BASE_DATA_STAGGER_DELAY > 0) {
    await delay(BASE_DATA_STAGGER_DELAY);
  }

  baseDataCache.data = payload;
  return payload;
};

const fetchBaseData = async (baseStore?: ReturnType<typeof useBaseStore>): Promise<BaseDataPayload> => {
  if (baseDataCache.data) {
    if (baseStore) {
      applyBaseDataToStore(baseStore, baseDataCache.data);
    }
    return baseDataCache.data;
  }

  if (!baseDataCache.promise) {
    baseDataCache.promise = loadBaseDataSequential(baseStore).catch((error) => {
      baseDataCache.promise = null;
      throw error;
    });
  } else if (baseStore) {
    baseDataCache.promise
      .then((data) => applyBaseDataToStore(baseStore, data))
      .catch(() => {
        // errors handled in the original promise path
      });
  }

  return baseDataCache.promise;
};

export const ensureBaseDataLoaded = async () => {
  const baseStore = useBaseStore();
  const data = await fetchBaseData(baseStore);
  return data;
};

class VosoolAppInitializer extends AppInitializer {
  constructor() {
    super();
  }

  protected override async runInitialization(): Promise<AppInitializationResult> {
    if (import.meta.env.DEV) {
      console.log('[VosoolAppInitializer] runInitialization start');
    }
    const customerInfoStore = useCustomerInfoStore();
    const customizerStore = useCustomizerStore();
    const baseStore = useBaseStore();

    customizerStore.SET_LOADING(true);
    customerInfoStore.clearError();

    if (import.meta.env.DEV) {
      console.log('[VosoolAppInitializer] Fetching user info');
    }
    // const userInfo = await api.user.getUserInfo();
    // customerInfoStore.setUserInfo(userInfo.data);
    //
    // if (userInfo.data.customizer) {
    //   const { customizer } = userInfo.data;
    //   customizerStore.actTheme = validateTheme(customizer.actTheme);
    //   customizerStore.fontTheme = validateFontTheme(customizer.fontTheme);
    //   customizerStore.inputBg = validateInputBg(customizer.inputBg);
    //   customizerStore.themeMode = validateThemeMode(customizer.themeMode);
    //   customizerStore.layoutType = validateLayoutType(customizer.layoutType || 'SideBar');
    // }

    await fetchBaseData(baseStore);

    if (import.meta.env.DEV) {
      console.log('[VosoolAppInitializer] runInitialization completed');
    }
    return { baseDataReady: true };
  }

  protected override handleInitializationError(error: unknown): void {
    const customerInfoStore = useCustomerInfoStore();
    const message = error instanceof Error ? error.message : 'Failed to load application data';
    customerInfoStore.setError(message);
    super.handleInitializationError(error);
  }

  protected override onInitializationFinally(): void {
    const customizerStore = useCustomizerStore();
    customizerStore.SET_LOADING(false);
  }
}

const vosoolAppInitializer = new VosoolAppInitializer();

export const initializeApp = () => vosoolAppInitializer.initializeApp();
export const startInitialization = () => vosoolAppInitializer.startInitialization();
export const isAppInitialized = () => vosoolAppInitializer.isAppInitialized();
export const waitForInitialization = () => vosoolAppInitializer.waitForInitialization();
export const reinitializeApp = () => vosoolAppInitializer.reinitialize();
