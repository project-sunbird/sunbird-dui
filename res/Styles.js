/*
Copyright (c) 2012-2017 "JUSPAY Technologies"
JUSPAY Technologies Pvt. Ltd. [https://www.juspay.in]

This file is part of JUSPAY Platform.

JUSPAY Platform is free software: you can redistribute it and/or modify
it for only educational purposes under the terms of the GNU Affero General
Public License (GNU AGPL) as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
For Enterprise/Commerical licenses, contact <info@juspay.in>.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  The end user will
be liable for all damages without limitation, which is caused by the
ABUSE of the LICENSED SOFTWARE and shall INDEMNIFY JUSPAY for such
damages, claims, cost, including reasonable attorney fee claimed on Juspay.
The end user has NO right to claim any indemnification based on its use
of Licensed Software. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/agpl.html>.


*/
const Colors = require('./Colors').color;
const Font = require('./Font');

const BaseParams = {
  BigButton: {
    width: "match_parent",
    height: "48",
    cornerRadius: "3",
    gravity: "center",
    allowMultipleClicks: "true",
    orientation: "vertical"
  },
  SmallButton: {
    padding: "10,5,10,5",
    cornerRadius: "3",
    gravity: "center",
    allowMultipleClicks: "true"
  },
  StepperButton: {
    padding: "16,0,16,0",
    cornerRadius: "2",
    height: "36",
    gravity: "center",
    allowMultipleClicks: "true"
  },
  Alert: {
    width: "16",
    height: "16"
  }
}

exports.Params = {
  BigButton: {
    "Primary_WB_Layout": {
      background: Colors.PRIMARY_DARK,
      stroke: "2," + Colors.PRIMARY_DARK,
      style: BaseParams.BigButton
    },
    "Primary_DB_Layout": {
      background: Colors.PRIMARY_LIGHT,
      stroke: "2," + Colors.PRIMARY_LIGHT,
      style: BaseParams.BigButton
    },
    "Secondary_WB_Layout": {
      background: Colors.PRIMARY_LIGHT,
      stroke: "2," + Colors.PRIMARY_DARK,
      style: BaseParams.BigButton
    },
    "Secondary_DB_Layout": {
      background: Colors.PRIMARY_DARK,
      stroke: "2," + Colors.PRIMARY_LIGHT,
      style: BaseParams.BigButton
    }
  },
  SmallButton: {
    "WB_Secondary_Layout": {
      stroke: "2," + Colors.PRIMARY_DARK,
      style: BaseParams.SmallButton,
      background: Colors.TRANSPARENT,
    },
    "WB_Primary_Layout": {
      background: Colors.PRIMARY_DARK,
      stroke: "2," + Colors.PRIMARY_DARK,
      style: BaseParams.SmallButton
    },
    "DB_Secondary_Layout": {
      background: Colors.PRIMARY_DARK,
      stroke: "2," + Colors.PRIMARY_LIGHT,
      style: BaseParams.SmallButton
    },
    "DB_Primary_Layout": {
      background: Colors.PRIMARY_LIGHT,
      stroke: "2," + Colors.PRIMARY_LIGHT,
      style: BaseParams.SmallButton
    }
  },
  StepperButton: {
    "DB_LAYOUT": {
      background: Colors.PRIMARY_LIGHT,
      stroke: "2," + Colors.PRIMARY_DARK,
      style: BaseParams.StepperButton
    },
    "WB_LAYOUT": {
      background: Colors.PRIMARY_DARK,
      stroke: "2," + Colors.PRIMARY_LIGHT,
      style: BaseParams.StepperButton
    }
  },
  Alert: {
    "Success_Image": {
      style: BaseParams.Alert,
      color: Colors.GREEN,
    },
    "Pending_Image": {
      style: BaseParams.Alert,
      color: Colors.YELLOW,
    },
    "Failed_Image": {
      style: BaseParams.Alert,
      color: Colors.RED,
    }
  },
  IconStyle: {
    width: "48",
    height: "48",
    padding: "12,12,12,12"
  },

}
