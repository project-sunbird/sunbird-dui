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

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

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
              	text= {this.props.item.moduleName ? this.props.item.moduleName : "Module Name"}
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
