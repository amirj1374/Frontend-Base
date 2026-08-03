// contract type
export const ContractTypeEnum = {
  one: '0',
  two: '1',
  three: '2'
} as const;

export type ContractType = (typeof ContractTypeEnum)[keyof typeof ContractTypeEnum];

export const ContractTypeOptions = [
  { title: ' دارای زمان بندی مذاکره آینده', value: ContractTypeEnum.one },
  { title: 'دارای مذاکره باز سررسید شده', value: ContractTypeEnum.two },
  { title: 'فاقد مذاکره', value: ContractTypeEnum.three }
];

// greenLicenseList type
export const GreenLicenseListTypeEnum = {
  FALSE: 'false',
  TRUE: 'true',
} as const;

export type GreenLicenseListType = (typeof GreenLicenseListTypeEnum)[keyof typeof GreenLicenseListTypeEnum];

export const GreenLicenseListTypeOptions = [
  { title: 'جواز سبز ندارد', value: GreenLicenseListTypeEnum.FALSE },
  { title: 'جواز سبز دارد', value: GreenLicenseListTypeEnum.TRUE }
];

// warningList type
export const WarningListTypeEnum = {
  one: '1',
  two: '2',
  three: '3'
} as const;

export type WarningListTypeEnumType = (typeof WarningListTypeEnum)[keyof typeof WarningListTypeEnum];

export const WarningListTypeEnumTypeOptions = [
  { title: 'اخطار اول', value: WarningListTypeEnum.one },
  { title: 'اخطار دوم', value: WarningListTypeEnum.two },
  { title: 'اخطار سوم', value: WarningListTypeEnum.three }
];

// payment type
export const ReferenceTypeEnum = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3'
} as const;

export type ReferenceEnumType = (typeof ReferenceTypeEnum)[keyof typeof ReferenceTypeEnum];

export const ReferenceEnumTypeOptions = [
  { title: 'حقوقی', value: ReferenceTypeEnum.zero },
  { title: 'تامین اندیش', value: ReferenceTypeEnum.one },
  { title: 'منطقه', value: ReferenceTypeEnum.two },
  { title: 'مدیریت وصول', value: ReferenceTypeEnum.three }
];

// message status types
export const MessageStatusEnum = {
  one: 1,
  two: 2,
  three: 3,
} as const;

export type MessageStatusEnumType = (typeof MessageStatusEnum)[keyof typeof MessageStatusEnum];

export const MessageStatusEnumOptions = [
  { title: 'در انتظار ارسال', value: MessageStatusEnum.one },
  { title: 'موفق', value: MessageStatusEnum.two },
  { title: 'ناموفق', value: MessageStatusEnum.three }
];

// customer type types
export const CustomerTypeEnum = {
  one: 'متعهد',
  two: 'ضامن',
  three: 'راهن',
} as const;

export type CustomerTypeEnumType = (typeof CustomerTypeEnum)[keyof typeof CustomerTypeEnum];

export const CustomerTypeEnumOptions = [
  { title: 'متعهد', value: CustomerTypeEnum.one },
  { title: 'ضامن', value: CustomerTypeEnum.two },
  { title: 'راهن', value: CustomerTypeEnum.three }
];

// type of insert types
export const TypeOfInsertEnum = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
} as const;

export type TypeOfInsertEnumType = (typeof TypeOfInsertEnum)[keyof typeof TypeOfInsertEnum];

export const TypeOfInsertEnumOptions = [
  { title: 'ورود', value: TypeOfInsertEnum.ADD },
  { title: 'خروج', value: TypeOfInsertEnum.REMOVE }
];

// white list level title
export const WhiteListLevelEnum = {
  ONE: '1',
  TWO: '2',
  THREE: '3'
} as const;

export type WhiteListLevelEnumType = (typeof WhiteListLevelEnum)[keyof typeof WhiteListLevelEnum];

export const WhiteListLevelEnumOptions = [
  { title: 'شعبه', value: WhiteListLevelEnum.ONE },
  { title: 'پرونده', value: WhiteListLevelEnum.TWO },
  { title: 'بانک', value: WhiteListLevelEnum.THREE }
];

// white list level title
export const RelativeTypeEnum = {
  MAINCUSTOMER: 'mainCustomer',
  GUARANTOR: 'guarantor',
  OBLIGE: 'oblige',
  PARTNERCUSTOMERS: 'partnerCustomers'
} as const;

export type RelativeTypeEnumType = (typeof RelativeTypeEnum)[keyof typeof RelativeTypeEnum];

export const RelativeTypeEnumOptions = [
  { title: 'متعهد', value: RelativeTypeEnum.MAINCUSTOMER },
  { title: 'ضامن', value: RelativeTypeEnum.GUARANTOR },
  { title: 'راهن', value: RelativeTypeEnum.OBLIGE },
  { title: 'شریک متعهد', value: RelativeTypeEnum.PARTNERCUSTOMERS }
];
