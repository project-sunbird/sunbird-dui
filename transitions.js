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
exports.animParams = {
  LinearIn: {
    a_duration: "400",
    a_scaleX: 0.7,
    a_scaleY: 0.7,
    a_alpha: 0
  },
  LinearOut: {
    translationX: '2000',
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    a_translationX: '0',
    a_duration: "400",
    bringToFront: 'true'
  },
  PushOut: {
    translationX: '1000',
    a_scaleX: 1,
    a_scaleY: 1,
    alpha: 1,
    a_translationX: '0',
    a_duration: "300",
    bringToFront: 'true'
  },
  PushIn: {
    a_alpha: 0
  },
  FlipOut: {
    a_duration: "400",
    a_scaleX: 1,
    a_scaleY: 1,
    a_alpha: 1,
    bringToFront: 'true'
  },
  FlipIn: {
    scaleX: 0,
    scaleY: 1,
    a_alpha: 0
  },
  EaseOut: {
    translationY: '2000',
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    a_translationY: '0',
    a_duration: "300",
    bringToFront: 'true',
    id: '0'
  },
  EaseIn: {
    a_duration: "400",
    a_scaleX: 0.2,
    a_scaleY: 0.2,
    a_alpha: 0,
    id: '0'
  },
  FadeOut: {
    a_duration: "400",
    a_scaleX: 1,
    a_scaleY: 1,
    a_alpha: 1,

  },
  FadeIn: {
    a_alpha: 0,
  }
}
