{-
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


-}
module Main where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Maybe
import Flows.CommunityFlow
import Flows.CourseFlow
import Flows.ProfileFlow
import Flows.ResourceFlow
import Flows.FilterFlow
import Flows.NotificationFlow
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import Types.UITypes
import Types.APITypes
import UI


main :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
main = void $ launchAff $ begin


begin :: Aff(ui::UI,console::CONSOLE) String
begin = do
  action <- ui $ InitScreen
  case action of
    StartInit -> userScreenFlow
    _ -> pure $ "aborted"


userScreenFlow = do
  action <- ui UserScreen
  case action of
    LoginApiAction{userName:x,userPass:y} -> do
      --liftEff $ log "FOR UN :" <> x <> " PASS :" <> y
      responseData <- userLogin x y
      --userScreenFlow {state:"tab3"}
      _ <- sendUpdatedState {response : responseData, responseFor : "LoginApiAction", screen:"asas"} 
      pure $ "Aborted 3"
    SignUpApiAction{userName:x1,firstName:x2,password:x3,language:x4} -> do
      --liftEff $ log "FOR UN :" <> x <> " PASS :" <> y
      responseData <- userSignup x1 x2 x3 x4
      --userScreenFlow {state:"tab3"}
      _ <- sendUpdatedState {response : responseData, responseFor : "SignUpApiAction", screen:"asas"} 
      pure $ "Aborted 3"
    LoginAction -> do
      liftEff $ log $ "LoginAction"
      cFlow
    _ -> pure $ "Aborted"

cFlow = do
  liftEff $ log $ "Its in cFlow"
  action <- ui $ HomeScreen
  case action of
    ShowHome {name:x} -> do
      liftEff $ log $ "Action handled Show HomeScreen"
      pure $ "action handled"
    StartCourseFlow -> startCourseFlow action
    StartResourceFlow -> startResourceFlow action
    StartCommunityFlow -> startCommunityFlow action
    StartProfileFlow -> startProfileFlow action
    StartNotificationFlow -> startNotificationFlow action
    StartCoursePageApi -> do
                  liftEff $ log $ "START COURSE PAGE API"
                  responseData <- getCoursesPageApi
                  _ <- sendUpdatedState {response : responseData, responseFor : "StartCoursePageApi", screen:"asas"} 
                  pure $ "handled"
    StartResourcePageApi -> do
                  liftEff $ log $ "START RESOURCE PAGE API"
                  responseData <- getResourcePageApi
                  _ <- sendUpdatedState {response : responseData, responseFor : "StartResourcePageApi", screen:"asas"}
                  pure $ "handled"
    StartSearchFlow {filterDetails : details} -> startHomeSearchFlow details

    _ -> pure $ "aborted"

startHomeSearchFlow state = do
  liftEff $ log $ "Search FLow started"
  state <- ui $ SearchScreen {filterDetails:state}
  case state of
    ResourceDetailFlow {resourceDetails : details} -> startResourceDetailFlow details
    CourseInfoFlow {course : details} -> startCourseInfoFlow details
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    _ -> pure $ "aborted"


changeFlow = void $ launchAff $ cFlow

