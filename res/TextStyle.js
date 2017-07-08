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
const Colors = require('./Colors').color;
const Font = require('./Font');

exports.textStyle = {
  TITLE: {
    LIGHT: {
      color: Colors.WHITE,
      textSize: Font.fontSize.FONT_36,
      fontStyle: Font.fontStyle.EXTRABOLD
    },
    DARK: {
      color: Colors.PRIMARY_BLACK,
      textSize: Font.fontSize.FONT_36,
      fontStyle: Font.fontStyle.EXTRABOLD
    }
  },
  SYMBOL: {
    STATUSBAR: {
      TIME: {
        color: Colors.WHITE,
        textSize: Font.fontSize.FONT_14,
        fontStyle: Font.fontStyle.MEDIUM
      },
      LABEL: {
        color: Colors.WHITE,
        textSize: Font.fontSize.FONT_8,
        fontStyle: Font.fontStyle.SEMIBOLD
      }
    },
    KEYBOARD: {
      SYMBOL: {
        color: Colors.DIRT_GREEN,
        textSize: Font.fontSize.FONT_22,
        fontStyle: Font.fontStyle.MEDIUM
      },
      ALPHA: {
        color: Colors.DIRT_GREEN,
        textSize: Font.fontSize.FONT_22,
        fontStyle: Font.fontStyle.ROBOTO
      },
      ACTION: {
        color: Colors.DIRT_GREEN,
        textSize: Font.fontSize.FONT_14,
        fontStyle: Font.fontStyle.MEDIUM
      },
      SMALL: {
        color: Colors.DIRT_GREEN,
        textSize: Font.fontSize.FONT_10,
        fontStyle: Font.fontStyle.MEDIUM
      }
    }
  },
  HEADING: {
    LIGHT: {
      color: Colors.WHITE,
      textSize: Font.fontSize.FONT_20,
      fontStyle: Font.fontStyle.BOLD

    },
    DARK: {
      color: Colors.PRIMARY_BLACK,
      textSize: Font.fontSize.FONT_20,
      fontStyle: Font.fontStyle.BOLD
    }
  },
  TOOLBAR: {
    HEADING: {
      color: Colors.PRIMARY_BLACK,
      textSize: Font.fontSize.FONT_16,
      fontStyle: Font.fontStyle.SEMIBOLD
    }
  },
  CARD: {
    TITLE: {
      LIGHT: {
        color: Colors.WHITE,
        textSize: Font.fontSize.FONT_16,
        fontStyle: Font.fontStyle.BOLD
      },
      DARK: {
        color: Colors.PRIMARY_BLACK,
        textSize: Font.fontSize.FONT_16,
        fontStyle: Font.fontStyle.BOLD
      },
      SEMI_DARK: {
        color: Colors.PRIMARY_BLACK,
        textSize: Font.fontSize.FONT_12,
        fontStyle: Font.fontStyle.SEMIBOLD
      },
      REGULAR_BLACK: {
        color: Colors.PRIMARY_BLACK,
        textSize: Font.fontSize.FONT_12,
        fontStyle: Font.fontStyle.REGULAR
      },
      FADE_DARK: {
        color: Colors.DARK_GRAY,
        textSize: Font.fontSize.FONT_16,
        fontStyle: Font.fontStyle.BOLD
      }
    },
    BODY: {
      LIGHT: {
        color: Colors.WHITE,
        textSize: Font.fontSize.FONT_14,
        fontStyle: Font.fontStyle.REGULAR
      },
      DARK: {
        REGULAR: {
          color: Colors.DARK_GRAY,
          textSize: Font.fontSize.FONT_14,
          fontStyle: Font.fontStyle.REGULAR
        },
        BOLD: {
          color: Colors.PRIMARY_BLACK,
          textSize: Font.fontSize.FONT_14,
          fontStyle: Font.fontStyle.BOLD
        },
        REGULAR_BLACK: {
          color: Colors.PRIMARY_BLACK,
          textSize: Font.fontSize.FONT_14,
          fontStyle: Font.fontStyle.REGULAR
        },
        BLUE_R: {
          color: Colors.PRIMARY_ACCENT,
          textSize: Font.fontSize.FONT_14,
          fontStyle: Font.fontStyle.REGULAR
        }
      },
      FADED: {
        color: Colors.DARK_GRAY,
        textSize: Font.fontSize.FONT_14,
        fontStyle: Font.fontStyle.REGULAR
      }
    },
    ACTION: {
      LIGHT: {
        color: Colors.WHITE,
        textSize: Font.fontSize.FONT_14,
        fontStyle: Font.fontStyle.BOLD
      },
      BLUE: {
        color: Colors.PRIMARY_ACCENT,
        textSize: Font.fontSize.FONT_13,
        fontStyle: Font.fontStyle.BOLD
      }
    },
    HEADING: {
      color: Colors.PRIMARY_BLACK,
      textSize: Font.fontSize.FONT_14,
      fontStyle: Font.fontStyle.SEMIBOLD
    },
    HEADING_LIGHT: {
      color: Colors.DARK_GRAY,
      textSize: Font.fontSize.FONT_13,
      fontStyle: Font.fontStyle.REGULAR
    }
  },
  HINT: {
    BOLD: {
      color: Colors.DARK_GRAY,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.BOLD
    },
    DULL: {
      color: Colors.DARK_GRAY,
      textSize: Font.fontSize.FONT_14,
      fontStyle: Font.fontStyle.BOLD
    },
    WBOLD: {
      color: Colors.WHITE,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.BOLD
    },
    LIGHT: {
      color: Colors.WHITE,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.SEMIBOLD
    },
    SEMI: {
      color: Colors.DARK_GRAY,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.SEMIBOLD
    },
    SEMI_BLUE: {
      color: Colors.PRIMARY_DARK,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.SEMIBOLD
    },
    GREEN: {
      color: Colors.SUCCESS_GREEN,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.SEMIBOLD
    },
    REGULAR: {
      color: Colors.DARK_GRAY,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.REGULAR
    },
    RED: {
      color: Colors.ERROR_RED,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.SEMIBOLD
    },
    BLUE: {
      color: Colors.PRIMARY_ACCENT,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.SEMIBOLD
    }
  },
  TABBAR: {
    SELECTED: {
      color: Colors.PRIMARY_ACCENT,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.BOLD
    },
    WHITE: {
      color: Colors.WHITE,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.BOLD
    },
    DEFAULT: {
      color: Colors.PRIMARY_BLACK,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.BOLD
    }
  },
  BOTTOMBAR: {
    DEFAULT: {
      color: Colors.PRIMARY_BLACK,
      textSize: Font.fontSize.FONT_10,
      fontStyle: Font.fontStyle.SEMIBOLD
    },
    SELECTED: {
      color: Colors.PRIMARY_ACCENT,
      textSize: Font.fontSize.FONT_10,
      fontStyle: Font.fontStyle.SEMIBOLD
    }
  },
  FILTER: {
    REGULAR_BLUE: {
      color: Colors.PRIMARY_ACCENT,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.REGULAR
    },
    REGULAR_BLACK: {
      color: Colors.PRIMARY_BLACK,
      textSize: Font.fontSize.FONT_12,
      fontStyle: Font.fontStyle.REGULAR
    }
  },
  CLICKABLE: {
    BLUE_SEMI: {
      color: Colors.PRIMARY_ACCENT,
      textSize: Font.fontSize.FONT_14,
      fontStyle: Font.fontStyle.SEMIBOLD
    }
  },
  SECTION: {
    TITLE: {
      color: Colors.PRIMARY_ACCENT,
      textSize: Font.fontSize.FONT_14,
      fontStyle: Font.fontStyle.SEMIBOLD
    }
  }

};
