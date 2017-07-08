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

module Utils where

import Prelude
import Data.String
import Data.List (List(..), fromFoldable)
import Data.List.Types
import Data.Identity
import Data.Foreign.Index
import Data.NonEmpty (NonEmpty(..), singleton, head, tail, (:|))
import Data.Foldable
import Data.Array
import Control.Monad.Eff
import Control.Monad.Aff (launchAff, Aff, makeAff, attempt)
import Control.Monad.Eff.Exception (Error, error, try)
import Control.Monad.Eff.Class (liftEff)
import Network.HTTP.StatusCode
import Network.HTTP.RequestHeader
import Data.HTTP.Method (Method(..))
import Data.Either
import Data.Maybe
import Data.Foreign
import Data.Foreign.Class
import Data.Foreign.Generic
import Data.Foreign.Index
import Data.Argonaut.Core as A
import Data.StrMap as StrMap
import Data.Tuple
import Control.Monad.Except.Trans
import Partial.Unsafe
import Data.Bifoldable
import Control.Monad.Eff.Class(liftEff)
import Control.Monad.Aff
import Prelude
import Control.Monad.Eff (Eff,kind Effect)
import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Aff.Console
import Control.Monad.Except (runExcept, throwError)
import Control.Monad.Except.Trans (ExceptT(..))
import Data.Either (Either(..))
import Data.Foreign (Foreign, ForeignError(..), F)
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (decodeJSON, defaultOptions, encodeJSON, genericDecode, genericEncode)
import Data.Foreign.Generic.Class (class GenericDecode, class GenericEncode)
import Data.Foreign.Generic.Types (SumEncoding)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Identity (Identity(..))
import Data.List.NonEmpty (NonEmptyList(..))
import Utils
import UI

foreign import ui' :: forall a c e. (Error -> Eff e Unit) -> (a -> Eff e Unit) -> c -> String -> Eff e Unit


-- getEulerLocation = "https://qa.ekstep.in"
getEulerLocation = "http://52.172.36.121:9000"
getApiKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMWE2OTgxOWQ0OTc0YzhiYjRlOTQ4YjMxMjBkYjg0NyJ9.AFu4mPKLuYhclntDjbri_L5FN-rQWXk9dVXhlYO2YcA"

    
type State a = {screen :: String |a}

type AffError e = (Error -> Eff e Unit)
type AffSuccess s e = (s -> Eff e Unit)
type ApiResponse = {status :: String, statusCode :: Int, response :: A.Json}
type ExceptionableAff e a = ExceptT Error (Aff e) a
type ExceptionableEff e a = ExceptT Error (Eff e) a

foreign import showUI' :: forall e a b. (AffSuccess (State a) e) -> (AffError e) -> (State b) -> Boolean -> Eff e Unit
foreign import callbackListner' :: forall e a b. (AffSuccess ({|a}) e) -> (AffError e) -> ({|b}) -> Boolean -> Eff e Unit
foreign import updateState' :: forall a b s1 s2 e. (AffSuccess (State s2) e) -> (AffError e) -> a -> (State s1) -> Eff e Unit
foreign import callAPI' :: forall e. (AffSuccess ApiResponse e) -> (AffError e) -> Method -> String -> A.Json -> Array RequestHeader -> Eff e Unit


foreign import sendUpdatedState' :: forall a b.(State a)-> b
foreign import saveToMemory :: String -> String -> Unit                           
foreign import readFromMemory :: String -> String                           

sendUpdatedState state = sendUpdatedState' state

get path headers =
  makeAff(\error success -> callAPI' success error GET ((getEulerLocation) <> path) (A.jsonEmptyObject) headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers

post path headers body =
  makeAff(\error success -> callAPI' success error POST ((getEulerLocation) <> path) body headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers


showUI screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> showUI' success error updatedState false)

genericUI :: forall a b e. Encode b => Decode b => a -> Array b -> Aff (ui::UI|e) b
genericUI a b = do
  res <- makeAff (\err sc -> (ui' err sc a (encodeJSON b)))
  isValidAction res

updateState changes state = makeAff(\error success -> updateState' success error changes state)

getUserId ::String
getUserId = readFromMemory "user_id"

getUserToken :: String 
getUserToken = readFromMemory "user_token"

--API CALLS
generateRequestHeaders =
  let filtered = filter (\x -> not $ snd(x) == "__failed")  [(Tuple "Authorization" ("Bearer " <> getApiKey))
                                                            ,(Tuple "X-Authenticated-Userid" "97fa1246-f259-380d-b2f9-a5f3221899c4") --user token
                                                            ,(Tuple "X-Consumer-ID" "7c03ca2e78326957afbb098044a3f60783388d5cc731a37821a20d95ad497ca8") --7c03ca2e78326957afbb098044a3f60783388d5cc731a37821a20d95ad497ca8
                                                            ,(Tuple "X-Device-ID" "X-Device-ID")
                                                            ,(Tuple "X-msgid" "8e27cbf5-e299-43b0-bca7-8347f7e5abcf")
                                                            ,(Tuple "ts" "2017-05-28 10:52:56:578+0530")  
                                                            ,(Tuple "Accept" "application/json")
                                                            ,(Tuple "X-Source" "web")
                                                            

                                                            ] in
  map (\x -> (RequestHeader (fst x) (snd x))) filtered



getDummyData =
  let requestUrl = "/v1/user/courses/user1"
      headers = (generateRequestHeaders) in
  (get requestUrl headers)

enrollCourse req=
  let requestUrl = "/v1/user/courses/enroll"
      headers = (generateRequestHeaders) in
 (post requestUrl headers req)

postExploreData req regTokens=
  let requestUrl = "/v1/page/assemble/learn.explore/org.sunbird.mobile"
      headers = (generateRequestHeaders) in
 (post requestUrl headers req)

getCoursesPageApi =
  let requestUrl = "/v1/page/assemble/Course"
      headers = (generateRequestHeaders) in
  (get requestUrl headers) 

getResourcePageApi =
  let requestUrl = "/v1/page/assemble/Resources" 
      headers = (generateRequestHeaders) in
  (get requestUrl headers)

userLogin userName userPass =
  let requestUrl = "/v1/user/login" 
      headers = (generateRequestHeaders)
      payload = A.fromObject (StrMap.fromFoldable [ (Tuple "userId" (A.fromString "unique API ID"))
                                                   , (Tuple "ts" (A.fromString "2013/10/15 16:16:3"))
                                                   , (Tuple "request" (A.fromObject (StrMap.fromFoldable  [ (Tuple "userName" (A.fromString userName))
                                                                                                          , (Tuple "password" (A.fromString userPass))
                                                                                                          , (Tuple "source" (A.fromString "web"))
                                                                                                          ])))
                                                   ]) in
  (post requestUrl headers payload)

userSignup userName firstName password language =
  let requestUrl = "/v1/user/create" 
      headers = (generateRequestHeaders)
      payload = A.fromObject (StrMap.fromFoldable [(Tuple "request" (A.fromObject (StrMap.fromFoldable  [ (Tuple "userName" (A.fromString userName))
                                                                                                          , (Tuple "firstName" (A.fromString firstName))
                                                                                                          , (Tuple "password" (A.fromString password))
                                                                                                          , (Tuple "language" (A.fromString "language"))
                                                                                                          ])))
                                                   ]) in
  (post requestUrl headers payload)



 

getExceptT value = ExceptT $ pure $ Right value
