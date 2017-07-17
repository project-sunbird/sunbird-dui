
module Flows.HomeFlow where

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


startHomeSearchFlow values = do
  liftEff $ log $ "Search FLow started"
  event <- ui $ SearchScreen {filterDetails:values}
  case event of
    ResourceDetailFlow {resourceDetails : details} -> startResourceDetailFlow details "HomeSearch" values
    CourseInfoFlow {course : details} -> startCourseInfoFlow details 
    SearchResourceFlow {course : details} -> startEnrolledCourseFlow details
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    _ -> pure $ "aborted"




