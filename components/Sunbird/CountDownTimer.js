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


var TextView = require("@juspay/mystique-backend").androidViews.TextView;


class CountDownTimer extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "m0",
      "s0",
      "divider"
    ]);
    this.displayName = "count_down_timer";
    this.totalTime = parseInt(this.props.totalTime);

  }


  setStartTime = (startTime) => {
    this.totalTime = startTime;
    this.setTime(this.totalTime);
  }

  afterRender = () => {
    this.setTime(this.totalTime);
    this.startCountdown();
  }

  handleCountDownFinished = () => {
    this.props.onTimerEnd();
  }

  startCountdown = () => {
    if (this.totalTime < 0) {
      this.handleCountDownFinished();
      return;
    }
    this.setTime(this.totalTime);
    this.totalTime--;

    var _this = this;
    setTimeout(function() {
      _this.startCountdown();
    }, 1000);
  }

  setTime = (time) => {
    var cTime = parseInt(time)
    var minutes = parseInt(cTime / 60);
    var seconds = cTime - minutes * 60;
    var hourse = parseInt(minutes / 60);

    var cmd = this.set({
      id: this.idSet.s0,
      text: ("0" + seconds).slice(-2)
    })

    cmd += this.set({
      id: this.idSet.m0,
      text: ("0" + minutes).slice(-2)
    })
    Android.runInUI(cmd, 0);
  }



  handleSelectionEvent = () => {
    this.setStatus(!this.selectedStatus);
    this.props.onItemSelected(this.props.index, this.selectedStatus);

  }

  render() {


    this.layout = (
      <LinearLayout
      width="match_parent"
      gravity="center"
      afterRender={this.afterRender}
      height="wrap_content">

        <TextView
          height="wrap_content"
          width="wrap_content"
          color="#123123"
          text="00"
          style = {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          id={this.idSet.m0}/>

          <TextView
          height="wrap_content"
          width="wrap_content"
          text=":"
          style = {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          id={this.idSet.divider}/>

          <TextView
          text="00"
          style = {window.__TextStyle.textStyle.CARD.TITLE.DARK}
          height="wrap_content"
          width="wrap_content"
          id={this.idSet.s0}/>

        
        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CountDownTimer;
