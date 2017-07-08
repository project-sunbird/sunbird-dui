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
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;


class TextInputView extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "parentContainer"
    ]);
    this.displayName = "TextInputview";


  }

  handleOnChange = (data) => {
    console.log("TEXT CHANGE ", data)
    this.props._onChange(data);
  }

  render() {


    this.layout = (
      <LinearLayout
      id={this.idSet.parentContainer}
      width="match_parent"
      height="wrap_content"
      margin="0,2,0,2"
      orientation="vertical">

        <TextView
          text={this.props.labelText}
          padding="6,0,0,0"
          style={window.__TextStyle.textStyle.BOTTOMBAR.DEFAULT}
          width="match_parent"
          height="wrap_content"/>

        
            <EditText
              width="match_parent"
              height="wrap_content"
              singleLine="true"
              maxLine="1"
              color={this.props.color}
              hint={this.props.hintText}
              text={this.props.text?this.props.text:""}
              onChange={this.handleOnChange}/>
          
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = TextInputView;
