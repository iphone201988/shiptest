import moment from "moment";


export function datetime_moment(date_str) {

  try{
    return moment(date_str)
  }catch (e) {
    return undefined
  }
}

export function secondsToTimeString(seconds, LanguageFormatMessage, show_days =true){
	return DurationTimeString(secondsToTimeDict(seconds, show_days),
		LanguageFormatMessage)
}

export function secondsToTimeDict(seconds, show_days=false) {


	const time_dict = {}
	if (show_days){
		time_dict.days = Math.floor(seconds / (3600*24))
		time_dict.hours = Math.floor(seconds % (3600*24) / 3600)
		time_dict.minutes =  Math.floor(seconds % 3600 / 60)
	}else{
		time_dict.hours = Math.floor(seconds / 3600)
		time_dict.minutes =  Math.floor(seconds % 3600 / 60)
	}

	return time_dict
}

export function DurationTimeString (durationDict, LanguageFormatMessage, show_day=true) {

	const days = durationDict.days
	const hours = durationDict.hours
	const minutes = durationDict.minutes

	const hours_str = hours > 1 ? LanguageFormatMessage({id: "datetime.hours"}) :
		LanguageFormatMessage({id: "datetime.hour"})
	const minutes_str = minutes > 1 ? LanguageFormatMessage({id: "datetime.minutes"}) :
		LanguageFormatMessage({id: "datetime.minute"})

	if (days){

		const day_str = days > 1 ? LanguageFormatMessage({id: "datetime.days"}) :
			LanguageFormatMessage({id: "datetime.day"})


		return `${days} ${day_str}, ${hours} ${hours_str}, ${minutes} ${minutes_str}`
	}else{
		return `${hours} ${hours_str}, ${minutes} ${minutes_str}`
	}

}

export function secondToHHMM(seconds) {
	var date = new Date(null);
	date.setSeconds(seconds); // specify value for SECONDS here
	return date.toISOString().substr(11, 5);
}

export function dateNow () {
	// Date now in seconds
	return Math.floor(Date.now()/1000)
}

export const momentToDayMinutes = (value) => {
	try {
	  if(value){
		const hour = (moment(value).hours());
		const min =  (moment(value).minutes());
		return (hour * 60) + min
	  }
	  return 0
	} catch (error) {
	  return 0;
	}
  };
  
  export const dayMinutesToMoment = (minutes) => {
	const hour = Math.floor(minutes/60);
	const minute = minutes % 60 ;
	const obj =  moment(`${hour}:${minute}`, 'hh:mm');
	return obj ;
  }

  export const epochToDateString = (seconds) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(seconds * 1000);
  };

  export const subtractDaysFromToday = (days) => {
	  return moment().subtract(days, 'days');
  }

export const datetimeFormat = (date) => {
	const formatDate = new Date(parseInt(date * 1000));
	return `${getMonthName(formatDate.getMonth())} ${formatDate.getDate()}${getOrdinalSuffix(formatDate.getDate())} ${formatDate.getFullYear()}`;
}

export function getMonthName(monthIndex) {
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return monthNames[monthIndex];
}

export function getOrdinalSuffix(day) {
	const suffixes = ['th', 'st', 'nd', 'rd'];
	const lastDigit = day % 10;
	const suffixIndex = lastDigit <= 3 && (day < 11 || day > 13) ? lastDigit : 0;
	return suffixes[suffixIndex];
}

const options = {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	hour12: true
};


export const localDateString = (date) => {
	return new Date(parseInt(date * 1000)).toLocaleDateString('en-US', options);
}

export const localDateAndTimeString = (date) => {
	return new Date(parseInt(date * 1000)).toLocaleTimeString('en-US', options);
}