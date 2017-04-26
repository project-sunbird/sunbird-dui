var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class ModuleCard extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";


  }


  render() {


    this.layout = (

      <LinearLayout
			width="match_parent"
			height="wrap_content"
			width="135"
			height="100"
			margin="5,5,5,5"
			background = {this.props.item.moduleBackground? this.props.item.moduleBackground : "#229012FE" }
			orientation="vertical"
			gravity="center"
			>
					
              <ImageView
              	height="32"
              	width="32"
              	margin="5,5,5,5"
              	imageUrl={this.props.item.moduleImage ? this.props.item.moduleImage : "ic_account"}
              /> 

              <TextView
              	text= {this.props.item.moduleName ? this.props.item.moduleName : "Module Name"}
              	color="#979797"
              	margin="5,5,5,5"
              	alpha="0.66"
              	/>	
                    		
	                	
       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = ModuleCard;
