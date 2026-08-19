import type { OrganizationAssignment, OrganizationModelResponse } from '../types/organization';

// تبدیل‌شده از فایل‌های واقعی people/departments/modules/manages/partof.
const people = [
  { id: 'mehran_mahdian_mahdian_caspco_ir', fullName: 'Mehran Mahdian', position: 'CTO / Manager', email: 'mahdian@caspco.ir' },
  { id: 'mostafa_kalantar_kalantar_caspco_ir', fullName: 'Mostafa Kalantar', position: 'Manager', email: 'kalantar@caspco.ir' },
  { id: 'pantea_sheikhvand_sheykhvand_caspco_ir', fullName: 'Pantea Sheikhvand', position: 'Manager', email: 'Sheykhvand@caspco.ir' },
  { id: 'behzad_esmailnezhad_esmaeilnezhad_caspco_ir', fullName: 'Behzad EsmailNezhad', position: 'Manager', email: 'EsmaeilNezhad@caspco.ir' },
  { id: 'mohammad_jalili_jalili_caspian_com', fullName: 'Mohammad Jalili', position: 'Manager', email: 'jalili@caspian.com' },
  { id: 'mohammad_haghgu_haghgoo_caspco_ir', fullName: 'Mohammad Haghgu', position: 'Manager', email: 'haghgoo@caspco.ir' },
  { id: 'ehsan_yazdanirad_yazdanirad_caspco_ir', fullName: 'Ehsan YazdaniRad', position: 'Manager', email: 'YazdaniRad@caspco.ir' }
];

const moduleKeys = ['com_caspian_banking_calendar','com_caspian_banking_system','com_caspian_banking_deposit','com_caspian_banking_service','com_caspian_banking_gateway','com_caspian_banking_lending','com_caspian_banking_collateral','com_caspian_banking_model','com_caspian_banking_message','com_caspian_banking_switch','com_caspian_banking_cardmanagement','com_caspian_banking_accounting','com_caspian_banking_acquirer','com_caspian_banking_atm','com_caspian_banking_batch','com_caspian_banking_bondmanagement','com_caspian_banking_cardwarehouse','com_caspian_banking_channelmanagement','com_caspian_banking_cif','com_caspian_banking_creditcard','com_caspian_banking_depositdraw','com_caspian_banking_ebanking','com_caspian_banking_foreignexchange','com_caspian_banking_gradual','com_caspian_banking_host-common','com_caspian_banking_iccheque','com_caspian_banking_interestmanagement','com_caspian_banking_loyalty','com_caspian_banking_outputmanagement','com_caspian_banking_pattern','com_caspian_banking_payment','com_caspian_banking_paymentfacilitator','com_caspian_banking_product','com_caspian_banking_thirdparty','com_caspian_banking_tradefinance','com_caspian_banking_treasury'];
const managedModules: Record<string, string[]> = {
  mehran_mahdian_mahdian_caspco_ir: moduleKeys,
  mostafa_kalantar_kalantar_caspco_ir: ['com_caspian_banking_service','com_caspian_banking_message','com_caspian_banking_switch'],
  pantea_sheikhvand_sheykhvand_caspco_ir: ['com_caspian_banking_calendar','com_caspian_banking_system','com_caspian_banking_deposit','com_caspian_banking_service','com_caspian_banking_gateway','com_caspian_banking_lending','com_caspian_banking_collateral','com_caspian_banking_model','com_caspian_banking_message','com_caspian_banking_accounting','com_caspian_banking_batch','com_caspian_banking_bondmanagement','com_caspian_banking_cif','com_caspian_banking_creditcard','com_caspian_banking_depositdraw','com_caspian_banking_ebanking','com_caspian_banking_foreignexchange','com_caspian_banking_gradual','com_caspian_banking_host-common','com_caspian_banking_iccheque','com_caspian_banking_interestmanagement','com_caspian_banking_loyalty','com_caspian_banking_pattern','com_caspian_banking_payment','com_caspian_banking_paymentfacilitator','com_caspian_banking_product','com_caspian_banking_thirdparty','com_caspian_banking_tradefinance','com_caspian_banking_treasury'],
  behzad_esmailnezhad_esmaeilnezhad_caspco_ir: ['com_caspian_banking_creditcard'],
  mohammad_jalili_jalili_caspian_com: ['com_caspian_banking_gateway','com_caspian_banking_payment'],
  mohammad_haghgu_haghgoo_caspco_ir: ['com_caspian_banking_service','com_caspian_banking_message','com_caspian_banking_cardmanagement'],
  ehsan_yazdanirad_yazdanirad_caspco_ir: ['com_caspian_banking_service','com_caspian_banking_lending','com_caspian_banking_message']
};

const assignments: OrganizationAssignment[] = [
  { id: 'manage-department-production', personId: 'mehran_mahdian_mahdian_caspco_ir', unitId: 'production', role: 'deputy_head', reportsToPersonId: null }
];
Object.entries(managedModules).forEach(([personId, modules]) => modules.forEach((unitId) => assignments.push({ id: `manage-${personId}-${unitId}`, personId, unitId, role: 'module_manager', reportsToPersonId: null })));

export const organizationModel: OrganizationModelResponse = {
  data: {
    summary: { companies: 0, deputies: 1, modules: 36, managers: 7, experts: 0 },
    units: [
      { id: 'production', type: 'deputy', name: 'تولید نرم افزار', description: 'production' },
      ...moduleKeys.map((key) => ({ id: key, type: 'module' as const, name: key.replace(/_/g, '.'), description: 'نسخه 1.3.16.0' }))
    ],
    people,
    unitRelations: moduleKeys.map((key) => ({ id: `partof-${key}-production`, parentUnitId: 'production', childUnitId: key })),
    assignments
  },
  meta: { generatedAt: '2026-08-19T00:00:00Z', version: '2.0' }
};
