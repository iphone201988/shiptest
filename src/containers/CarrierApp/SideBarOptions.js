import { faTachometerAlt, faFileInvoiceDollar, faShippingFast, faBuilding, faMapMarkedAlt, faTruck, faUsers, faPlug,
faTabletAlt, faCalendarAlt, faCog, faHandHoldingDollar, faMoneyCheckDollar, faMessage, faFileInvoice } from '@fortawesome/free-solid-svg-icons'

const sideBarOptions = [
  // {
  //     key: 'dashboard',
  //     label: 'sidebar.dashboard',
  //     icon: faTachometerAlt,
  // },
  {
    key: 'quote_requests',
    label: 'shipping.sidebar.quotes',
    icon: faFileInvoiceDollar
	},
  {
    key: 'shipments',
    label: 'sidebar.shipments',
    icon: faShippingFast,
  },
  {
    key: 'company_locations',
    label: 'sidebar.company_locations',
    icon: faBuilding,
  },
  // {
  //   key: 'track',
  //   label: 'sidebar.track',
  //   icon: faMapMarkedAlt,
  // },
  {
    key: 'assets',
    label: 'carrier.sidebar.assets',
    icon: faTruck,
    children: [
      {
        key: 'vehicles',
        label:'Vehicles'
      },
      {
        key: 'trailers',
        label:'Trailers'
      }
    ]
  },
  {
    key: 'users',
    label: 'sidebar.users',
    leftIcon: 'fas fa-users',
    icon: faUsers
  },
  {
    key: 'integrations',
    label: 'carrier.sidebar.integrations',
    icon: faPlug
  },
  {
    key: 'devices',
    label: 'carrier.sidebar.devices',
    icon: faTabletAlt
  },
  {
    key: 'schedule',
    label: 'sidebar.schedules',
    icon: faCalendarAlt,
  },
  {
    key: 'settings',
    label: 'sidebar.settings',
    icon: faCog
  },
  {
    key: 'rates',
    label: 'sidebar.rates',
    icon: faHandHoldingDollar
  },
  {
    key: 'billing',
    label: 'menu.billing',
    icon: faMoneyCheckDollar,
    children: [
      {
        key: 'billing_profiles',
        label:'menu.billing_profiles'
      },
      {
        key: 'invoices',
        label: 'menu.invoices',
        leftIcon: 'ion-clipboard',
        icon: faFileInvoice
      },
    ]
  },
  // {
  //   key: 'chat',
  //   label: 'sidebar.chat',
  //   icon: faMessage,
  // },
];
export default sideBarOptions;
