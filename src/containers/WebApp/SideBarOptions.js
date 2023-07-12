import { faWarehouse, faInfo, faComment, faShippingFast} from '@fortawesome/free-solid-svg-icons'

const options = [
  {
    key: 'shippers',
    label: 'web.sidebar.shippers',
    leftIcon: 'fas fa-warehouse',
    icon: faWarehouse,
  },
  {
    key: 'carriers',
    label: 'web.sidebar.carriers',
    icon: faShippingFast,
  },
  {
    key: 'about',
    label: 'web.sidebar.about',
    icon: faInfo
  },
  {
    key: 'contact',
    label: 'web.sidebar.contact',
    leftIcon: 'far fa-comment',
    icon: faComment
  },
];
export default options;
