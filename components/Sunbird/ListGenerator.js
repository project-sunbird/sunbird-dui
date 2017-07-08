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
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ListView = require("@juspay/mystique-backend").androidViews.ListView;

var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

class ListGenerator extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "listGenerator";
    this.setIds([
      'list',
      'item1',
      'lItem',
      'rItem',
    ]);
    this.jsonArray = [];
    this.indexToModify = 0;
  }

  populateJsonArray = (list) => {
    list.map((item, i) => {
      var cmd = "";
      var listItem;
      var listItemLayout = (
        <LinearLayout
        height="50"
        margin="12,6,12,6"
        background="#cccccc"
        width="match_parent">
          <TextView
            color="#00ffff"
            weight="1"
            id = {this.idSet.lItem}
            margin="5,5,5,5"
            onClick={()=>{console.log("CLICKED L BUTTON OF ",i); this.indexToModify =i ; this.updateListView() }}
            />

            <TextView
            color="#ff0000"
            weight="1"
            margin="5,5,5,5"
             id = {this.idSet.rItem}
            onClick={()=>{console.log("CLICKED R BUTTON OF ",i)}}
            text={"R of i:"+ i}
            />

        </LinearLayout>
      )

      var listItemLayout2 = (
        <LinearLayout
          >
        <LinearLayout
        height="100"
        margin="12,6,12,6"
        background="#cccccc"
        width="match_parent">

            <ImageView
              width="156"
              height="156"
              imageUrl={(i%3)==1?"ic_checked":"ic_unchecked"}
              margin="0,0,0,0"/>
          

            <TextView
            color="#ff0000"
            weight="1"
            margin="5,5,5,5"
             id = {this.idSet.lItem}
            onClick={()=>{console.log("CLICKED BUTTON OF ",i); this.indexToModify =i ; this.updateListView() }}
            text={"R of i:"+ i}
            />

        </LinearLayout>

        </LinearLayout>
      )

      var cmd = this.set({
        id: this.idSet.lItem,
        text: "L of i:" + i
      })

      //cmd = listItemLayout.setValues(item);
      if (i % 3 == 0) {

        cmd += this.set({
          id: this.idSet.rItem,
          text: "R of i:" + i
        })

        this.jsonArray.push({ view: this.getView(listItemLayout.render()), value: cmd, viewType: 1 });
      } else {
        this.jsonArray.push({ view: this.getView(listItemLayout2.render()), value: cmd, viewType: 1 });

      }
    });
  }

  showList = () => {
    var list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    this.populateJsonArray(list);

    JBridge.listViewAdapter(
      this.idSet.list,
      JSON.stringify(this.jsonArray),
      1
    );
  }

  generateList = (list, callbackFunction, typeCount) => {
    var callback;

    this.populateJsonArray(list);
    callback = callbackMapper.map((params) => {
      callbackFunction(params[0]);
    });

    JBridge.listViewAdapter(
      this.idSet.list,
      JSON.stringify(this.jsonArray),
      callback,
      typeCount ? typeCount : 1
    );
  }

  isNewList = (list) => {

  }

  addListItems = (list) => {
    if (!this.isNewList)
      return;

    this.populateJsonArray(list);
    JBridge.listViewAdapterAddItem(
      JSON.stringify(this.jsonArray)
    );
  }

  textChange = (data) => {
    this.indexToModify = data
  }


  updateListView = () => {
    var tempJsonArray = [];
    var cmd = "";
    var listItem;
    var listItemLayout = (
      <LinearLayout
        height="50"
        margin="12,6,12,6"
        background="#cccccc"
        width="match_parent">
          <TextView
            color="#00ffff"
            weight="1"
            id = {this.idSet.lItem}
            margin="5,5,5,5"
            onClick={()=>{console.log("CLICKED MODIFY LBUTTON OF ",this.indexToModify)}}
            />

            <TextView
            color="#ff0000"
            weight="1"
            margin="5,5,5,5"
             id = {this.idSet.rItem}
            onClick={()=>{console.log("CLICKED MODIFY R BUTTON OF ",this.indexToModify)}}
            
            />

        </LinearLayout>
    )

    var cmd = this.set({
      id: this.idSet.lItem,
      text: "AMIT:" + this.indexToModify
    })
    cmd += this.set({
      id: this.idSet.rItem,
      text: "indexToModify:" + this.indexToModify
    })


    tempJsonArray.push({ view: this.getView(listItemLayout.render()), value: cmd, viewType: 1 });
    JBridge.replaceListVIewItem(parseInt(this.indexToModify), JSON.stringify(tempJsonArray))
  }

  render() {
    this.layout = (
      <LinearLayout
              height="match_parent"
              width="match_parent"
              orientation="vertical">

             <LinearLayout
                  height="50"
                  width="match_parent">
                   <EditText
                    width="0"
                    weight="1"
                    height="50"
                    onChange={this.textChange}/>

                    <TextView 
                      height="match_parent"
                      text="apply"
                      onClick={this.updateListView}
                      />

                </LinearLayout>  
      <ListView
        afterRender={this.showList}
        id={this.idSet.list}
        width="match_parent"
        height="match_parent"/>

         </LinearLayout>
    )
    return this.layout.render();
  }
}

module.exports = ListGenerator;
