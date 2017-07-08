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
exports.inputType = {
  TYPE_MASK_CLASS: 0x0000000f,
  TYPE_MASK_VARIATION: 0x00000ff0,
  TYPE_MASK_FLAGS: 0x00fff000,
  TYPE_NULL: 0x00000000,
  TYPE_CLASS_TEXT: 0x00000001,
  TYPE_TEXT_FLAG_CAP_CHARACTERS: 0x00001000,
  TYPE_TEXT_FLAG_CAP_WORDS: 0x00002000,
  TYPE_TEXT_FLAG_CAP_SENTENCES: 0x00004000,
  TYPE_TEXT_FLAG_AUTO_CORRECT: 0x00008000,
  TYPE_TEXT_FLAG_AUTO_COMPLETE: 0x00010000,
  TYPE_TEXT_FLAG_MULTI_LINE: 0x00020000,
  TYPE_TEXT_FLAG_IME_MULTI_LINE: 0x00040000,
  TYPE_TEXT_FLAG_NO_SUGGESTIONS: 0x00080000,
  TYPE_TEXT_VARIATION_NORMAL: 0x00000000,
  TYPE_TEXT_VARIATION_URI: 0x00000010,
  TYPE_TEXT_VARIATION_EMAIL_ADDRESS: 0x00000020,
  TYPE_TEXT_VARIATION_EMAIL_SUBJECT: 0x00000030,
  TYPE_TEXT_VARIATION_SHORT_MESSAGE: 0x00000040,
  TYPE_TEXT_VARIATION_LONG_MESSAGE: 0x00000050,
  TYPE_TEXT_VARIATION_PERSON_NAME: 0x00000060,
  TYPE_TEXT_VARIATION_POSTAL_ADDRESS: 0x00000070,
  TYPE_TEXT_VARIATION_PASSWORD: 0x00000080,
  TYPE_TEXT_VARIATION_VISIBLE_PASSWORD: 0x00000090,
  TYPE_TEXT_VARIATION_WEB_EDIT_TEXT: 0x000000a0,
  TYPE_TEXT_VARIATION_FILTER: 0x000000b0,
  TYPE_TEXT_VARIATION_PHONETIC: 0x000000c0,
  TYPE_TEXT_VARIATION_WEB_EMAIL_ADDRESS: 0x000000d0,
  TYPE_TEXT_VARIATION_WEB_PASSWORD: 0x000000e0,
  TYPE_CLASS_NUMBER: 0x00000002,
  TYPE_NUMBER_FLAG_SIGNED: 0x00001000,
  TYPE_NUMBER_FLAG_DECIMAL: 0x00002000,
  TYPE_NUMBER_VARIATION_NORMAL: 0x00000000,
  TYPE_NUMBER_VARIATION_PASSWORD: 0x00000010,
  TYPE_CLASS_PHONE: 0x00000003,
  TYPE_CLASS_DATETIME: 0x00000004,
  TYPE_DATETIME_VARIATION_NORMAL: 0x00000000,
  TYPE_DATETIME_VARIATION_DATE: 0x00000010,
  TYPE_DATETIME_VARIATION_TIME: 0x00000020
}
