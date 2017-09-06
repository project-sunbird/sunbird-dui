
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");

var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

class ModuleCard extends View {
  constructor(props, children) {
    super(props, children);

  }

  handleClick = () =>{
      console.log("in card",this.props.index)
      this.props.onModuleClick(this.props.index);
  }

  render() {


    this.layout = (

      <LinearLayout
			width="165"
			height="130"
			margin="16,0,0,0"
			background = {this.props.item.moduleBackground? this.props.item.moduleBackground : "#229012FE" }
			orientation="vertical"
			gravity="center"
      cornerRadius="5"
			>
      <LinearLayout
        height="match_parent"
        width="match_parent"
        orientation="vertical"
        gravity="center"
        onClick={this.handleClick}>

              <ImageView
              	height="32"
              	width="32"
                margin = "0,0,0,8"
              	imageUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}
              />

              <TextView
              	text= {this.props.item.moduleName ? this.props.item.moduleName : window.___S.MODULE_NAME}
              	style={window.__TextStyle.textStyle.HINT.SEMI.LIGHT}
              	margin = "0,0,0,16"
              	alpha="0.66"
              	/>
        </LinearLayout>


       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = ModuleCard;
