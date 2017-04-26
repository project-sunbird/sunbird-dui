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
      background: Colors.PRIMARY_LIGHT,
      stroke: "2," + Colors.PRIMARY_DARK,
      style: BaseParams.SmallButton
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
