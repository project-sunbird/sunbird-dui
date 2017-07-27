
module Main where

import Control.Monad.Aff

import Utils

import Fragments.CommunityFragment
import Fragments.CourseFragment
import Fragments.ProfileFragment
import Fragments.ResourceFragment
import Fragments.HomeFragment

import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import Types.UITypes
import Types.APITypes
import UI


main :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
main = void $ launchAff $ splashScreenActivity

splashScreenActivity :: Aff(ui::UI,console::CONSOLE) String
splashScreenActivity = do
    event <- ui $ InitScreen
    case event of
        OPEN_UserActivity -> userActivity
        _ -> pure $ "SplashScreenActivity"


userActivity = do
    event <- ui $ UserActivity
    case event of
        API_SignUp { request: requestBody , api_token :token} -> do
            responseData <- userSignup requestBody token
            _ <- sendUpdatedState {response : responseData, responseFor : "API_SignUp", screen:"asas"} 
            pure $ "Aborted 3"
        OPEN_MainActivity -> mainActivity "{}" "UserActivity" "{}" 
        _ -> pure $ "UserActivity"

mainActivity input whereFrom whatToSendBack = do
    event <- ui $ MainActivity
    case event of
        OPEN_HomeFragment -> homeFragment input "MainActivity" input
        OPEN_CourseFragment -> courseFragment input "MainActivity" input
        OPEN_ResourceFragment -> resourceFragment input "MainActivity" input
        OPEN_CommunityFragment -> communityFragment input "MainActivity" input
        OPEN_ProfileFragment -> profileFragment input "MainActivity" input
        
        API_CourseFragment {user_token:x,api_token:y}-> do
            responseData <- getCoursesPageApi x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_CourseFragment", screen:"asas"} 
            pure $ "handled"
        API_ResourceFragment {user_token:x,api_token:y}-> do
            responseData <- getResourcePageApi x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_ResourceFragment", screen:"asas"}
            pure $ "handled"
        API_ProfileFragment {user_token:x,api_token:y}-> do
            responseData <- getProfileDetail x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_ProfileFragment", screen:"asas"}
            pure $ "handled"        
        _ -> mainActivity input whereFrom whatToSendBack


changeFlow = void $ launchAff $ mainActivity "{}" "LogInScreen" "Nothing"
