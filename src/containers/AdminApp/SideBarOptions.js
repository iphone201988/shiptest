import { faTachometerAlt, faShippingFast, faTruck, faUsers, faCalendarAlt, faMoneyCheckDollar, faWarehouse } from '@fortawesome/free-solid-svg-icons'

const options = [
  {
    key: 'carrier_accounts',
    label: 'carrier accounts',
    icon: faTruck
  },
  {
    key: 'shipper_accounts',
    label: 'shipper accounts',
    icon: faWarehouse
  },{
    key: 'dashboard',
    label: 'sidebar.dashboard',
    icon: faTachometerAlt
  },
  {
    key: 'shipments',
    label: 'sidebar.shipments',
    icon: faShippingFast,
  },
  {
    key: 'users',
    label: 'sidebar.users',
    icon: faUsers,
    children: [
      {
        key:'admin_users',
        label: 'sidebar.admin_users'
      },
      {
        key: 'account_users',
        label: 'sidebar.account_users'
      }
    ]
  },
  {
    key: 'settings',
    label: 'sidebar.settings',
    icon: faCalendarAlt,
  },
  {
    key: 'billing',
    label: 'general.billing',
    icon: faMoneyCheckDollar
  },
];
export default options;
 