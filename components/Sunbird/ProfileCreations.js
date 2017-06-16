var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var _this;
class ProfileCreations extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this=this;

    this.data=[
      {
        "position":"All subjects class teacher",
        "place":"Balamandir, Vadgaon",
        "duration":"JUN ’10 - JUL ‘16 (6 YRS)"
      },
      {
        "position":"Chemistry teacher - Std VII & VIII",
        "place":"Balamandir, Vadgaon",
        "duration":"JUN ’10 - JUL ‘16 (6 YRS)"
      }
    ]

  }


  getHeader(){
    return (  <LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Creator of"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="View all"
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }

  getBody(input){
      return (<LinearLayout
                width="wrap_content"
                height="wrap_content"
                orientation="vertical"
                margin="12,0,0,0"
                >

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={input.position}
                    style={window.__TextStyle.textStyle.CARD.HEADING}/>

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={input.place}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={input.duration}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                </LinearLayout>)
  }

  creationBody(){

    var cards = this.data.map((item,i) => {
      return ( <LinearLayout
                gravity="center_vertical"
                margin="0,16,0,0"
                >

                <LinearLayout
                background={window.__Colors.WHITE_F4}
                width="44"
                height="44"/>

                {this.getBody(item)}

                </LinearLayout>)

    });

    return cards;

  }


  render() {
    this.layout= (
              <LinearLayout
                margin="0,16,0,0"
                orientation="vertical">

                {this.getHeader()}

                {this.creationBody()}

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileCreations;
