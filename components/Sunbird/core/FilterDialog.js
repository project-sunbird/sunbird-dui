
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



