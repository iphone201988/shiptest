import CoreModel from "../core/core";
import TrailerProfile from "./../asset/trailer"
import VehicleProfile from "./../asset/vehicle"
import CompanyAccount from "./../company/company";

export class UserProfile{

  constructor(data){
    data = data || {}
    this.first_name = data.first_name || ""
    this.last_name = data.last_name || ""
    this.email = data.email || ""
    this.phone = data.phone || ""
  }
}

export class ResourceAssignment {

	constructor(data){
			data = data || {}
			this.resource = new Resource(data.resource || {})
	}
}

export class Resource {

	constructor(data){
			data = data || {}
			this.id = data.id
			this.type = data.type
			if (this.type === 'vehicle'){
					this.profile = new VehicleProfile(data.profile)
			}else if(this.type === 'trailer'){
					this.profile = new TrailerProfile(data.profile)
			}
	}
}

export class Resources {

  constructor(data) {
    data = data || {}

    this.vehicles_assignments = this.resourceAssignments(data.vehicles_assignments)
    this.trailers_assignments = this.resourceAssignments(data.trailers_assignments)

    this.vehicles = this.resourcesIds(data.vehicles_assignments)
    this.trailers = this.resourcesIds(data.trailers_assignments)
  }

  resourceAssignments(resourceAssignments=[]) {
    return resourceAssignments.map(assignment => {
      return new ResourceAssignment(assignment)
    })
  }

  resourcesIds(resourceAssignments=[]) {
    const items = new Set()
    resourceAssignments.forEach(assignment => {
      items.add(assignment.resource.id)
    })
    return [...items]
  }
}

export default class User extends CoreModel {
  /**
   let userData = {profile: {email: values.email ,first_name: values.first_name,
                last_name: values.last_name, phone: values.phone_number, domain: "admin"}, roles: roles
        }
   */
  constructor(id, data){
    super(id)
    data = data || {}
    this.account_status = data.account_status || ""
    this.company = data.company
    this.company_account = new CompanyAccount(data.company_account)
    this.confirmed = data.confirmed || false
    this.firebase_uid = data.firebase_uid || ""
    this.profile = new UserProfile(data.profile || {})
    this.roles = data.roles || []
    this.domain = data.domain || ""
    this.role_types = data.role_types || []
    this.resources = data.resources ? new Resources(data.resources) : ""
  }
}






