const Colors = require('./Colors').color;
const Font = require('./Font');
exports.textStyle = {
	activeTab:{
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_16,
		fontStyle : Font.fontStyle.Bold
	},
	inactiveTab:{
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_16,
		fontStyle : Font.fontStyle.Semibold
	},
	amountDisplay : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_30,
   	fontStyle : Font.fontStyle.Coderegular
	},
	listAmount : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_18,
   	fontStyle : Font.fontStyle.Codebold
	},
	bigBody : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_20,
   	fontStyle : Font.fontStyle.Regular
	},
	bigBodyWhite : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_20,
   	fontStyle : Font.fontStyle.Regular
	},
	smallBody : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_16,
		alpha : Font.opacity.SECONARY,
    fontStyle : Font.fontStyle.Regular
	},
	blueButton : {
		color : Colors.NPCI_BLUE,
		textSize : Font.fontSize.FONT_18,
    fontStyle : Font.fontStyle.Semibold
	},
	smallLabelBlack : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_14,
    fontStyle : Font.fontStyle.Semibold
	},
	fieldInputBlack : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_24,
    fontStyle : Font.fontStyle.Regular
	},
	heading : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_32,
    fontStyle : Font.fontStyle.Bold
	},
	headingLight : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_32,
    fontStyle : Font.fontStyle.Bold
	},
	listDivider : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_16,
   	fontStyle : Font.fontStyle.Codebold
	},
	detailsLable : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_14,
    fontStyle : Font.fontStyle.Regular
	},
	detailsDescription : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_16,
   	fontStyle : Font.fontStyle.Semibold
	},
	timeStampText : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_14,
      	fontStyle : Font.fontStyle.Regular,
      	alpha : Font.opacity.SECONARY
	},
	timeStampBold : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_14,
    fontStyle : Font.fontStyle.Bold,
    alpha : Font.opacity.SECONARY
	},
	statusAlert : {
		textSize : Font.fontSize.FONT_16,
    fontStyle : Font.fontStyle.Semibold
	},
	transactionStatus : {
		textSize : Font.fontSize.FONT_10,
    fontStyle : Font.fontStyle.Semibold
	},
	amountPlaceholder : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_36,
		alpha : Font.opacity.DISABLED,
    fontStyle : Font.fontStyle.Regular
	},
	amountInput : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_48,
    fontStyle : Font.fontStyle.Regular
	},
	whiteButton : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_18,
    fontStyle : Font.fontStyle.Semibold
	},
	darkButton : {
		color : Colors.NPCI_BLUE,
		textSize : Font.fontSize.FONT_18,
    fontStyle : Font.fontStyle.Semibold
	},
	smallLabelWhite : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_14,
		alpha : Font.opacity.SECONARY,
    fontStyle : Font.fontStyle.Semibold
	},
	smallLabelWhiteDisabled : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_14,
		alpha : Font.opacity.DISABLED,
    fontStyle : Font.fontStyle.Regular
	},
	fieldInputWhite : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_24,
    fontStyle : Font.fontStyle.Regular
	},
	fieldInputWhite : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_24,
    fontStyle : Font.fontStyle.Regular
	},
	paragraphContentWhite : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_18,
   	fontStyle : Font.fontStyle.Regular
	},
	paragraphHeadWhite : {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_30,
    fontStyle : Font.fontStyle.Bold
	},
	paragraphContent : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_18,
    fontStyle : Font.fontStyle.Regular
	},
	paragraphHead : {
		color : Colors.PRIMARY_BLACK,
		textSize : Font.fontSize.FONT_30,
    fontStyle : Font.fontStyle.Bold
	},
  bigAmount: {
		color : Colors.WHITE,
		textSize : Font.fontSize.FONT_50,
    fontStyle : Font.fontStyle.Bold
  }
}
