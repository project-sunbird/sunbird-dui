var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

import KeyboardKey from "./KeyboardKey";
 
var Colors = require("../../res/Colors").color;
var NUMBER_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['BL', '0', 'BR']
];

class NumericKeyboard extends View {
	constructor(props, children) {
		super(props, children);
     
		this.displayName="numeric_keyboard";

		this.setIds([
			'keyboard'
		]);
	}

	getKeyboardRow(keys) {
		return (
			<LinearLayout
				width="match_parent"
				height="wrap_content"
				orientation="horizontal"
				background={this.background}
				weight={"1"} >
				{keys}
			</LinearLayout>
		)
	}

	handleLongPress = () => {
		this.props._onLongPress();
	}

	renderKeyboard() {
		let keyboardRows = [];
		let keys = [];
		let keyboardKey;
		let _this = this;

		NUMBER_LAYOUT.map((row,index)=>{
			keys = [];
			row.map((key,index)=>{
				keyboardKey = (<KeyboardKey
     			invert = {this.props.invert}
					_onLongPress = {_this.handleLongPress}
					onKeyDown={(id, key)=>{_this.props.onKeyDown(key) }} 
					key = {key}/>
				)
				keys.push(keyboardKey);
			});
			keyboardRows.push(this.getKeyboardRow(keys));
		});

		return keyboardRows;
	}

	render() {
    let  background = this.props.invert ? "#FFFFFF" : Colors.NPCI_BLUE;
     
		this.layout =
			<LinearLayout
				id= {this.idSet.keyboard} 
				orientation="vertical"
				background={background} 
				padding="0,0,0,20"
				width="match_parent" height="wrap_content">
				{this.renderKeyboard()}
			</LinearLayout>

		return this.layout.render();
	}
}

module.exports = NumericKeyboard;
