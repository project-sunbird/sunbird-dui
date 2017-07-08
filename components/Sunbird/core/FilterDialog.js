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
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var objectAssign = require('object-assign');
window.R = require("ramda");
var Spinner = require('./Spinner');


class FilterDialog extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
    ]);
    this.state = state;
   

}



  getRows = () =>{

    this.data = [
      {
        title : "language",
        options : "Hindi,English,Marathi"
      },
      {
        title : "grade",
        options : "Hindi,English,Marathi"
      },
      {
        title : "domain",
        options : "Hindi,English,Marathi"
      },
      {
        title : "framework",
        options : "Hindi,English,Marathi"
      },
      {
        title : "concepts",
        options : "Hindi,English,Marathi"
      },
      {
        title : "type",
        options : "Hindi,English,Marathi"
      },
      {
        title : "subject",
        options : "Hindi,English,Marathi"
      },
      {
        title : "medium",
        options : "Hindi,English,Marathi"
      }

    ]

    var rows = this.data.map((item, index) => {

      return (<LinearLayout
                width="match_parent"
                height="wrap_content"
                margin="0,10,0,0"
                >

                <TextView
                width="wrap_content"
                height="wrap_content"
                text ={item.title}
                style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                <ViewWidget
                height="0"
                width="0"
                weight="1"/>

                <Spinner
                  id = {this.idSet.spinner}
                  background="#000000"
                  width = "wrap_content"
                  height = "wrap_content"
                  values = {item.options}
                  onItemClick = {this.onItemClick}/>


                </LinearLayout>)

    });

    return rows;
  }

  onItemClick = (params) =>{

  }



  getBody = () =>{
    return (
      <LinearLayout
        background={window.__Colors.WHITE}
        layout_gravity="center"
        width="match_parent"
        padding="16,16,16,16"
        height="match_parent"
        orientation="vertical">

      <TextView
        width="wrap_content"
        height="wrap_content"
        text = "Search Filter"
        margin="0,0,0,20"
        style={window.__TextStyle.textStyle.CARD.HEADING}/>


        {this.getRows()}

        </LinearLayout>
      )
  }

  
  afterRender = () => {
   
  }


  render() {
    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="300"
        height="500">
       
              <ScrollView
                height="match_parent"
                width="match_parent"
                fillViewport="true"
                >

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                  {this.getBody()}

                </LinearLayout>

                </ScrollView>
       
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = FilterDialog;



