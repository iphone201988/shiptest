import React, {PureComponent} from "react";
import Iframe from 'react-iframe'

const token = "1D7D45ED-E029-4E33-AAE2-2D6DB13A9331"

export default class SonarSignal extends PureComponent {

    baseQueryStr = `?token=${token}`

    getZips = () => {
        const {originZip, destinationZip} = this.props;

        if (originZip.length > 3 && destinationZip.length > 3) {
            return `${originZip.substring(0,3)}-${destinationZip.substring(0,3)}`
        }

        return ''
    }

    render(){
        const zipsQueryStr = this.getZips()
        if (zipsQueryStr.length > 0){
            const queryStr = this.baseQueryStr + `&zips=${zipsQueryStr}`
            const src = "https://widgets.freightwaves.com/apps/od-heat-guages/dist/" + queryStr
            return (<Iframe url={src} width="650" height="240" styles={{border:0}}></Iframe>)
        }
        return ""

    }
}
