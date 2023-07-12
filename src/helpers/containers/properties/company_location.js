import { dayMinutesToMoment } from "./../../data/datetime";

export const getDayFormField = (day, props, week_access={}) => {

    const CompanyLocationDetailFormItemLabelCol = {
        xs: { span: 13 },
        sm: { span: 11 },
        md: { span: 9 },
        lg: { span: 7 },
      };

      const CompanyLocationDetailFormItemWrapperCol = {
        xs: { span: 10 },
        sm: { span: 12 },
        md: { span: 14 },
        lg: { span: 16 },
      };

    const CompanyLocationDetailWrapperCol = {
        xs: { span: 22 },
        sm: { span: 16 },
        md: { span: 10 },
        lg: { span: 10 },
      };

    return (
        {
            name: day,
            type: "TimeRangePickerField",
            formItemProps: {
              label: props.intl.formatMessage({
                id: `general.days.${day}`,
              }),
              labelCol: CompanyLocationDetailFormItemLabelCol,
              wrapperCol: CompanyLocationDetailFormItemWrapperCol,
              initialValue: week_access? getInitialValue(week_access[day]) : 0,
            },
            fieldProps: {
              placeholder: props.intl.formatMessage({
                id: `general.days.${day}`,
              }),
            },
            wrapperCol: CompanyLocationDetailWrapperCol,
          }
    );
}

export const getInitialValue = (value) => {
  // console.log('value is',value);
  let  start, end;
  if (value) {
    value.map((obj) => {
      start = obj.earliest_time? dayMinutesToMoment(obj.earliest_time): 0;
      end = obj.latest_time? dayMinutesToMoment(obj.latest_time): 0 ;
    })
  }
  // console.log('[start,end]', [start,end]); 
  return [start, end];
};
