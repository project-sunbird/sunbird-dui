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
exports.params = [{
    "age": 0,
    "facetFilters": [{
      "name": "gradeLevel",
      "values": [{
        "apply": false,
        "count": 3,
        "name": "kindergarten"
      }, {
        "apply": false,
        "count": 4,
        "name": "grade 1"
      }, {
        "apply": false,
        "count": 4,
        "name": "grade 2"
      }, {
        "apply": false,
        "count": 3,
        "name": "grade 3"
      }, {
        "apply": false,
        "count": 3,
        "name": "grade 4"
      }, {
        "apply": false,
        "count": 3,
        "name": "grade 5"
      }, {
        "apply": false,
        "count": 3,
        "name": "other"
      }]
    }, {
      "name": "domain",
      "values": [{
        "apply": false,
        "count": 1,
        "name": "numeracy"
      }, {
        "apply": false,
        "count": 3,
        "name": "literacy"
      }]
    }, {
      "name": "language",
      "values": [{
        "apply": false,
        "count": 3,
        "name": "english"
      }, {
        "apply": false,
        "count": 1,
        "name": "kannada"
      }]
    }, {
      "name": "ageGroup",
      "values": [{
        "apply": false,
        "count": 4,
        "name": "5-6"
      }]
    }, {
      "name": "contentType",
      "values": [{
        "apply": false,
        "count": 3,
        "name": "story"
      }, {
        "apply": false,
        "count": 1,
        "name": "worksheet"
      }]
    }],
    "grade": 0,
    "impliedFilters": [{
      "name": "status",
      "values": [{
        "apply": true,
        "count": 0,
        "name": "Live"
      }]
    }, {
      "name": "objectType",
      "values": [{
        "apply": true,
        "count": 0,
        "name": "Content"
      }]
    }],
    "limit": 25,
    "query": "html",
    "searchType": "FILTER",
    "sortCriteria": []
  }

];
