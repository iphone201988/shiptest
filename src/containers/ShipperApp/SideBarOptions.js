import { faTachometerAlt, faFileInvoiceDollar, faShippingFast, faBuilding, faMapMarkedAlt, faTruck, faUsers, faPlug,
  faTabletAlt, faCalendarAlt, faCog, faHandHoldingDollar, faMoneyCheckDollar, faMessage, faFileInvoice } from '@fortawesome/free-solid-svg-icons'

const sideBarOptions = [
  // {
  //   key: 'dashboard',
  //   label: 'shipping.sidebar.dashboard',
  //   icon: faTachometerAlt,
  // },
  {
    key: 'quote_requests',
    label: 'shipping.sidebar.quotes',
    icon: faFileInvoiceDollar
  },
  {
    key: 'shipments',
    label: 'shipping.sidebar.shipments',
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
  // {
  //   key: 'assets',
  //   label: 'carrier.sidebar.assets',
  //   icon: faTruck,
  // },
  // {
  //   key: 'vehicles',
  //   label: 'carrier.sidebar.vehicles',
  //   leftIcon: 'fas fa-truck',
  //   icon: faTruck,
  //   children: [
  //     {
  //     key: 'vehicles',
  //     label: 'carrier.sidebar.vehicles'
  //     },
  //     {
  //       key: 'trailers',
  //       label: 'carrier.sidebar.trailers'
  //     },
  // ]
  // },
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
    key: 'Schedules',
    label: 'sidebar.schedules',
    icon: faCalendarAlt,
    children: [
      {
        key: 'schedule',
        label: 'carrier.sidebar.schedule',
      },
    ]
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
        key: 'invoice',
        label: 'menu.invoices',
        leftIcon: 'ion-clipboard',
        icon: faFileInvoice
      },
      {
        key: 'payment_methods',
        label: 'menu.payment_methods',
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
  // {
  //   key: 'invoice',
  //   label: 'sidebar.invoice',
  //   icon: faFileInvoice
  // },
  // {
  //   key: 'documents',
  //   label: 'shipping.sidebar.documents',
  //   leftIcon: 'fas fas fa-file-invoice',
  // },
  {
    key: 'settings',
    label: 'general.settings',
    icon: faCog,
  }

];
export default sideBarOptions;
