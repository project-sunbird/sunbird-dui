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


*/var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var Button = require('../../Sunbird/Button');

class PageOption extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "PageOption";
    //buttonItems : list of buttons
    // onButtonClick : function that
    // hideDivider : pass true to hide, otherwise no need to define 
  }

  handleClick = (data) => {
    this.props.onButtonClick(data);
  }

  getButtons = () => {
    var buttons
    if (this.props.buttonItems.length > 1) {
      buttons = this.props.buttonItems.map((item, i) => {
        var type = "BigButton_Primary_WB";
        if (parseInt(i) % 2 == 0) {
          type = "BigButton_Primary_DB";
        }
        return (<Button 
                      type={type}
                      text={item}
                      margin="10,0,10,0"
                      weight="1"
                      onClick={this.handleClick}/>)

      });
    } else {
      return (<Button type="BigButton_Primary_WB"
            weight="1"
            margin="10,0,10,0"
            text={this.props.buttonItems[0]}
            onClick={this.handleClick}/>)
    }

    return buttons;
  }



  render() {
    var text = this.props.text;


    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE}>
        <LinearLayout
          height="2"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_22}/>
        <LinearLayout
          height="match_parent"
          width="match_parent"
          margin="10,20,10,20">
       
            {this.getButtons()}
       
         </LinearLayout>     

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = PageOption;
