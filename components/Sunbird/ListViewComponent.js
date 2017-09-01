var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");

var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");

class ListViewComponent extends View {
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
            onClick={()=>{console.log("CLICKED L BUTTON OF ",i); this.indexToModify =i ; this.updateListView() }}/>

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

module.exports = ListViewComponent;
