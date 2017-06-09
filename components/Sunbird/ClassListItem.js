var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
window.R = require("ramda");
class ClassListItem extends View {
  constructor(props, children) {
    super(props, children);
  }
  getData = () => {
    var answerLayout = this.props.data.values.map((item, index) => {
     return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="vertical">
                <LinearLayout
                width="match_parent"
                height="wrap_content"
                padding="16,26,16,0">
                <LinearLayout
                  width="32"
                  heigh="32"
                  background={item.color}
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
                        onClick={item.onMenuItemClick}
                        textFromHtml={item.subject}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.CARD.HEADING}/>
                      <Space
                        width="0"
                        weight="1" />
                      <TextView
                        textFromHtml={item.comment}
                        height="wrap_content"
                        visibility = {item.comment ? true : false}
                        style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                      <Space
                        width="0"
                        weight="1" />

                  </LinearLayout>

                  {this.getMenuItems(item,index)}

              </LinearLayout>
              <LinearLayout
                visibility={this.props.lineSeparator == "true" ?"visible":"gone"}
                width="match_parent"
                background={window.__Colors.PRIMARY_BLACK_22}
                height="1"/>

        </LinearLayout>)
    })

    return answerLayout;
  }



  handleItemClick(itemNo,logoNo){
    this.props.itemClick(itemNo,logoNo);
  }

  getMenuItems(data,cardNo){
    var layout = data.logo.map((item, index) => {
               return <LinearLayout
                    width="wrap_content"
                    height="wrap_content">
                    <ImageView
                        height="20"
                        width="20"
                        margin="0,0,16,0"
                        imageUrl= {item}
                        onClick={()=>{this.handleItemClick(cardNo,index)}}
                        />
                      <Space
                        height="1"
                        width="0"
                        weight="1"/>
                  </LinearLayout>
            })

    return (
            <LinearLayout
            width="wrap_content"
            height="wrap_content">
            {layout}
            </LinearLayout>
      )
  }

  render() {


    this.layout = (

      <LinearLayout
			width="match_parent"
			height="wrap_content"
			orientation="vertical"
			>
      <ScrollView
          height="match_parent"
          width="match_parent"
          fillViewPort="true">
          <LinearLayout
            height="match_parent"
            width="match_parent"
            orientation="vertical">

                {this.getData()}

          </LinearLayout>
      </ScrollView>

       </LinearLayout>


    )

    return this.layout.render();
  }
}
module.exports = ClassListItem;
