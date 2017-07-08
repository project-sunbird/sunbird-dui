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

var Space = require('@juspay/mystique-backend').androidViews.Space;

window.R = require("ramda");


class SubjectListItem extends View {
  constructor(props, children) {
    super(props, children);

  }

  getData = () => {
    var answerLayout = this.props.data.values.map((item, index) => {
      return <LinearLayout
            width="match_parent"
            height="wrap_content"
            padding="16,16,16,16">

            <LinearLayout
              width="32"
              heigh="32"
              padding="0,0,0,0"
              background={window.__Colors.RED_10}
              gravity="center"
              >
            <ImageView
              height="20"
              width="14"
              imageUrl= {item.imageUrl} />

              </LinearLayout>
            <LinearLayout
                    height="wrap_content"
                    width="0"
                    weight="1"
                    padding="16,0,0,0"
                    orientation="vertical">
                      
                      <TextView
                        text={item.subject}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.CARD.HEADING}/>
                      <Space
                        width="0"
                        weight="1" />
                      <TextView
                        text={item.comment}
                        height="wrap_content"
                        visibility = {item.comment ? true : false}
                        style={window.__TextStyle.textStyle.HINT.REGULAR}/>  

                      <Space
                        width="0"
                        weight="1" />

                  </LinearLayout>

                  <LinearLayout
                    width="wrap_content"
                    height="match_parent"
                    >

                  <ImageView
                    height="20"
                    width="20"
                    margin="0,0,16,0"
                    imageUrl= {item.logo2} 
                    
                    />
                    <Space
                      height="1"
                      width="0"
                      weight="1"/>

                  <ImageView
                    height="20"
                    width="20"
                    imageUrl= {item.logo1} />
                  </LinearLayout>
        </LinearLayout>
    })

    return answerLayout;
  }

  render() {


    this.layout = (

      <LinearLayout
			width="match_parent"
			height="wrap_content"
			orientation="vertical"
			>

                {this.getData()}
                    		
	                	
       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = SubjectListItem;
