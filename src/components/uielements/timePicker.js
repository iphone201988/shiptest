import { TimePicker } from 'antd';
import AntDatePicker from './styles/datePicker.style';

const Timepicker = AntDatePicker(TimePicker);
const TimeRangepicker = AntDatePicker(TimePicker.RangePicker);

export default Timepicker;
export { TimeRangepicker };
