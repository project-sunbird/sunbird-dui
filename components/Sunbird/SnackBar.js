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
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

class SnackBar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "CustomSnackBar";

    window.__SNACKBAR = this;

    this.setIds([
      "message",
      "action",
      "container"
    ]);
  }

  show = (hide) => {
    var cmd = "";

    cmd = this.set({
      id: this.idSet.container,
      a_translationY: "0",
      a_duration: "360"
    })

    Android.runInUI(
      cmd,
      null
    );

    if (typeof hide == "undefined" || hide) {
      setTimeout(() => {
        this.hide();
      }, 2000)
    }
  }

  hide = () => {
    var cmd = "";

    cmd = this.set({
      id: this.idSet.container,
      a_translationY: "360",
      a_duration: "360"
    })

    Android.runInUI(
      cmd,
      null
    );
  }

  setValues = (options) => {
    console.log("SET VALUES", options)
    let background = null;
    if (options.status == "success") {
      background = window.__Colors.SUCCESS_GREEN;
    } else if (options.status == "error") {
      background = window.__Colors.DARK_GRAY;
    } else {
      background = window.__Colors.ERROR_RED;
    }
    this.replaceChild(this.idSet.container, this.getBody(options, background, "undefined").render(), 0);


  }

  setAction = (options, onActionClick) => {
    let background = null;
    if (options.status == "success") {
      background = window.__Colors.SUCCESS_GREEN;
    } else if (options.status == "error") {
      background = window.__Colors.DARK_GRAY;
    } else {
      background = window.__Colors.ERROR_RED;
    }

    this.replaceChild(this.idSet.container, this.getBody(options, background, onActionClick).render(), 0);

  }

  getBody = (options, background, onActionClick) => {
    var text = options.text;
    var actionText = options.actionText;
    return (<LinearLayout
          height="match_parent"
          width="match_parent"
          background={background}
          root="true">
            <TextView
              id = {this.idSet.message}
              width = "0"
              weight= "1"
              gravity="center_vertical"
              height = "match_parent"
              style = {window.__TextStyle.textStyle.CARD.BODY.LIGHT}
              gravity = "center_vertical"
              text = {text ? text : ""}
              padding="16,8,8,8"
              />

            <TextView
              id = {this.idSet.action}
              width = "wrap_content"
              height = "52"
              gravity="center_vertical"
              style = {window.__TextStyle.textStyle.CARD.BODY.LIGHT}
              gravity = "center_vertical"
              onClick= {onActionClick}
              visibility = {actionText ? "visible" : "gone"}
              text = {actionText ? actionText : ""}
              padding="8,8,16,8"
              />
          </LinearLayout>)
  }
  render() {
    var text = this.props.message;
    var actionText = this.props.actionText;

    this.layout = (
      <LinearLayout
            height="wrap_content"
            alignParentBottom = "true,-1"
            translationY = "360"
            id={this.idSet.container}
            gravity="center_vertical"
            width="match_parent">

         <TextView
              id = {this.idSet.message}
              width = "0"
              weight= "1"
              gravity="center_vertical"
              margin="16,8,8,8"
              height = "match_parent"
              style = {window.__TextStyle.textStyle.CARD.BODY.LIGHT}
              gravity = "center_vertical"
              text = {text ? text : ""}/>

            <TextView
              id = {this.idSet.action}
              width = "wrap_content"
              height = "56"
              gravity="center_vertical"
              margin="8,8,16,8"
              style = {window.__TextStyle.textStyle.CARD.BODY.LIGHT}
              gravity = "center_vertical"
              onClick= {()=>{ console.log("ACTION CLICK"); this.props.onActionClick()}}
              visibility = {actionText ? "visible" : "gone"}
              text = {actionText ? actionText : ""}/>

        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = SnackBar;
