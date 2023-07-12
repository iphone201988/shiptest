import moment from "moment";


export default class Authority{

  constructor(data){
    this.authority_id = data.authority_id || ""
    this.status = data.status || ""
    // this.region_of_issue = new Location(data.region_of_issue || {})
    this.issue_date = new moment(data.issue_date)
    this.expiration_date = new moment(data.expiration_date)
  }
}
